import React, { useCallback, useEffect } from "react";
import { List, useDataGrid } from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Invitation, Profile } from "src/types";
import { Chip, IconButton, Stack, Tooltip } from "@mui/material";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import LoadingOverlay from "@components/common/LoadingOverlay";
import Head from "next/head";
import { acceptInvitation, declineInvitation } from "src/services/teams";
import BlockIcon from "@mui/icons-material/Block";
import DoneIcon from "@mui/icons-material/Done";
type InvitationsProps = IResourceComponentsProps & {
  user: Profile;
};

export default function InvitationPage() {
  const t = useTranslate();
  const {
    execute,
    data: user,
    loading,
  } = useAsyncFunction<any, Profile>(authProvider.getIdentity);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <main>
      <Head>
        <title>{t("documentTitle.invitations")}</title>
      </Head>
      <LoadingOverlay loading={loading || !user}>
        {!loading && user && <Invitations user={user} />}
      </LoadingOverlay>
    </main>
  );
}

function Invitations({ user }: InvitationsProps) {
  const t = useTranslate();
  const { dataGridProps, tableQueryResult } = useDataGrid<Invitation>({
    resource: "teamMembers",
    meta: {
      select: "*, team:teams(*)",
    },
    filters: {
      permanent: [
        {
          field: "user_id",
          operator: "eq",
          value: user.id,
        },
        {
          field: "status",
          operator: "ne",
          value: "active",
        },
      ],
    },
    pagination: {
      pageSize: 10,
    },
  });

  const renderStatus = useCallback(
    (status: string) => {
      const color = status === "invited" ? "warning" : "error";
      return (
        <Chip
          label={t(`teams.invitation.${status}`)}
          color={color}
          size="small"
        />
      );
    },
    [t]
  );

  const { execute: acceptExecute, loading: acceptLoading } = useAsyncFunction<
    any,
    Invitation
  >(acceptInvitation);

  const { execute: declineExecute, loading: declineLoading } = useAsyncFunction<
    any,
    Invitation
  >(declineInvitation);

  const handleAccept = React.useCallback(
    async (data: Invitation) => {
      if (!data?.id) return;
      await acceptExecute(data?.id);
      await tableQueryResult.refetch();
    },
    [acceptExecute, tableQueryResult]
  );

  const handleDecline = React.useCallback(
    async (data: Invitation) => {
      if (!data?.id) return;
      await declineExecute(data?.id);
      await tableQueryResult.refetch();
    },
    [declineExecute, tableQueryResult]
  );

  const renderActions = React.useCallback(
    (row: Invitation) => {
      return (
        <Stack
          direction="row"
          flex={1}
          justifyContent="center"
          alignItems="center"
        >
          {row.status === "invited" && (
            <>
              <Tooltip title={t("buttons.decline")}>
                <IconButton
                  color="error"
                  onClick={() => {
                    handleDecline(row);
                  }}
                  disabled={acceptLoading || declineLoading}
                >
                  <BlockIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("buttons.accept")}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    handleAccept(row);
                  }}
                  disabled={acceptLoading || declineLoading}
                >
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      );
    },
    [acceptLoading, declineLoading, handleAccept, handleDecline, t]
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "title",
        flex: 1,
        headerName: t("tasks.fields.title"),
        minWidth: 200,
        renderCell: function render({ row }) {
          return row.team.title;
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
        field: "actions",
        headerName: t("table.actions"),
        minWidth: 100,
        renderCell: function render({ row }) {
          return renderActions(row);
        },
        sortable: false,
        filterable: false,
        editable: false,
        disableColumnMenu: true,
      },
    ],
    [renderActions, renderStatus, t]
  );

  return (
    <List breadcrumb={false} title={t("teams.invitations")} canCreate={false}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
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
