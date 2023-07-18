import { useAsyncFunction } from "@components/hooks/useAsyncFunction";
import { RefineThemes } from "@refinedev/mui";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { getMyProfile } from "src/services/users";
import { Profile } from "src/types";
import { createTheme, ThemeProvider } from "@mui/system";
import { ThemeOptions } from "@mui/material";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
  profile: Profile | null;
  refreshProfile: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);
type ColorModeContextProviderProps = {
  children: ReactNode;
};

const customDarkTheme: ThemeOptions = {
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

const customLightTheme: ThemeOptions = {
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
> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [mode, setMode] = useState("light");

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

  const { execute, data: profile } = useAsyncFunction<any, Profile>(
    getMyProfile
  );

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <ColorModeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
        profile,
        refreshProfile: execute,
      }}
    >
      <ThemeProvider
        // you can change the theme colors here. example: mode === "light" ? RefineThemes.Magenta : RefineThemes.MagentaDark
        theme={createTheme(
          mode === "light" ? customLightTheme : customDarkTheme
        )}
      >
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
