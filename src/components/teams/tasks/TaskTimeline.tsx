import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useList, useTranslate } from "@refinedev/core";
import { TaskUpdate } from "src/services/tasks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LabelIcon from "@mui/icons-material/Label";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { grey } from "@mui/material/colors";
import { ColorModeContext } from "@contexts/index";
import { Avatar, Divider, Paper, Stack, Typography } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { Profile, TaskUpdates } from "src/types";
import dayjs from "dayjs";
import NewComment from "./NewComment";
import styled from "@emotion/styled";

type TaskTimelineProps = {
  id: string;
  teamId: string;
  refresh: () => Promise<void>;
  isDone: boolean;
};

type TaskUpdateType = TaskUpdate["type"];

type ITaskUpdate = TaskUpdates & {
  type: TaskUpdateType;
  user: Profile;
};

const StyledDescription = styled.div`
  margin: 1rem;
  p {
    margin: 0;
  }
`;

export default function TaskTimeline({
  id,
  teamId,
  refresh,
  isDone,
}: TaskTimelineProps) {
  const t = useTranslate();
  const colorModeContext = React.useContext(ColorModeContext);
  const isDark = colorModeContext.mode === "dark";
  const { data } = useList<ITaskUpdate>({
    resource: "taskUpdates",
    meta: {
      select: "*, user:profiles(*)",
    },
    filters: [
      {
        field: "task_id",
        operator: "eq",
        value: id,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "asc",
      },
    ],
    liveMode: "auto",
    pagination: {
      pageSize: 100,
    },
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const taskUpdates = data?.data ?? [];

  const timelineDotIcon = React.useCallback(
    (type: TaskUpdateType) => {
      const iconProps = {
        sx: {
          color: isDark ? grey[400] : grey[600],
        },
      };
      switch (type) {
        case "create":
          return <AddBoxIcon {...iconProps} />;
        case "priority":
          return <LabelIcon {...iconProps} />;
        case "status":
          return <ChangeCircleIcon {...iconProps} />;
        case "comment":
          return <CommentIcon {...iconProps} />;
        default:
          return null;
      }
    },
    [isDark]
  );

  const readableDate = React.useCallback((date: string) => {
    const dateObj = dayjs(date);
    if (dateObj.isSame(dayjs(), "day")) {
      return dateObj.format("h:mm A");
    } else if (dateObj.isSame(dayjs(), "year")) {
      return dateObj.format("MMM D");
    } else {
      return dateObj.format("MMM D, YYYY");
    }
  }, []);

  const taskUpdateMessage = React.useCallback(
    (taskUpdate: ITaskUpdate) => {
      const date = readableDate(taskUpdate.created_at as string);
      let message = "";
      if (taskUpdate.type === "create") {
        message = t("tasks.taskChanges.created", {
          date: date,
        });
      } else if (taskUpdate.type === "priority") {
        const priority =
          t("tasks.taskPriorities." + taskUpdate.content) || taskUpdate.content;
        message = t("tasks.taskChanges.priority", {
          priority,
          date: date,
        });
      } else if (taskUpdate.type === "status") {
        const status =
          t("tasks.taskStatuses." + taskUpdate.content) || taskUpdate.content;
        message = t("tasks.taskChanges.status", {
          status,
          date: date,
        });
      } else if (taskUpdate.type === "comment") {
        message = t("tasks.taskChanges.commented", {
          date: date,
        });
      }

      if (taskUpdate.type === "comment") {
        return (
          <Paper sx={{ p: 1, flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems={"center"}>
              <Avatar
                alt={taskUpdate.user.full_name || ""}
                sx={{ width: "1.5em", height: "1.5em" }}
              />
              <Typography
                variant="body2"
                component="span"
                sx={{
                  mx: 1,
                  fontSize: "0.9rem",
                }}
              >
                {taskUpdate.user.full_name}
              </Typography>
              <Typography
                variant="body2"
                component="span"
                color="grey"
                sx={{
                  mx: 1,
                  fontSize: "0.9rem",
                }}
              >
                {message}
              </Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />

            <StyledDescription
              dangerouslySetInnerHTML={{ __html: taskUpdate.content || "" }}
            />
          </Paper>
        );
      }
      return message;
    },
    [readableDate, t]
  );

  // render timeline items with memoized
  const renderTimelineItems = React.useMemo(
    () =>
      taskUpdates.map((taskUpdate) => (
        <TimelineItem key={taskUpdate.id}>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                bgcolor: isDark ? grey[800] : grey[100],
              }}
            >
              {timelineDotIcon(taskUpdate?.type)}
            </TimelineDot>

            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent
            sx={{
              alignSelf: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems={"center"}>
              {taskUpdate.type !== "comment" && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems={"center"}
                  mx={{
                    xs: 1,
                  }}
                >
                  <Avatar
                    alt={taskUpdate.user.full_name || ""}
                    sx={{ width: "1.5em", height: "1.5em" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                    }}
                    component="span"
                  >
                    {taskUpdate.user.full_name}
                  </Typography>
                </Stack>
              )}

              {taskUpdateMessage(taskUpdate)}
            </Stack>
          </TimelineContent>
        </TimelineItem>
      )),
    [isDark, taskUpdateMessage, taskUpdates, timelineDotIcon]
  );

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {renderTimelineItems}
      <NewComment
        id={id}
        isDark={isDark}
        teamId={teamId}
        refresh={refresh}
        isDone={isDone}
      />
    </Timeline>
  );
}
