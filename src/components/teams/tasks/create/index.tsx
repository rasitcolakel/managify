import { Create, useAutocomplete } from "@refinedev/mui";
import {
  Autocomplete,
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import {
  IResourceComponentsProps,
  // useList,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { useForm, Controller } from "react-hook-form";
import { TeamMemberWithProfile } from "src/types";
import { useRouter } from "next/router";
import { CreateTask, newTask } from "src/services/tasks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useEffect, useRef } from "react";
import QuillEditor from "./editor";

export const TaskCreate: React.FC<IResourceComponentsProps> = () => {
  const textareaRef = useRef<any>(null);

  const { open } = useNotification();
  const t = useTranslate();
  const router = useRouter();
  const { teamId: id } = router.query as { teamId: string };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  // const { data: tasks } = useList({
  //   resource: "tasks",
  //   meta: {
  //     select: "*",
  //   },
  //   filters: [
  //     {
  //       field: "team_id",
  //       operator: "eq",
  //       value: id,
  //     },
  //   ],
  // });

  // const generateFullUrlForTask = (taskId: string) => {
  //   return `/teams/${id}/tasks/${taskId}`;
  // };

  // const tasksMentions =
  //   tasks?.data.map((task) => {
  //     return {
  //       id: generateFullUrlForTask(task.id as string),
  //       display: task.title,
  //     };
  //   }) || [];

  const { autocompleteProps: teamMembersAutocompleteProps } =
    useAutocomplete<TeamMemberWithProfile>({
      resource: "teamMembers",
      meta: {
        select: "*, profile:profiles(*)",
      },
      filters: [
        {
          field: "team_id",
          operator: "eq",
          value: id,
        },
      ],
    });

  const handleSave = async () => {
    try {
      const values = getValues() as CreateTask;
      values.team_id = parseInt(id);
      const task = await newTask(values);
      if (!task) {
        return;
      }
      await router.push(`/teams/${id}/tasks/${task.id}`);
    } catch (e: any) {
      if (open) {
        open({
          message: e?.message ?? t("common.errors.unexpectedError"),
          type: "error",
        });
      }
    }
  };

  const priorityOptions = [
    { label: t("tasks.taskPriorities.low"), value: "low" },
    { label: t("tasks.taskPriorities.medium"), value: "medium" },
    { label: t("tasks.taskPriorities.high"), value: "high" },
  ];

  const statusOptions = [
    { label: t("tasks.taskStatuses.todo"), value: "todo" },
    { label: t("tasks.taskStatuses.in_progress"), value: "in_progress" },
    { label: t("tasks.taskStatuses.done"), value: "done" },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  const onDescriptionChange = (value: any) => {
    setValue("description", value);
  };

  return (
    <Create
      saveButtonProps={{
        // ...saveButtonProps,
        onClick: handleSubmit(handleSave),
      }}
    >
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("title", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={t("tasks.fields.title")}
          name="title"
        />
        <FormLabel
          sx={{
            marginTop: "1rem",
            marginBottom: "0.4rem",
          }}
        >
          {t("tasks.fields.description")}
        </FormLabel>
        <QuillEditor onChange={onDescriptionChange} />
        <Controller
          control={control}
          name="assignees"
          rules={{ required: "This field is required" }}
          defaultValue={[]}
          render={({ field }) => {
            const newValue = teamMembersAutocompleteProps.options.filter(
              (p) => field.value?.find((v: any) => v === p?.id) !== undefined
            );
            return (
              <Autocomplete
                {...teamMembersAutocompleteProps}
                {...field}
                value={newValue}
                multiple
                clearOnBlur={false}
                onChange={(_, value) => {
                  const newValue = value.map((p) => p?.id);
                  field.onChange(newValue);
                }}
                getOptionLabel={(item) => {
                  return (
                    teamMembersAutocompleteProps?.options?.find(
                      (p) => p?.id?.toString() === item?.id.toString()
                    )?.profile.full_name ?? ""
                  );
                }}
                isOptionEqualToValue={(option, value) => {
                  return (
                    value === undefined ||
                    option?.id?.toString() === value?.id?.toString()
                  );
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      id="assignees"
                      name="assignees"
                      label={t("tasks.fields.assigned_to")}
                      margin="normal"
                      variant="outlined"
                      error={!!(errors as any)?.assignees}
                      helperText={(errors as any)?.assignees?.message}
                      required
                    />
                  );
                }}
              />
            );
          }}
        />
        <FormControl
          fullWidth
          style={{
            marginTop: "1rem",
            marginBottom: "0.3rem",
          }}
        >
          <InputLabel id="priority-label">
            {t("tasks.fields.priority")}
          </InputLabel>
          <Select
            {...register("priority", {
              required: "This field is required",
            })}
            labelId="priority-label"
            id="priority"
            input={<OutlinedInput label={t("tasks.fields.priority")} />}
            defaultValue={priorityOptions[0].value}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          style={{
            marginTop: "1rem",
            marginBottom: "0.3rem",
          }}
        >
          <InputLabel id="status-label">{t("tasks.fields.status")}</InputLabel>
          <Select
            {...register("status", {
              required: "This field is required",
            })}
            labelId="status-label"
            id="status"
            input={<OutlinedInput label={t("tasks.fields.status")} />}
            defaultValue={statusOptions[0].value}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Controller
          rules={{ required: "This field is required" }}
          name={"due_date"}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                {...field}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    error: !!(errors as any)?.description,
                    helperText: (errors as any)?.title?.message,
                  },
                }}
                label="Due Date & Time"
                onChange={(value) => {
                  if (value) {
                    setValue("due_date", value);
                  }
                }}
                sx={{
                  marginTop: "1rem",
                  marginBottom: "0.3rem",
                }}
              />
            </LocalizationProvider>
          )}
        />
      </Box>
    </Create>
  );
};
