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
import {
  getFirstLettersOfWord,
  generateRandomColorWithName,
} from "src/utility";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import {
  getTasksCreatedByUser,
  updateTaskPriority,
  updateTaskStatus,
} from "src/services/tasks";
import { IconButton, Stack } from "@mui/material";
import Link from "@components/common/Link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskTimeline from "@components/teams/tasks/TaskTimeline";
import ImageAvatar from "@components/common/ImageAvatar";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Istanbul");

const StyledDescription = styled.div`
  margin: 1rem;
  p {
    margin: 0;
  }
`;

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({}) => ({
  "& .MuiPaper-root": {
    minWidth: 180,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.2)",
  },
}));

export default function TaskShow() {
  const router = useRouter();
  const t = useTranslate();
  const { id, teamId } = router.query as { teamId: string; id: string };
  const [statusEl, setStatusEl] = React.useState<null | HTMLElement>(null);
  const [priorityEl, setPriorityEl] = React.useState<null | HTMLElement>(null);

  const handleClickStatus = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStatusEl(event.currentTarget);
  };
  const handleCloseStatus = async (value: string) => {
    setStatusEl(null);
    if (value !== record?.priority && record) {
      await updateTaskStatus(record.id, record?.team_id, value);
      await queryResult.refetch();
    }
  };

  const handleClickPriority = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPriorityEl(event.currentTarget);
  };

  const handleClosePriority = async (value: string) => {
    setPriorityEl(null);
    if (value !== record?.priority && record) {
      await updateTaskPriority(record.id, record?.team_id, value);
      await queryResult.refetch();
    }
  };

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
        status === "done"
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
                  <ImageAvatar
                    user={profile}
                    sx={{
                      bgcolor: generateRandomColorWithName(name),
                      width: "2rem",
                      height: "2rem",
                    }}
                  >
                    <Typography variant="body2" color="white">
                      {getFirstLettersOfWord(name)}
                    </Typography>
                  </ImageAvatar>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }, []);

  const {
    execute,
    data: taskIds,
    loading,
  } = useAsyncFunction<any, number[]>(getTasksCreatedByUser);
  useEffect(() => {
    execute();
  }, [execute]);

  const isTaskCreator = taskIds?.includes(record?.id ?? 0);

  const priorityOptions = [
    { label: t("tasks.taskPriorities.low"), value: "low" },
    { label: t("tasks.taskPriorities.medium"), value: "medium" },
    { label: t("tasks.taskPriorities.high"), value: "high" },
  ];

  const statusOptions = [
    { label: t("tasks.taskStatuses.todo"), value: "todo" },
    { label: t("tasks.taskStatuses.in_progress"), value: "in_progress" },
    { label: t("tasks.taskStatuses.done"), value: "done" },
  ];

  const refresh = async () => {
    await queryResult.refetch();
  };

  const updateStatusMenu = () => {
    return (
      <>
        <IconButton
          id="update-status-button"
          aria-controls={Boolean(statusEl) ? "update-status-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(statusEl) ? "true" : undefined}
          onClick={handleClickStatus}
        >
          <SettingsIcon />
        </IconButton>
        <StyledMenu
          id="update-status-menu"
          anchorEl={statusEl}
          open={Boolean(statusEl)}
          onClose={handleCloseStatus}
          MenuListProps={{
            "aria-labelledby": "update-status-button",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              px: 2,
              py: 1,
            }}
          >
            {t("tasks.updateStatus")}
          </Typography>
          <Divider
            sx={{
              my: 1,
            }}
          />
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === record?.status}
              onClick={() => handleCloseStatus(option.value)}
            >
              {renderStatus(option.value)}
            </MenuItem>
          ))}
        </StyledMenu>
      </>
    );
  };

  const updatePriorityMenu = () => {
    return (
      <>
        <IconButton
          id="update-priority-button"
          aria-controls={
            Boolean(priorityEl) ? "update-priority-menu" : undefined
          }
          aria-haspopup="true"
          aria-expanded={Boolean(priorityEl) ? "true" : undefined}
          onClick={handleClickPriority}
          disabled={record?.status === "done"}
        >
          <SettingsIcon />
        </IconButton>
        <StyledMenu
          id="update-priority-menu"
          anchorEl={priorityEl}
          open={Boolean(priorityEl)}
          onClose={handleClosePriority}
          MenuListProps={{
            "aria-labelledby": "update-priority-button",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              px: 2,
              py: 1,
            }}
          >
            {t("tasks.updatePriority")}
          </Typography>
          <Divider
            sx={{
              my: 1,
            }}
          />
          {priorityOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === record?.priority}
              onClick={() => handleClosePriority(option.value)}
            >
              {renderPriority(option.value)}
            </MenuItem>
          ))}
        </StyledMenu>
      </>
    );
  };

  return (
    <main>
      <Head>
        <title>
          {record?.title
            ? t("documentTitle.teams.show", { title: record?.title })
            : t("tasks.titles.detail")}
        </title>
      </Head>
      <LoadingOverlay loading={!record && !isLoading && loading}>
        {record && (
          <Grid
            container
            spacing={2}
            sx={{
              position: "relative",
            }}
          >
            <Grid item xs={12}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {t("tasks.titles.detail")}
                </Typography>

                <Stack direction="row" spacing={2}>
                  {isTaskCreator && (
                    <Link
                      itemType="button"
                      href={`/teams/${teamId}/tasks/edit/${id}`}
                      buttonProps={{
                        variant: "outlined",
                        color: "primary",
                        startIcon: <EditIcon />,
                      }}
                    >
                      {t("actions.edit")}
                    </Link>
                  )}
                  {isTaskCreator && (
                    <Link
                      itemType="button"
                      href={`/teams/${teamId}/tasks/edit/${id}`}
                      buttonProps={{
                        variant: "outlined",
                        color: "error",
                        startIcon: <DeleteIcon />,
                      }}
                    >
                      {t("actions.delete")}
                    </Link>
                  )}
                </Stack>
              </Stack>

              <Divider sx={{ py: 1 }} />
            </Grid>
            <Grid item xs={12} lg={9}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TaskTimeline
                  id={id}
                  teamId={teamId}
                  refresh={refresh}
                  isDone={record?.status === "done"}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Grid
                container
                spacing={2}
                sx={{
                  position: "sticky",
                  top: 70,
                }}
              >
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
                    action={updateStatusMenu()}
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
                    action={updatePriorityMenu()}
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
