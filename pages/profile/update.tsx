import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useNotification, useTranslate } from "@refinedev/core";

import { Create } from "@refinedev/mui";
import {
  Box,
  FormControl,
  FormHelperText,
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
import Head from "next/head";
import { useRouter } from "next/router";
import AvatarFileUpload from "@components/AvatarFileUpload";
import { ColorModeContext } from "@contexts/index";

export default function EditProfile() {
  const { open } = useNotification();
  const { profile: user, refreshProfile } = useContext(ColorModeContext);

  const router = useRouter();
  const t = useTranslate();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<Profile>({
    refineCoreProps: {
      resource: "profiles",
      action: "edit",
      id: user?.id,
    },
  });

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
      } else {
        open &&
          open({
            message: t("common.errors.unexpectedError"),
            type: "error",
          });
      }
    },
    [user, open, t, setValue, refreshProfile]
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
  console.log("errors", errors);
  return (
    <main>
      <Head>
        <title>
          {t("profiles.update") + " | " + t("documentTitle.default")}
        </title>
      </Head>
      <Create
        isLoading={formLoading}
        saveButtonProps={{
          ...saveButtonProps,
          disabled: !user,
          onClick: async () => {
            const data = getValues() as Profile;
            console.log(data);
            if (!data.avatar) {
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
              router.push("/profile");
            }
          },
        }}
        title={t("profiles.update")}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column" }}
          autoComplete="off"
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
        </Box>
      </Create>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const tProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...tProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/teams")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...tProps,
    },
  };
};
