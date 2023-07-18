import React from "react";
import { useInfiniteList } from "@refinedev/core";
import { Profile, Task } from "src/types";
import Kanban from "@components/kanban";
import { Grid } from "@mui/material";

type Props = {
  profile: Profile;
};

export const KanbanTasks = ({ profile }: Props) => {
  const { data } = useInfiniteList({
    resource: "taskAssignments",
    meta: {
      select:
        "*, task:tasks(*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles!user_id(*))))",
    },
    filters: [
      {
        field: "user_id",
        operator: "eq",
        value: profile.id,
      },
    ],
    liveMode: "auto",
    pagination: {
      pageSize: 10,
    },
  });

  const tasks: Task[] = React.useMemo(() => {
    const tasks: Task[] = [];
    data?.pages.forEach((page) => {
      page.data.forEach((taskUpdate: any) => {
        tasks.push(taskUpdate.task);
      });
    });
    return tasks;
  }, [data]);

  return (
    <Grid
      container
      style={{
        height: "100%",
      }}
      justifyContent={"center"}
    >
      <Grid item xs={9}>
        <Kanban data={tasks} type="my" />
      </Grid>
    </Grid>
  );
};
