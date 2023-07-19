import Link from "@components/common/Link";
import { Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
type Props = {
  isDarkMode: boolean;
};

function Content({ isDarkMode }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Grid
      container
      xs={11}
      lg={8}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <Grid
        xs={12}
        lg={5}
        style={{
          textAlign: "center",
        }}
        py={isMobile ? 2 : 4}
      >
        <Stack direction="column">
          <span
            style={{
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: "500",
            }}
          >
            Manage Your Teams With
            <span
              style={{
                color: theme.palette.primary.main,
              }}
            >
              {" "}
              Managify
            </span>
          </span>
          <Link
            href="/register"
            itemType="button"
            buttonProps={{
              variant: "contained",
              sx: {
                textTransform: "none",
                borderRadius: isMobile ? "0.5rem" : "1rem",
                p: 1,
                px: 3,
                my: 3,
              },
              endIcon: <ArrowForwardIcon />,
            }}
          >
            {`Get Started, It's Free`}
          </Link>
        </Stack>
      </Grid>
      <Grid
        xs={12}
        lg={10}
        style={{
          textAlign: "center",
        }}
      >
        <Image
          src={
            "/landing/" + (isDarkMode ? "teams-dark.png" : "teams-light.png")
          }
          alt="landing"
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: isMobile ? "0.5rem" : "1rem",
            border: "1px solid #eaeaea",
            borderColor: theme.palette.divider,
          }}
          quality={100}
        />
      </Grid>
    </Grid>
  );
}

export default Content;
