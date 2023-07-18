import {
  useNotification,
  useTranslate,
  useUpdatePassword,
} from "@refinedev/core";
import { AuthPage, ThemedTitleV2 } from "@refinedev/mui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { authProvider } from "src/authProvider";

import { AppIcon } from "src/components/app-icon";

export default function ForgotPassword() {
  const t = useTranslate();
  const { open } = useNotification();
  const { mutate: updatePassword } = useUpdatePassword();

  return (
    <main>
      <Head>
        <title>{t("documentTitle.auth.updatePassword")}</title>
      </Head>
      <AuthPage
        type="updatePassword"
        title={
          <ThemedTitleV2 collapsed={false} text="Managify" icon={<AppIcon />} />
        }
        formProps={{
          onSubmit: (formValues) => {
            updatePassword(formValues, {
              onSuccess: ({ success }) => {
                if (success) {
                  open &&
                    open({
                      description: t("notifications.success"),
                      message: t("auth.resetPassword.success"),
                      type: "success",
                    });
                }
              },
              onError: () => {
                open &&
                  open({
                    description: t("common.errors.unexpectedError"),
                    message: t("auth.resetPassword.error"),
                    type: "success",
                  });
              },
            });
          },
        }}
      />
    </main>
  );
}

ForgotPassword.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated } = await authProvider.check(context);
  console.log("authenticated", authenticated);
  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
