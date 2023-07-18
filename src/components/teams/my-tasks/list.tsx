import React, { useCallback } from "react";
import { useTranslate } from "@refinedev/core";
import { useDataGrid, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Profile, TaskWithAssignee, TeamMemberWithProfile } from "src/types";
import { AvatarGroup, Chip, Stack, Typography } from "@mui/material";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import ImageAvatar from "@components/common/ImageAvatar";

type Props = {
  profile: Profile;
};

export const TableTasks = ({ profile }: Props) => {
  const t = useTranslate();

  const { dataGridProps, tableQueryResult } = useDataGrid({
    resource: "taskAssignments",
    meta: {
      select:
        "*, task:tasks(*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles!user_id(*))))",
    },
    filters: {
      permanent: [
        {
          field: "user_id",
          operator: "eq",
          value: profile.id,
        },
      ],
    },
    pagination: {
      pageSize: 10,
    },
  });

  const renderActions = React.useCallback((row: TaskWithAssignee) => {
    return (
      <Stack
        direction="row"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <Link href={`/teams/${row.team_id}/tasks/show/${row.id}`}>
          <RemoveRedEyeIcon color="primary" />
        </Link>
      </Stack>
    );
  }, []);

  const renderAssignee = (assignee: TeamMemberWithProfile) => {
    const fullName = assignee?.profile?.full_name || "";
    return (
      <ImageAvatar
        user={assignee.profile}
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
      </ImageAvatar>
    );
  };

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

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "title",
        flex: 1,
        headerName: t("tasks.fields.title"),
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
              {row?.taskAssignments?.map((taskAssignment: any) => {
                return renderAssignee(taskAssignment.assignee);
              })}
            </AvatarGroup>
          );
        },
      },
      {
        field: "actions",
        headerName: t("table.actions"),
        minWidth: 100,
        renderCell: function render({ row }) {
          return renderActions(row);
        },
        sortable: false,
        filterable: false,
      },
    ],
    [renderActions, renderPriority, renderStatus, t]
  );

  dataGridProps.rows = dataGridProps.rows.map((r: any) => r.task);

  return (
    <DataGrid
      {...dataGridProps}
      rows={tableQueryResult.isLoading ? [] : dataGridProps.rows}
      columns={columns}
      loading={tableQueryResult.isLoading}
      autoHeight
    />
  );
};
