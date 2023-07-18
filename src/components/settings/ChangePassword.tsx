import { useNotification, useTranslate } from "@refinedev/core";

import { Button, Paper, Stack, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useContext } from "react";
import { Profile } from "src/types";
import { changePassword, checkPassword } from "src/services/users";
import { ColorModeContext } from "@contexts/index";
import { Controller } from "react-hook-form";
import SaveIcon from "@mui/icons-material/Save";

type Props = {};

export default function ChangePassword({}: Props) {
  const { open } = useNotification();
  const { refreshProfile } = useContext(ColorModeContext);

  const t = useTranslate();
  const {
    control,
    handleSubmit,
    setError,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<Profile>();

  const fields = ["old_password", "password", "password_confirmation"];

  const onSubmit = async () => {
    const data = getValues() as any;
    const checkOldPassword = await checkPassword(data.old_password);

    if (!checkOldPassword) {
      open &&
        open({
          message: t("profiles.errors.current_password"),
          type: "error",
        });

      setError("old_password", {
        message: t("profiles.errors.current_password"),
      });

      return;
    }

    const resp = await changePassword(data.old_password, data.password);

    if (resp) {
      open &&
        open({
          message: t("notifications.success"),
          type: "success",
        });
      reset();
      refreshProfile();
    } else {
      open &&
        open({
          message: t("profiles.errors.current_password"),
          type: "error",
        });
      setError("old_password", {
        message: t("profiles.errors.current_password"),
      });
    }
  };

  return (
    <Paper
      elevation={3}
      component="form"
      sx={{ display: "flex", flexDirection: "column", p: 3 }}
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map((field) => (
        <Controller
          key={field}
          control={control}
          {...register(field, {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          render={({ field: renderField }) => (
            <TextField
              {...renderField}
              error={!!(errors as any)?.[field]}
              helperText={(errors as any)?.[field]?.message}
              margin="normal"
              fullWidth
              InputLabelProps={{ shrink: true }}
              type="password"
              label={t("profiles.fields." + field)}
              name={field}
            />
          )}
        />
      ))}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          fullWidth={false}
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          endIcon={<SaveIcon />}
        >
          {t("buttons.save")}
        </Button>
      </Stack>
    </Paper>
  );
}
