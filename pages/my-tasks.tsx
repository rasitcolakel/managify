import React, { useContext } from "react";
import { List } from "@refinedev/mui";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import styled from "@emotion/styled";
import { TableTasks } from "@components/teams/my-tasks/list";
import { KanbanTasks } from "@components/teams/my-tasks/kanban";
import { ColorModeContext } from "@contexts/index";
import Head from "next/head";
import { useTranslate } from "@refinedev/core";

type StyledListProps = {
  isKanban?: boolean;
};

const StyledList = styled.div<StyledListProps>`
  & .MuiPaper-root {
    height: ${(props) => props.isKanban && "100%"};
    background: ${(props) => props.isKanban && "transparent"};
    box-shadow: ${(props) => props.isKanban && "none"};
    height: ${(props) => props.isKanban && "100%"};
  }
  & .MuiCardContent-root {
    height: 100%;
  }
`;

export default function TeamList() {
  const t = useTranslate();
  const [view, setView] = React.useState<"list" | "kanban">("kanban"); // "list", "kanban"

  const { profile } = useContext(ColorModeContext);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: any
  ) => {
    if (nextView === null) return;
    setView(nextView);
  };

  if (!profile) {
    return null;
  }

  return (
    <StyledList
      isKanban={view === "kanban"}
      style={view === "kanban" ? { height: "100%" } : {}}
    >
      <Head>
        <title>{t("documentTitle.tasks.my")}</title>
      </Head>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
            <ToggleButtonGroup value={view} exclusive onChange={handleChange}>
              <ToggleButton value="list" aria-label="list">
                <ViewListIcon />
              </ToggleButton>
              <ToggleButton value="kanban" aria-label="module">
                <ViewKanbanIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </>
        )}
      >
        {view === "list" ? (
          <TableTasks profile={profile} />
        ) : (
          <KanbanTasks profile={profile} />
        )}
      </List>
    </StyledList>
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
