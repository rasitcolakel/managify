import React, { useCallback } from "react";
import { DateField, List, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { TeamMemberWithProfile, TeamWithMembers } from "src/types";
import { Avatar, AvatarGroup, Chip, Typography } from "@mui/material";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import { useRouter } from "next/router";

type Props = IResourceComponentsProps & {
  team: TeamWithMembers;
};

export default function TeamTasks({ team }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const { dataGridProps } = useDataGrid({
    resource: "tasks",
    meta: {
      select:
        "*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles(*)))",
    },
    filters: {
      permanent: [
        {
          field: "team_id",
          operator: "eq",
          value: team.id,
        },
      ],
    },
  });

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

  const renderAssignee = (assignee: TeamMemberWithProfile) => {
    const fullName = assignee?.profile?.full_name || "";
    return (
      <Avatar
        sizes="small"
        sx={{
          bgcolor: generateRandomColorWithName(fullName),
          height: "1.5em",
          width: "1.5em",
        }}
        key={assignee.id}
      >
        <Typography variant="body2" color="white">
          {getFirstLettersOfWord(fullName)}
        </Typography>
      </Avatar>
    );
  };

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "title",
        flex: 1,
        headerName: t("tasks.fields.title"),
        minWidth: 200,
      },
      {
        field: "description",
        flex: 1,
        headerName: t("tasks.fields.description"),
        minWidth: 200,
      },
      {
        field: "priority",
        flex: 1,
        headerName: t("tasks.fields.priority"),
        minWidth: 200,
        renderCell: function render({ row }) {
          return renderPriority(row.priority);
        },
      },
      {
        field: "status",
        flex: 1,
        headerName: t("tasks.fields.status"),
        minWidth: 200,
        renderCell: function render({ row }) {
          return renderStatus(row.status);
        },
      },
      {
        field: "due_date",
        flex: 1,
        headerName: t("tasks.fields.due_date"),
        minWidth: 200,
        renderCell: function render({ row }) {
          return <DateField value={row.due_date} format="YYYY-MM-DD HH:mm" />;
        },
      },
      {
        field: "taskAssignments",
        flex: 1,
        headerName: t("tasks.fields.assigned_to"),
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <AvatarGroup max={4}>
              {row.taskAssignments.map((taskAssignment: any) => {
                return renderAssignee(taskAssignment.assignee);
              })}
            </AvatarGroup>
          );
        },
      },
    ],
    [renderPriority, renderStatus, t]
  );

  return (
    <List
      breadcrumb={false}
      title={t("tasks.title")}
      resource="tasks"
      createButtonProps={{
        href: `/teams/${team.id}/tasks/create`,
        onClick: () => {
          router.push(`/teams/${team.id}/tasks/create`);
        },
      }}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </List>
  );
}
