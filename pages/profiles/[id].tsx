import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslate } from "@refinedev/core";
import { Profile } from "src/types";
import LoadingOverlay from "@components/common/LoadingOverlay";
import Head from "next/head";
import { supabaseClient } from "src/utility";
import ShowProfile from "@components/users/Profile";

type Props = {
  data: Profile;
};

export default function UsersProfile({ data: profile }: Props) {
  const t = useTranslate();

  return (
    <LoadingOverlay loading={!profile}>
      <Head>
        <title>
          {profile?.full_name + " | " + t("documentTitle.default")}{" "}
        </title>
      </Head>
      <ShowProfile profile={profile} />
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

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", context.params?.id)
    .single();

  if (error) {
    return {
      props: {
        ...tProps,
      },
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...tProps,
      data,
    },
  };
};
