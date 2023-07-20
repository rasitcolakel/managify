import ImageAvatar from "@components/common/ImageAvatar";
import Link from "@components/common/Link";
import { ChatsContext } from "@contexts/ChatsContext";
import { ColorModeContext } from "@contexts/index";
import { Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Chat, Profile } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";

type Props = {};

function ChatHeader({}: Props) {
  const { currentChat } = useContext(ChatsContext);
  const { profile } = useContext(ColorModeContext);

  const getParticipant = (chat: Chat): Profile | null => {
    if (!profile) return null;
    const p = chat.participants.find((p) => p.user_id !== profile.id)?.profile;
    if (!p) return null;
    return p;
  };

  const participant = currentChat ? getParticipant(currentChat) : null;

  if (!participant) return null;

  return (
    <Stack flex={1} alignItems="center" direction="row" spacing={0}>
      <Link
        href={`/profiles/${participant.id}`}
        linkProps={{
          sx: {
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <ImageAvatar
          user={participant}
          sx={{
            bgcolor: generateRandomColorWithName(participant.full_name || ""),
            m: 1,
          }}
          link={false}
        >
          <Typography variant="body2" color="white">
            {getFirstLettersOfWord(participant.full_name || "")}
          </Typography>
        </ImageAvatar>
        <Typography variant="subtitle1" color="text.primary">
          {participant?.full_name}
        </Typography>
      </Link>
    </Stack>
  );
}

export default ChatHeader;
