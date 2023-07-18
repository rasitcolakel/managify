import React, { useEffect } from "react";
import { CrudFilter, useInfiniteList, useTranslate } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { Profile, Team, TeamMember } from "src/types";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { makeTeamActive, makeTeamDeleted } from "src/services/teams";
import useConfirmationModal from "@components/common/useConfirmationModal";
import CardList from "@components/teams/list/CardList";
import { useInView } from "react-intersection-observer";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRouter } from "next/router";
import Link from "@components/common/Link";
import AddIcon from "@mui/icons-material/Add";
import { StyledMenu } from "@components/index";

export type TeamsAction = "edit" | "delete" | "restore" | "show";

export default function TeamsPage() {
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
        <title>{t("documentTitle.teams.list")}</title>
      </Head>
      {!loading && user && <TeamList user={user} />}
    </main>
  );
}

function TeamList({ user }: { user: Profile }) {
  const t = useTranslate();
  const router = useRouter();

  const [status, setStatus] = React.useState<"active" | "deleted">("active");

  const filters: CrudFilter[] = React.useMemo(() => {
    const filters: CrudFilter[] = [
      {
        field: "team.status",
        operator: "eq",
        value: status,
      },
    ];

    if (status === "deleted") {
      filters.push({
        field: "team.owner",
        operator: "eq",
        value: user && user.id,
      });
    }
    return filters;
  }, [status, user]);

  const { data, fetchNextPage, hasNextPage, refetch, isLoading } =
    useInfiniteList<
      TeamMember & {
        team: Team;
      }
    >({
      resource: "teamMembers",
      meta: {
        select:
          "*, team:teams(*, owner(*),  teamMembers(id, user_id, status, profile:profiles!user_id(*)), tasks(id, status))",
      },
      filters: [
        {
          field: "user_id",
          operator: "eq",
          value: user && user.id,
        },
        {
          field: "status",
          operator: "eq",
          value: "active",
        },
        ...filters,
      ],
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
        if (team.team) teams.push(team.team);
      });
    });
    return teams;
  }, [data]);

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const filterMenu = (
    <StyledMenu
      id="filter-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      minWidth={350}
    >
      <Stack direction="column" spacing={1} p={2}>
        <Typography variant="body1" component="h2">
          {t("buttons.filter")}
        </Typography>
        <Divider
          sx={{
            mb: 1,
          }}
        />
        <Stack direction="column" spacing={1} p={1} py={2}>
          <FormControl>
            <InputLabel id="demo-simple-select-standard-label">
              {t("teams.fields.status")}
            </InputLabel>
            <Select
              value={status}
              size="small"
              label={t("teams.fields.status")}
              onChange={(e) => filter(e.target.value as "active" | "deleted")}
            >
              <MenuItem value="active">{t("teams.statuses.active")}</MenuItem>
              <MenuItem value="deleted">{t("teams.statuses.deleted")}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </StyledMenu>
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
          <IconButton color="primary" onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
          {filterMenu}
          <Link
            href="/teams/create"
            itemType="button"
            buttonProps={{
              variant: "contained",
              color: "primary",
              startIcon: <AddIcon />,
            }}
          >
            {t("buttons.create")}
          </Link>
        </Stack>
      </Stack>

      <CardList cardList={teams} onAction={onAction} user={user} />

      {!isLoading && teams.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1" component="p">
            {t("table.noData")}
          </Typography>
        </Paper>
      )}
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
