import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  notificationProvider,
  RefineSnackbarProvider,
  ThemedTitleV2,
} from "@refinedev/mui";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { AppIcon } from "src/components/app-icon";
import { supabaseClient } from "src/utility";
import "@components/css/index.css";
import CompleteProfileNotification from "@components/users/CompleteProfileNotification";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ThemedLayoutV2 } from "@components/themedLayout";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
  noPadding?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => (
          <div ref={ref}>
            <Header sticky />
          </div>
        )}
        Title={({ collapsed }) => (
          <ThemedTitleV2
            collapsed={collapsed}
            text="Managify"
            icon={<AppIcon />}
          />
        )}
        headerHeight={height}
        noPadding={Component.noPadding}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  React.useEffect(() => {
    // Function to get the height of the header
    const getHeight = () => {
      if (ref.current) {
        setHeight(ref.current.clientHeight);
      }
    };

    // Call the function to get the height after the component has rendered
    getHeight();
  }, []);

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider headerHeight={height}>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              liveProvider={liveProvider(supabaseClient)}
              routerProvider={routerProvider}
              dataProvider={dataProvider(supabaseClient)}
              authProvider={authProvider}
              notificationProvider={notificationProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "teams",
                  list: "/teams",
                  create: "/teams/create",
                  edit: "/teams/edit/:id",
                  show: "/teams/show/:id",
                  meta: {
                    canDelete: true,
                    label: t("teams.title"),
                    icon: <GroupWorkIcon />,
                  },
                },
                {
                  name: "tasks",
                  list: "/teams/:teamId/tasks",
                  show: "/teams/:teamId/tasks/:id",
                  edit: "/teams/:teamId/tasks/:id/edit",
                  create: "/teams/:teamId/tasks/create",
                  meta: {
                    hide: true,
                  },
                },
                {
                  name: "my-tasks",
                  list: "/my-tasks",
                  meta: {
                    icon: <AssignmentIcon />,
                    label: t("documentTitle.tasks.myTitle"),
                  },
                },
                {
                  name: "chats",
                  list: "/chats",
                  meta: {
                    icon: <MailIcon />,
                    label: t("chats.title"),
                  },
                },
                {
                  name: "invitations",
                  list: "/invitations",
                  meta: {
                    canDelete: true,
                    label: t("teams.invitations"),
                    icon: <GroupAddIcon />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: false,
                liveMode: "auto",
              }}
            >
              <CompleteProfileNotification />
              {renderComponent()}
              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
