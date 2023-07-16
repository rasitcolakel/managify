import React, { useEffect } from "react";
import { CrudFilter, useInfiniteList, useTranslate } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Profile, Team } from "src/types";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { makeTeamActive, makeTeamDeleted } from "src/services/teams";
import useConfirmationModal from "@components/common/useConfirmationModal";
import CardList from "@components/teams/list/CardList";
import { useInView } from "react-intersection-observer";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/router";
import Link from "@components/common/Link";
import AddIcon from "@mui/icons-material/Add";

export type TeamsAction = "edit" | "delete" | "restore" | "show";

export default function TeamList() {
  const t = useTranslate();
  const router = useRouter();

  const [status, setStatus] = React.useState<"active" | "deleted">("active");

  const filters: CrudFilter[] = React.useMemo(() => {
    return [
      {
        field: "status",
        operator: "eq",
        value: status,
      },
    ];
  }, [status]);

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteList<Team>({
    resource: "teams",
    meta: {
      select:
        "*, owner(*),  teamMembers(id, user_id, status, profile:profiles!user_id(*)), tasks(id, status)",
    },
    filters,
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    pagination: {
      pageSize: 10,
    },
  });

  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const teams = React.useMemo(() => {
    const teams: Team[] = [];
    data?.pages.forEach((page) => {
      page.data.forEach((team) => {
        teams.push(team);
      });
    });
    return teams;
  }, [data]);

  const { execute, data: user } = useAsyncFunction<any, Profile>(
    authProvider.getIdentity
  );
  console.log("user", user);

  useEffect(() => {
    execute();
  }, [execute]);

  const { openModal, ConfirmationModal } = useConfirmationModal();

  const onDelete = React.useCallback(
    async (id: number) => {
      await makeTeamDeleted(id);
      refetch();
    },
    [refetch]
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
      refetch();
    },
    [refetch]
  );

  const openRestoreModal = React.useCallback(
    (id: number) => {
      openModal(() => onRestore(id), t("teams.restoreConfirmation"));
    },
    [onRestore, openModal, t]
  );

  const filter = React.useCallback(
    (status: "active" | "deleted") => {
      setStatus(status);
    },
    [setStatus]
  );

  const onAction = React.useCallback(
    (id: number, action: TeamsAction) => {
      switch (action) {
        case "delete":
          openDeleteModal(id);
          break;
        case "restore":
          openRestoreModal(id);
          break;
        case "show":
          router.push(`/teams/show/${id}`);
        case "edit":
          router.push(`/teams/edit/${id}`);
      }
    },
    [openDeleteModal, openRestoreModal, router]
  );

  return (
    <Stack sx={{ justifyContent: "center" }} pt={2}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent={"space-between"}
        alignItems={"center"}
        pb={3}
      >
        <Typography variant="h5" component="h1">
          {t("teams.title")}
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton
            color="primary"
            onClick={() => filter(status === "active" ? "deleted" : "active")}
          >
            <FilterListIcon />
          </IconButton>
          <Link href="/teams/create">
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              {t("buttons.create")}
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Head>
        <title>{t("documentTitle.teams.list")}</title>
      </Head>
      <CardList cardList={teams} onAction={onAction} user={user} />
      <Stack
        sx={{ justifyContent: "center" }}
        pt={2}
        ref={ref}
        style={{
          display: hasNextPage ? "flex" : "none",
        }}
      >
        <Button
          fullWidth={false}
          startIcon={<RefreshIcon />}
          onClick={() => fetchNextPage()}
        >
          Load More
        </Button>
      </Stack>
      {ConfirmationModal}
    </Stack>
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
