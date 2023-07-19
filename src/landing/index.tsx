import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useContext } from "react";
import Header from "./header";
import Content from "./Content";
import { ColorModeContext } from "@contexts/index";
import Features from "./Features";
import BuiltWith from "./BuiltWith";

type Props = {};

export default function Landing({}: Props) {
  const { mode } = useContext(ColorModeContext);
  return (
    <Grid
      container
      xs={12}
      style={{
        justifyContent: "center",
      }}
    >
      <Header />
      <Content isDarkMode={mode === "dark"} />
      <Divider
        sx={{
          width: "100%",
          my: 4,
        }}
      />
      <Features isDarkMode={mode === "dark"} />
      <Divider
        sx={{
          width: "100%",
        }}
      />
      <BuiltWith isDarkMode={mode === "dark"} />
    </Grid>
  );
}
