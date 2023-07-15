import LoadingOverlay from "@components/common/LoadingOverlay";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { TaskCreate } from "@components/teams/tasks/create";
import { useOne, useTranslate } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { authProvider } from "src/authProvider";
import { getTasksCreatedByUser } from "src/services/tasks";
import { TaskWithAssignee } from "src/types";

type Props = {};

export default function Index({}: Props) {
  const t = useTranslate();
  const router = useRouter();
  const { id, teamId } = useRouter().query as { teamId: string; id: string };
  const response = useOne<TaskWithAssignee>({
    resource: "tasks",
    meta: {
      select:
        "*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles!user_id(*)))",
    },
    id,
  });

  const record = response?.data?.data;

  const {
    execute,
    data: taskIds,
    loading,
  } = useAsyncFunction<any, number[]>(getTasksCreatedByUser);
  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (taskIds) {
      const index = taskIds.findIndex((t) => t === parseInt(id));
      if (index === -1) {
        router.push(`/teams/${teamId}/tasks`);
      }
    }
  }, [taskIds, teamId, router, id]);

  return (
    <main>
      <Head>
        <title>
          {record?.title
            ? t("documentTitle.teams.edit", { title: record?.title })
            : t("tasks.titles.detail")}
        </title>
      </Head>
      <LoadingOverlay loading={response.isLoading || loading}>
        <TaskCreate task={record} />
      </LoadingOverlay>
    </main>
  );
}

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
