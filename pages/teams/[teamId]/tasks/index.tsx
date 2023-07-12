import TeamTasks from "@components/teams/tasks";
import { TeamContext, TeamContextProvider } from "@contexts/TeamContext";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { authProvider } from "src/authProvider";

type Props = {};

export default function index({}: Props) {
  return (
    <TeamContextProvider>
      <TeamTasksList />
    </TeamContextProvider>
  );
}

const TeamTasksList = () => {
  const router = useRouter();

  const { data, isLoading } = useContext(TeamContext);

  const record = data?.data;

  useEffect(() => {
    if (!isLoading && !record) {
      router.push(`/teams`);
    }
  }, [record, isLoading, router]);
  if (!record) {
    return null;
  }

  return <TeamTasks team={record} />;
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/teams")}`,
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
