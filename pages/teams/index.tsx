import React, { useEffect } from "react";
import { useTranslate } from "@refinedev/core";
import {
  List,
  useDataGrid,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Profile, Team } from "src/types";
import Stack from "@mui/material/Stack";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { makeTeamActive, makeTeamDeleted } from "src/services/teams";
import useConfirmationModal from "@components/common/useConfirmationModal";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { IconButton } from "@mui/material";
export default function TeamList() {
  const t = useTranslate();
  const { dataGridProps, tableQueryResult } = useDataGrid({
    filters: {
      initial: [
        {
          field: "status",
          operator: "eq",
          value: "active",
        },
      ],
    },
    meta: {
      select: "*, owner(*)",
    },
  });

  const { execute, data: user } = useAsyncFunction<any, Profile>(
    authProvider.getIdentity
  );

  useEffect(() => {
    execute();
  }, [execute]);

  const { openModal, ConfirmationModal } = useConfirmationModal();

  const onDelete = React.useCallback(
    async (id: number) => {
      await makeTeamDeleted(id);
      tableQueryResult.refetch();
    },
    [tableQueryResult]
  );

  const openDeleteModal = React.useCallback(
    (id: number) => {
      openModal(() => onDelete(id), t("teams.deleteConfirmation"));
    },
    [onDelete, openModal, t]
  );

  const onRestore = React.useCallback(
    async (id: number) => {
      await makeTeamActive(id);
      tableQueryResult.refetch();
    },
    [tableQueryResult]
  );

  const openRestoreModal = React.useCallback(
    (id: number) => {
      openModal(() => onRestore(id), t("teams.restoreConfirmation"));
    },
    [onRestore, openModal, t]
  );

  const renderActions = React.useCallback(
    (row: Team) => {
      return (
        <Stack direction="row" flex={1}>
          <ShowButton size="small" hideText recordItemId={row.id} />
          {row.owner.id === user?.id && (
            <EditButton
              size="small"
              hideText
              recordItemId={row.id}
              color="success"
            />
          )}
          {row.owner.id === user?.id &&
            (row.status === "active" ? (
              <DeleteButton
                size="small"
                hideText
                onClick={() => openDeleteModal(row.id)}
              />
            ) : (
              <IconButton size="small">
                <RestoreFromTrashIcon
                  color="success"
                  fontSize="small"
                  onClick={() => openRestoreModal(row.id)}
                />
              </IconButton>
            ))}
        </Stack>
      );
    },
    [openDeleteModal, openRestoreModal, user?.id]
  );

  const columns = React.useMemo<GridColDef<Team>[]>(
    () => [
      {
        field: "id",
        headerName: t("teams.fields.id"),
        type: "number",
        minWidth: 50,
      },
      {
        field: "title",
        headerName: t("teams.fields.title"),
        minWidth: 200,
        flex: 1,
      },
      {
        field: "description",
        headerName: t("teams.fields.description"),
        minWidth: 200,
        flex: 1,
      },
      {
        field: "Owner",
        headerName: t("teams.fields.owner"),
        minWidth: 200,
        flex: 1,
        renderCell: function render({ row }) {
          return <span>{row.owner?.full_name}</span>;
        },
        sortable: false,
        filterable: false,
      },
      {
        field: "status",
        headerName: t("teams.fields.status"),
        minWidth: 250,
        renderCell: function render({ value }) {
          return <span>{t("teams.statuses." + value)}</span>;
        },
        flex: 1,
      },
      {
        field: "created_at",
        headerName: t("teams.fields.created_at"),
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
        flex: 1,
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
    [renderActions, t]
  );

  return (
    <List>
      <Head>
        <title>{t("documentTitle.teams.list")}</title>
      </Head>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
      {ConfirmationModal}
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
