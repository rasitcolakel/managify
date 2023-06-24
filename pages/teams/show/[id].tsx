import React from "react";
import { useShow, useTranslate } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Team } from "src/types";
import { Avatar } from "@mui/material";

export default function TeamList() {
  const { queryResult } = useShow<Team>();
  const { data, isLoading } = queryResult;
  const t = useTranslate();
  const record = data?.data;

  const getTitleFirstLetters = React.useCallback(() => {
    if (!record?.title) {
      return "";
    }

    const words = record.title.split(" ");

    if (words.length === 1) {
      return words[0].slice(0, 2);
    }
    return `${words[0].slice(0, 1)}${words[1].slice(0, 1)}`;
  }, [record?.title]);

  return (
    <Show isLoading={isLoading} canDelete={false} canEdit={false}>
      <Head>
        <title>{t("documentTitle.teams.show", { title: record?.title })}</title>
      </Head>
      {/* Team Profile */}
      <Stack gap={5}>
        <Stack
          direction="row"
          padding={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" gap={2} alignItems="center">
            <Avatar
              alt={record?.title ?? ""}
              sx={{
                bgcolor: "primary.main",
                height: "4em",
                width: "4em",
              }}
            >
              {getTitleFirstLetters()}
            </Avatar>
            <Stack>
              <Typography variant="h5">{record?.title}</Typography>
              <Typography variant="body1">{record?.description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/* TODO: Tabs will be created */}
      {/* TODO: Members Tab */}
    </Show>
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
