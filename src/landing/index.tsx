import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useContext } from "react";
import Header from "./header";
import Content from "./Content";
import { ColorModeContext } from "@contexts/index";

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
      <Divider
        sx={{
          width: "100%",
        }}
      />
      <Content isDarkMode={mode === "dark"} />
    </Grid>
  );
}
