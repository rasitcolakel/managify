import React, { useEffect, useCallback } from "react";
import { useTranslate } from "@refinedev/core";
import { List, useDataGrid, DateField } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { getMyTeamMembershipsType } from "src/types";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { getMyTeamMemberships } from "src/services/teams";
import { TaskWithAssignee, TeamMemberWithProfile } from "src/types";
import { AvatarGroup, Chip, Stack, Typography } from "@mui/material";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import ImageAvatar from "@components/common/ImageAvatar";

export default function TeamList() {
  const t = useTranslate();
  const {
    execute: executeMyTeamMemberships,
    data: myTeamMemberships,
    loading,
  } = useAsyncFunction<any, getMyTeamMembershipsType>(getMyTeamMemberships);

  const { dataGridProps } = useDataGrid({
    resource: "taskAssignments",
    meta: {
      select:
        "*, task:tasks(*, taskAssignments(*, assignee:teamMembers(id, user_id, status, profile:profiles!user_id(*))))",
    },
    filters: {
      permanent: [
        {
          field: "team_member_id",
          operator: "in",
          value: myTeamMemberships,
        },
      ],
    },
    pagination: {
      pageSize: 10,
    },
  });

  useEffect(() => {
    executeMyTeamMemberships();
  }, [executeMyTeamMemberships]);

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
              {row.taskAssignments.map((taskAssignment: any) => {
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
    <List>
      <Head>
        <title>{t("documentTitle.tasks.my")}</title>
      </Head>
      <DataGrid
        {...dataGridProps}
        rows={loading ? [] : dataGridProps.rows}
        columns={columns}
        autoHeight
        loading={loading}
      />
    </List>
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
