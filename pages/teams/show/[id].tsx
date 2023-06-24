import React from "react";
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
  supabaseClient,
} from "src/utility";
import TabPanel from "@components/common/TabPanel";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const select = "*, teamMembers(id, user_id, status, profile:profiles(*))";

type Props = {
  initialTeam: TeamWithMembers;
};
export default function TeamShow({ initialTeam }: Props) {
  const [value, setValue] = React.useState(0);
  const { queryResult } = useShow<TeamWithMembers>({
    meta: {
      select,
    },
    queryOptions: {
      initialData: {
        data: initialTeam,
      },
    },
  });
  const { data, isLoading } = queryResult;
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

  return (
    <Show isLoading={isLoading || !record} canDelete={false} canEdit={false}>
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
        <TeamMembers teamMembers={record?.teamMembers ?? []} />
      </TabPanel>
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

  const team = await supabaseClient
    .from("teams")
    .select(select)
    .eq("id", context.query.id)
    .single();

  if (team.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      initialTeam: team.data,
      ...translateProps,
    },
  };
};
