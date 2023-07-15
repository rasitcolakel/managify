import LoadingOverlay from "@components/common/LoadingOverlay";
import TaskCard from "@components/teams/tasks/TaskCard";
import styled from "@emotion/styled";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { blue, red, yellow } from "@mui/material/colors";
import { useShow, useTranslate } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { authProvider } from "src/authProvider";
import { TaskWithAssignee } from "src/types";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Avatar from "@mui/material/Avatar";
import {
  getFirstLettersOfWord,
  generateRandomColorWithName,
} from "src/utility";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Istanbul");

const StyledDescription = styled.div`
  margin: 1rem;
  p {
    margin: 0;
  }
`;

export default function TaskShow() {
  const router = useRouter();
  const t = useTranslate();
  const { id, teamId } = router.query as { teamId: string; id: string };

  const { queryResult } = useShow<TaskWithAssignee>({
    meta: {
      select:
        "*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles!user_id(*)))",
    },
    resource: "tasks",
    id,
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;

  useEffect(() => {
    if (!isLoading && !record) {
      router.push(`/teams/${teamId}/tasks`);
    }
  }, [record, isLoading, router, teamId]);

  const renderPriority = useCallback(
    (priority: string) => {
      const color =
        priority === "high"
          ? "error"
          : priority === "medium"
          ? "warning"
          : "success";

      return (
        <Chip
          label={t(`tasks.taskPriorities.${priority}`)}
          color={color}
          size="small"
        />
      );
    },
    [t]
  );
  const renderStatus = useCallback(
    (status: string) => {
      const color =
        status === "completed"
          ? "success"
          : status === "in_progress"
          ? "warning"
          : "error";

      return (
        <Chip
          label={t(`tasks.taskStatuses.${status}`)}
          color={color}
          size="small"
        />
      );
    },
    [t]
  );

  const renderAssignees = useCallback((assignees: any[]) => {
    return (
      <Grid container spacing={1}>
        {assignees.map((assignee) => {
          const { profile } = assignee.assignee;
          const name = `${profile?.first_name} ${profile?.last_name}`;
          return (
            <Grid item key={assignee.id}>
              <Chip
                label={name}
                avatar={
                  <Avatar
                    sx={{ bgcolor: generateRandomColorWithName(name) }}
                    src={profile?.avatar}
                    alt={name}
                  >
                    <Typography variant="body2" color="white">
                      {getFirstLettersOfWord(name)}
                    </Typography>
                  </Avatar>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, []);

  return (
    <main>
      <Head>
        <title>
          {record?.title
            ? t("documentTitle.teams.show", { title: record?.title })
            : t("tasks.titles.detail")}
        </title>
      </Head>
      <LoadingOverlay loading={!record && !isLoading}>
        {record && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {t("tasks.titles.detail")}
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6} lg={9}>
              <Paper sx={{ p: 2, mt: "1em" }}>
                <Typography variant="h6" sx={{ mb: 1 }} color="primary">
                  {record.title}
                </Typography>
                {record.description && (
                  <StyledDescription
                    dangerouslySetInnerHTML={{ __html: record.description }}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TaskCard
                    name={t("tasks.fields.assignees")}
                    value={renderAssignees(record.taskAssignments ?? [])}
                    icon={<GroupIcon color="inherit" />}
                    iconStyle={{
                      bgcolor: blue[500],
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TaskCard
                    name={t("tasks.fields.status")}
                    value={renderStatus(record.status ?? "")}
                    icon={<AssignmentIcon color="inherit" />}
                    iconStyle={{
                      bgcolor: yellow[800],
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TaskCard
                    name={t("tasks.fields.priority")}
                    value={renderPriority(record.priority ?? "")}
                    icon={<PriorityHighIcon color="inherit" />}
                    iconStyle={{
                      bgcolor: blue[800],
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TaskCard
                    name={t("tasks.fields.due_date")}
                    value={
                      record.due_date ? (
                        <Typography variant="body2">
                          {dayjs
                            .tz(new Date(record.due_date))
                            .format("YYYY-MM-DD HH:mm:ss")}
                        </Typography>
                      ) : (
                        "-"
                      )
                    }
                    icon={<EventNoteIcon color="inherit" />}
                    iconStyle={{
                      bgcolor: red[800],
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
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
