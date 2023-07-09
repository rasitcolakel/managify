import { Create, useAutocomplete } from "@refinedev/mui";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import {
  IResourceComponentsProps,
  useNotification,
  useTranslate,
} from "@refinedev/core";
import { Controller } from "react-hook-form";
import { TeamMemberWithProfile } from "src/types";
import { useRouter } from "next/router";
import { CreateTask, newTask } from "src/services/tasks";

export const TaskCreate: React.FC<IResourceComponentsProps> = () => {
  const { open } = useNotification();
  const t = useTranslate();
  const router = useRouter();
  const { teamId: id } = router.query as { teamId: string };
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    getValues,
  } = useForm();

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
      // await router.push(`/teams/${id}/tasks/${task.id}`);
    } catch (e: any) {
      if (open) {
        open({
          message: e?.message ?? t("common.errors.unexpectedError"),
          type: "error",
        });
      }
    }
  };
  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSave,
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
        <TextField
          {...register("description", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.description}
          helperText={(errors as any)?.description?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="text"
          label={t("tasks.fields.description")}
          name="description"
        />
        <Controller
          control={control}
          name="assignees"
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
                      label={t("tasks.fields.assignees")}
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
      </Box>
    </Create>
  );
};
