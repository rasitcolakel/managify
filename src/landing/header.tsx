import Link from "@components/common/Link";
import { ColorModeContext } from "@contexts/index";
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Logo from "public/logo.svg";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import React, { useContext } from "react";
type Props = {};

export default function Header({}: Props) {
  const theme = useTheme();
  const { mode, setMode } = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        width: "100%",
        justifyContent: "center",
        display: "flex",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Grid
        item
        xs={12}
        xl={8}
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        display="flex"
        py={1}
        mx={isMobile ? 3 : 0}
      >
        <Stack
          direction="row"
          spacing={1}
          flexDirection="row"
          alignItems="center"
          display="flex"
        >
          <Logo
            width={"2.5em"}
            height={"2.5em"}
            fill={theme.palette.primary.main}
          />
          <Typography variant="h5" color="primary">
            Managify
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={() => {
              setMode();
            }}
            size="small"
          >
            {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
          <Link
            href="/login"
            itemType="button"
            buttonProps={{
              sx: {
                textTransform: "none",
                px: 3,
              },
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            itemType="button"
            buttonProps={{
              sx: {
                textTransform: "none",
              },
              variant: "contained",
            }}
          >
            Sign Up
          </Link>
        </Stack>
      </Grid>
    </Box>
  );
}
