import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { RefineThemes } from "@refinedev/mui";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getMyProfile } from "src/services/users";
import { Profile } from "src/types";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material/styles";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
  profile: Profile | null;
  refreshProfile: () => void;
  open: boolean;
  setOpen: (_open: boolean) => void;
  headerHeight?: number;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);
type ColorModeContextProviderProps = {
  children: ReactNode;
  headerHeight?: number;
};

const customDarkTheme = {
  ...RefineThemes.BlueDark,
  palette: {
    ...RefineThemes.BlueDark.palette,
    background: {
      ...RefineThemes.BlueDark.palette.background,
      default: "#111827",
      paper: "#1f2937",
    },
  },
};

const customLightTheme = {
  ...RefineThemes.Blue,
  palette: {
    ...RefineThemes.Blue.palette,
    background: {
      ...RefineThemes.Blue.palette.background,
      default: "#f3f4f6",
      paper: "#fff",
    },
  },
};

export const ColorModeContextProvider: React.FC<
  ColorModeContextProviderProps
> = ({ children, headerHeight }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState("light");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const systemTheme = localStorage.getItem("theme") === "dark";

      setMode(systemTheme ? "dark" : "light");
      localStorage.setItem("theme", systemTheme ? "dark" : "light");
    }
  }, [isMounted]);

  const toggleTheme = () => {
    const nextTheme = mode === "light" ? "dark" : "light";

    setMode(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const {
    execute,
    data: profile,
    loading,
  } = useAsyncFunction<any, Profile>(getMyProfile);

  useEffect(() => {
    execute();
  }, [execute]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    if (profile && router.pathname) {
      if (
        profile.status === "created" &&
        router.pathname !== "/profile/settings" &&
        !loading
      ) {
        setOpen(true);
      }
    }
  }, [profile, router.pathname, loading, router]);

  return (
    <ColorModeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
        profile,
        refreshProfile: execute,
        setOpen,
        open,
        headerHeight,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={mode === "light" ? customLightTheme : customDarkTheme}
      >
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
