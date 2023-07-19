import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import Refine from "public/logos/refine-light.png";
import RefineDark from "public/logos/refine-dark.png";
import Supabase from "public/logos/supabase-light.png";
import SupabaseDark from "public/logos/supabase-dark.png";
import Mui from "public/logos/mui.png";
import Image from "next/image";
import Link from "next/link";
import { StyledLink } from "@components/index";

type Props = {
  isDarkMode: boolean;
};

function BuiltWith({ isDarkMode }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
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
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          display="flex"
          py={1}
          mx={isMobile ? 3 : 0}
        >
          <Typography variant="h4" align="center" py={2} pb={isMobile ? 2 : 5}>
            Build by Using
          </Typography>

          <Stack
            spacing={1}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            display="flex"
            width={isMobile ? "90%" : "40%"}
          >
            <Link href="https://refine.dev/" target="blank">
              <Image
                src={isDarkMode ? RefineDark : Refine}
                alt="refine"
                height={isMobile ? "25" : "30"}
              />
            </Link>
            <Link href="https://supabase.io/" target="blank">
              <Image
                src={isDarkMode ? SupabaseDark : Supabase}
                alt="supabase"
                height={isMobile ? "30" : "40"}
              />
            </Link>
            <Link href="https://mui.com/" target="blank">
              <Image src={Mui} alt="mui" height={isMobile ? "30" : "40"} />
            </Link>
          </Stack>
        </Grid>
      </Box>
      <Divider sx={{ width: "100%" }} />
      <Box
        sx={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography variant="body1" align="center" py={2} pb={2}>
          This project built for Refine and Supabase Hackathon by{" "}
          <StyledLink href="https://rasit.me" target="blank">
            Rasit Colakel
          </StyledLink>
        </Typography>
      </Box>
    </>
  );
}

export default BuiltWith;
