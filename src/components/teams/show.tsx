import React, { useContext, useEffect } from "react";
import { Show } from "@refinedev/mui";
import Head from "next/head";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Avatar, Box, Tab, Tabs } from "@mui/material";
import { TeamMembers } from "@components/teams/members";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import TabPanel from "@components/common/TabPanel";
import { useRouter } from "next/router";
import LoadingOverlay from "@components/common/LoadingOverlay";
import { TeamContext } from "@contexts/TeamContext";
import { checkIsTeamOwner } from "src/services/teams";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TeamShow() {
  const router = useRouter();

  const { data, isLoading, t } = useContext(TeamContext);

  const [value, setValue] = React.useState(0);

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

  const { data: isOwner, execute } = useAsyncFunction<
    typeof checkIsTeamOwner,
    boolean
  >(checkIsTeamOwner);

  useEffect(() => {
    if (!isLoading && !record) {
      router.push("/teams");
    }
  }, [record, isLoading, router]);

  useEffect(() => {
    if (!record) {
      return;
    }
    execute(record);
  }, [execute, record]);

  return (
    <LoadingOverlay loading={!record && !isLoading}>
      {record && (
        <Show
          isLoading={!record && !isLoading}
          canDelete={!!isOwner}
          canEdit={!!isOwner}
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
              <Tab label={t("teamMembers.title")} {...a11yProps(0)} />
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
