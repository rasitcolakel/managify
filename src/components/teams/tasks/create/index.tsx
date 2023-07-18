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
import { useNotification, useTranslate } from "@refinedev/core";
import { useForm, Controller } from "react-hook-form";
import { TaskWithAssignee, TeamMemberWithProfile } from "src/types";
import { useRouter } from "next/router";
import { CreateTask, newTask, updateTask } from "src/services/tasks";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useEffect, useRef } from "react";
import QuillEditor from "./editor";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Head from "next/head";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Istanbul");

type Props = {
  task?: TaskWithAssignee;
};

export const TaskCreate = ({ task }: Props) => {
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

  const { autocompleteProps: teamMembersAutocompleteProps } =
    useAutocomplete<TeamMemberWithProfile>({
      resource: "teamMembers",
      meta: {
        select: "*, profile:profiles!user_id(*)",
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
      const processingTask = await (task
        ? updateTask(task.id, values)
        : newTask(values));
      if (!processingTask) {
        return;
      }
      await router.push(`/teams/${id}/tasks/show/${processingTask.id}`);
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

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue(
        "assignees",
        task.taskAssignments.map((p) => p.assignee)
      );
      setValue("priority", task.priority);
      setValue("status", task.status);
      if (task?.due_date) {
        setValue("due_date", new Date(task?.due_date));
      }
    }
  }, [task, setValue]);
  const onDescriptionChange = (value: any) => {
    setValue("description", value);
  };

  return (
    <>
      <Head>
        <title>
          {t("tasks.titles." + (task ? "edit" : "create")) +
            " | " +
            t("documentTitle.default")}
        </title>
      </Head>
      <Create
        saveButtonProps={{
          // ...saveButtonProps,
          onClick: handleSubmit(handleSave),
        }}
        title={t("tasks.titles." + (task ? "edit" : "create"))}
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
          <QuillEditor
            onChange={onDescriptionChange}
            value={task?.description || ""}
          />
          <Controller
            control={control}
            name="assignees"
            rules={{ required: "This field is required" }}
            defaultValue={[]}
            render={({ field }) => {
              const defaultIds = field.value.map((m: any) => m.id);
              const newValue = teamMembersAutocompleteProps.options.filter(
                (p) => defaultIds.includes(p.id)
              );
              const options = task
                ? teamMembersAutocompleteProps.options.filter(
                    (p) => !field.value?.find((v: any) => v === p)
                  )
                : teamMembersAutocompleteProps.options;
              return (
                <Autocomplete
                  {...teamMembersAutocompleteProps}
                  {...field}
                  options={options}
                  value={newValue}
                  multiple
                  clearOnBlur={false}
                  onChange={(_, value) => {
                    const newValue = value.map((p) => p);
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
            <InputLabel id="status-label">
              {t("tasks.fields.status")}
            </InputLabel>
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
                  format="dd/MM/yyyy HH:mm"
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
    </>
  );
};
