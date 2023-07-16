import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { useInfiniteList, useTranslate } from "@refinedev/core";
import { TaskUpdate } from "src/services/tasks";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LabelIcon from "@mui/icons-material/Label";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import * as colors from "@mui/material/colors";
import { ColorModeContext } from "@contexts/index";
import {
  Avatar,
  Divider,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { Profile, TaskUpdates } from "src/types";
import dayjs from "dayjs";
import NewComment from "./NewComment";
import { useInView } from "react-intersection-observer";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";

const container = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { translateY: -100, opacity: 0 },
  visible: {
    translateY: 0,
    opacity: 1,
  },
};

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

const StyledDescription = styled("div")`
  margin: 1rem;
  p {
    margin: 0;
  }
`;

const MotionTimelineDot = motion(
  // eslint-disable-next-line react/display-name
  React.forwardRef((props, ref) => (
    // @ts-ignore
    <RefreshIcon ref={ref} {...props} />
  ))
);

export default function TaskTimeline({
  id,
  teamId,
  refresh,
  isDone,
}: TaskTimelineProps) {
  const { ref, inView } = useInView();
  const t = useTranslate();
  const colorModeContext = React.useContext(ColorModeContext);
  const isDark = colorModeContext.mode === "dark";
  const { data, fetchNextPage, hasNextPage } = useInfiniteList<ITaskUpdate>({
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
        order: "desc",
      },
    ],
    liveMode: "auto",
    pagination: {
      pageSize: 5,
    },
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const taskUpdates = React.useMemo(() => {
    const taskUpdates: ITaskUpdate[] = [];
    data?.pages.forEach((page) => {
      page.data.forEach((taskUpdate) => {
        taskUpdates.push(taskUpdate);
      });
    });
    return taskUpdates;
  }, [data]);

  React.useEffect(() => {
    console.log("inView", inView);
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const timelineDotIcon = React.useCallback((type: TaskUpdateType) => {
    const iconProps = {
      sx: {
        color: "white",
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
  }, []);

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

  const timelineDotIconColor = React.useCallback((type: TaskUpdateType) => {
    switch (type) {
      case "create":
        return colors.green[800];
      case "priority":
        return colors.yellow[800];
      case "status":
        return colors.blue[800];
      case "comment":
        return colors.grey[800];
      default:
        return colors.grey[800];
    }
  }, []);

  const lastUpdate =
    (taskUpdates.length && taskUpdates[taskUpdates.length - 1]) || null;

  // render timeline items with memoized
  const renderTimelineItems = React.useMemo(
    () =>
      taskUpdates.map((taskUpdate) => (
        <motion.div key={taskUpdate.id} variants={item}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: timelineDotIconColor(taskUpdate?.type),
                }}
              >
                {timelineDotIcon(taskUpdate?.type)}
              </TimelineDot>

              {lastUpdate && lastUpdate.id !== taskUpdate.id && (
                <TimelineConnector />
              )}
              {hasNextPage && <TimelineConnector />}
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
        </motion.div>
      )),
    [
      hasNextPage,
      lastUpdate,
      taskUpdateMessage,
      taskUpdates,
      timelineDotIcon,
      timelineDotIconColor,
    ]
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
      <NewComment
        id={id}
        isDark={isDark}
        teamId={teamId}
        refresh={refresh}
        isDone={isDone}
      />
      <motion.div variants={container} initial="hidden" animate="visible">
        {renderTimelineItems}
      </motion.div>
      <TimelineItem
        ref={ref}
        style={{
          display: hasNextPage ? "flex" : "none",
        }}
      >
        <TimelineSeparator>
          <TimelineDot
            sx={{
              bgcolor: colors.green[800],
            }}
          >
            <MotionTimelineDot
              // @ts-ignore
              sx={{
                color: "white",
              }}
              animate={{
                rotate: 360,
                speed: 0.5,
              }}
              transition={{ repeat: Infinity }}
            />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent
          sx={{
            alignSelf: "center",
          }}
        >
          {t("actions.fetching")}
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}
