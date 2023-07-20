import ImageAvatar from "@components/common/ImageAvatar";
import { ChatsContext } from "@contexts/ChatsContext";
import { ColorModeContext } from "@contexts/index";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslate } from "@refinedev/core";
import React, { useContext } from "react";
import { Chat, Profile } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import SearchUser from "./SearchUser";

function ListChats() {
  const t = useTranslate();
  const { chats } = useContext(ChatsContext);
  const { profile, mode } = useContext(ColorModeContext);

  const [search, setSearch] = React.useState("");

  const getParticipant = (chat: Chat): Profile | null => {
    if (!profile) return null;
    const p = chat.participants.find((p) => p.user_id !== profile.id)?.profile;
    if (!p) return null;
    return p;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearch(inputValue);
  };

  return (
    <Stack spacing={2} flex={1} height={"100%"}>
      <Stack
        justifyContent={"space-between"}
        display="flex"
        flexDirection="row"
        alignItems={"center"}
        p={2}
      >
        <Typography variant="h5" align="center">
          {t("chats.title")}
        </Typography>
      </Stack>

      <TextField
        placeholder={t("chats.search")}
        value={search}
        onChange={handleSearchChange}
        variant="outlined"
        sx={{
          mx: 2,
          mb: 2,
        }}
      />

      <Box
        display="flex"
        flexDirection="column"
        overflow="auto"
        style={{
          flex: 1,
        }}
        sx={{
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow:
              mode === "dark" ? "none" : "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "primary.main",
            borderRadius: 10,
            visibility: "visible",
          },
        }}
      >
        {search.length > 0 && (
          <SearchUser search={search} resetSearch={() => setSearch("")} />
        )}
        {!search.length &&
          chats.map((chat) => (
            <RenderParticipant
              key={chat.id}
              chat={chat}
              participant={getParticipant(chat)}
            />
          ))}

        {chats.length === 0 && (
          <Typography variant="body1">{t("chats.noMessages")}</Typography>
        )}
      </Box>
    </Stack>
  );
}

type RenderChatProps = {
  chat: Chat;
  participant: Profile | null;
};

const RenderParticipant = ({ chat, participant }: RenderChatProps) => {
  const { currentChat, setCurrentChat, theme, isMobile, setIsDrawerOpen } =
    useContext(ChatsContext);
  const isCurrentChat = currentChat?.id === chat.id;
  return (
    <Box
      sx={{
        backgroundColor: isCurrentChat
          ? theme?.palette.background.paper
          : "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        mb: "0.2em",
        borderRadius: "0.5em",
        cursor: "pointer",
      }}
      onClick={() => {
        setCurrentChat(chat);
        if (isMobile) setIsDrawerOpen(false);
      }}
      mx={1}
      p={1}
    >
      {participant && (
        <ImageAvatar
          user={participant}
          link={false}
          sx={{
            bgcolor: generateRandomColorWithName(participant.full_name || ""),
            m: 1,
          }}
        >
          <Typography variant="body2" color="white">
            {getFirstLettersOfWord(participant.full_name || "")}
          </Typography>
        </ImageAvatar>
      )}
      <Stack>
        <Typography variant="subtitle1">{participant?.full_name}</Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {participant?.full_name}
        </Typography>
      </Stack>
    </Box>
  );
};

export default ListChats;
