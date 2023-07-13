import { useTranslate } from "@refinedev/core";
import { AuthPage, ThemedTitleV2 } from "@refinedev/mui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import { authProvider } from "src/authProvider";

import { AppIcon } from "src/components/app-icon";

export default function Register() {
  const t = useTranslate();
  return (
    <main>
      <Head>
        <title>{t("documentTitle.auth.register")}</title>
      </Head>
      <AuthPage
        type="register"
        title={
          <ThemedTitleV2 collapsed={false} text="Managify" icon={<AppIcon />} />
        }
      />
    </main>
  );
}

Register.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated } = await authProvider.check(context);

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
