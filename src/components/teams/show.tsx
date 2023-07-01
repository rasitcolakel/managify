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
