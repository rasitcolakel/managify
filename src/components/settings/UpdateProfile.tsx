import { useNotification, useTranslate } from "@refinedev/core";

import {
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useCallback, useContext, useEffect } from "react";
import { Profile } from "src/types";
import {
  getImageFromCDN,
  updateMyProfile,
  updateMyProfileImage,
} from "src/services/users";
import AvatarFileUpload from "@components/AvatarFileUpload";
import { ColorModeContext } from "@contexts/index";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";

type Props = {};

export default function UpdateProfile({}: Props) {
  const { open } = useNotification();
  const { profile: user, refreshProfile } = useContext(ColorModeContext);
  const router = useRouter();
  const t = useTranslate();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Profile>();

  useEffect(() => {
    if (user) {
      setValue("first_name", user?.first_name);
      setValue("last_name", user?.last_name);
    }
  }, [user, setValue]);

  const onAvatarChange = useCallback(
    async (avatar: File) => {
      if (!user) return;
      const resp = await updateMyProfileImage(user, avatar);
      if (resp) {
        open &&
          open({
            message: t("notifications.success"),
            type: "success",
          });
        setValue("avatar", avatar);
        refreshProfile();
        router.reload();
      } else {
        open &&
          open({
            message: t("common.errors.unexpectedError"),
            type: "error",
          });
      }
    },
    [user, open, t, setValue, refreshProfile, router]
  );

  const Avatar = useCallback(
    () => (
      <AvatarFileUpload
        onAvatarChange={onAvatarChange}
        initPreviewUrl={user?.avatar ? getImageFromCDN(user.avatar) : ""}
      />
    ),
    [onAvatarChange, user?.avatar]
  );

  const onSubmit = async () => {
    const data = getValues() as Profile;
    if (!data.avatar && !user?.avatar) {
      setError("avatar", {
        type: "required",
        message: "This field is required",
      });
      return;
    } else {
      setError("avatar", {
        type: "required",
        message: "",
      });
    }

    data.status = "active";
    const updated = await updateMyProfile(data);
    if (updated && open) {
      open({
        message: t("notifications.success"),
        type: "success",
      });
      refreshProfile();
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
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <FormControl sx={{ alignItems: "center" }}>
          <Avatar />
          {errors?.avatar?.message && (
            <FormHelperText
              sx={{
                pt: 2,
              }}
              error
            >
              {(errors as any)?.avatar?.message}
            </FormHelperText>
          )}
        </FormControl>
      </Stack>
      <TextField
        {...register("first_name", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.first_name}
        helperText={(errors as any)?.first_name?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        type="text"
        label={t("profiles.fields.first_name")}
        name="first_name"
      />
      <TextField
        {...register("last_name", {
          required: "This field is required",
        })}
        error={!!(errors as any)?.last_name}
        helperText={(errors as any)?.last_name?.message}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        type="text"
        label={t("profiles.fields.last_name")}
        name="last_name"
      />
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
