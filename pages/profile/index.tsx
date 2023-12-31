import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslate } from "@refinedev/core";
import LoadingOverlay from "@components/common/LoadingOverlay";
import Head from "next/head";
import ShowProfile from "@components/users/Profile";
import { ColorModeContext } from "@contexts/index";
import { useContext } from "react";

export default function UsersProfile() {
  const { profile } = useContext(ColorModeContext);
  const t = useTranslate();

  return (
    <LoadingOverlay loading={!profile}>
      <Head>
        <title>
          {(profile ? profile?.full_name : t("loading")) +
            " | " +
            t("documentTitle.default")}
        </title>
      </Head>
      {profile && <ShowProfile profile={profile} isMe />}
    </LoadingOverlay>
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
