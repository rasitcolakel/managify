import { ChatsContext } from "@contexts/ChatsContext";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import Menu from "@mui/icons-material/Menu";
import ForumIcon from "@mui/icons-material/Forum";
import RenderMessages from "./RenderMessages";
import NewMessage from "./NewMessage";
import ChatHeader from "./ChatHeader";
type Props = {};

export default function RenderChat({}: Props) {
  const { isMobile, theme, setIsDrawerOpen, currentChat } =
    useContext(ChatsContext);

  return (
    <Grid
      item
      xs={12}
      lg={9}
      border={1}
      sx={{
        borderColor: theme && theme.palette.divider,
        height: "100%",
      }}
    >
      <Grid
        xs={12}
        sx={{
          height: "100%",
        }}
      >
        <Stack spacing={isMobile ? 0 : 2} flex={1} height={"100%"}>
          {isMobile && (
            <Stack
              display={"flex"}
              alignItems="center"
              justifyContent="center"
              sx={{
                borderBottom: 1,
                borderColor: theme && theme.palette.divider,
              }}
            >
              <IconButton
                onClick={() => setIsDrawerOpen(true)}
                sx={{
                  m: 1,
                  alignSelf: "flex-start",
                }}
              >
                <Menu />
              </IconButton>
            </Stack>
          )}
          {currentChat ? (
            <>
              <Stack
                sx={{
                  p: isMobile ? 0.5 : 1,
                  borderBottom: 1,
                  borderColor: theme && theme.palette.divider,
                }}
                spacing={0}
              >
                <ChatHeader key={"header-" + currentChat.id} />
              </Stack>
              <RenderMessages key={currentChat.id} />
              <Stack
                sx={{
                  p: isMobile ? 0.5 : 1,
                  borderTop: 1,
                  borderColor: theme && theme.palette.divider,
                }}
                spacing={0}
              >
                <NewMessage />
              </Stack>
            </>
          ) : (
            <Stack
              display={"flex"}
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <ForumIcon
                sx={{
                  fontSize: 100,
                }}
              />
              <Typography variant="h6" align="center" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
