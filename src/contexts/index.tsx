import { ThemeProvider } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";
import React, { createContext, ReactNode, useEffect, useState } from "react";

type ColorModeContextType = {
  mode: string;
  setMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);
type ColorModeContextProviderProps = {
  children: ReactNode;
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

  return (
    <ColorModeContext.Provider
      value={{
        setMode: toggleTheme,
        mode,
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
