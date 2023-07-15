import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useNotification, useTranslate } from "@refinedev/core";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useContext, useEffect } from "react";
import { Profile } from "src/types";
import { updateMyProfile } from "src/services/users";
import Head from "next/head";
import { useRouter } from "next/router";
import { CompleteProfileNotificationContext } from "@contexts/CompleteProfileNotificationContext";

export default function EditProfile() {
  const { open } = useNotification();
  const { user, execute, loading } = useContext(
    CompleteProfileNotificationContext
  );

  const router = useRouter();
  const t = useTranslate();
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Profile>({
    refineCoreProps: {
      resource: "profiles",
      action: "edit",
      id: user?.id,
    },
  });

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (user) {
      setValue("first_name", user?.first_name);
      setValue("last_name", user?.last_name);
    }
  }, [user, setValue]);

  return (
    <main>
      <Head>
        <title>
          {t("profiles.update") + " | " + t("documentTitle.default")}
        </title>
      </Head>
      <Create
        isLoading={formLoading || loading}
        saveButtonProps={{
          ...saveButtonProps,
          disabled: !user,
          onClick: async () => {
            const data = getValues() as Profile;
            data.status = "active";
            const updated = await updateMyProfile(data);
            if (updated && open) {
              open({
                message: t("notifications.success"),
                type: "success",
              });
              execute();
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
