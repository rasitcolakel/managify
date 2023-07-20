import React, { useContext } from "react";
import { Drawer, Grid } from "@mui/material";
import ListChats from "@components/chats/ListChats";
import { ChatsContext } from "@contexts/ChatsContext";
import RenderChat from "./RenderChat";
import { ColorModeContext } from "@contexts/index";

type Props = {};

export default function Index({}: Props) {
  const { isDrawerOpen, setIsDrawerOpen, isMobile } = useContext(ChatsContext);
  const { headerHeight, profile } = useContext(ColorModeContext);

  if (!profile) return null;
  return (
    <Grid
      container
      sx={{
        height: `calc(100vh - ${headerHeight}px)`,
        position: "relative",
        p: 0,
        m: 0,
      }}
    >
      {isMobile && (
        <Drawer
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          elevation={5}
          PaperProps={{
            style: {
              width: "75%",
              height: "100%",
            },
          }}
        >
          <Grid
            item
            xs={12}
            lg={3}
            sx={{
              height: "100%",
            }}
          >
            <ListChats />
          </Grid>
        </Drawer>
      )}

      {!isMobile && (
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            height: "100%",
          }}
        >
          <ListChats />
        </Grid>
      )}
      <RenderChat />
    </Grid>
  );
}
