import React, { useEffect } from "react";
import { useShow, useTranslate } from "@refinedev/core";
import { Show } from "@refinedev/mui";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TeamWithMembers } from "src/types";
import { Avatar, Box, Tab, Tabs } from "@mui/material";
import { TeamMembers } from "@components/teams/members";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import TabPanel from "@components/common/TabPanel";
import { useRouter } from "next/router";
import LoadingOverlay from "@components/common/LoadingOverlay";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const select =
  "*, owner(*), teamMembers(id, user_id, status, profile:profiles(*))";

export default function TeamShow() {
  const router = useRouter();

  const [value, setValue] = React.useState(0);
  const { queryResult } = useShow<TeamWithMembers>({
    meta: {
      select,
    },
  });
  const { data, isLoading } = queryResult;
  console.log(data);
  const t = useTranslate();
  const record = data?.data;

  const getTitleFirstLetters = React.useCallback(() => {
    if (!record?.title) {
      return "";
    }

    return getFirstLettersOfWord(record?.title);
  }, [record?.title]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!isLoading && !record) {
      router.push("/teams");
    }
  }, [record, isLoading, router]);

  return (
    <LoadingOverlay loading={!record && !isLoading}>
      {record && (
        <Show
          isLoading={!record && !isLoading}
          canDelete={false}
          canEdit={false}
        >
          <Head>
            <title>
              {t("documentTitle.teams.show", { title: record?.title })}
            </title>
          </Head>
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
                    bgcolor: generateRandomColorWithName(record?.title ?? ""),
                    height: "4em",
                    width: "4em",
                  }}
                >
                  <Typography variant="h4" color="white">
                    {getTitleFirstLetters()}
                  </Typography>
                </Avatar>
                <Stack>
                  <Typography variant="h5">{record?.title}</Typography>
                  <Typography variant="body1">{record?.description}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label={`Members`} {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <TeamMembers team={record} />
          </TabPanel>
        </Show>
      )}
    </LoadingOverlay>
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
