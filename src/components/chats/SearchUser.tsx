import ImageAvatar from "@components/common/ImageAvatar";
import { ChatsContext } from "@contexts/ChatsContext";
import { Stack, Typography } from "@mui/material";
import { useList, useTranslate } from "@refinedev/core";
import React, { useContext } from "react";
import { Profile } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";

type Props = {
  search: string;
  resetSearch: () => void;
};

export default function SearchUser({ search, resetSearch }: Props) {
  const t = useTranslate();
  const { chats, setCurrentChat, handleNewChat } = useContext(ChatsContext);
  const { data } = useList<Profile>({
    resource: "profiles",
    meta: {
      select: "*",
    },
    filters: [
      {
        field: "full_name",
        operator: "contains",
        value: search,
      },
    ],
  });

  const onSelectUser = async (user: Profile) => {
    const chat = chats.find((chat) => {
      const p = chat.participants.find((p) => p.user_id === user.id);
      if (!p) return false;
      return true;
    });

    if (chat) {
      setCurrentChat(chat);
      resetSearch();
    } else {
      await handleNewChat(user.id);
    }
  };

  const renderUsers = () => {
    if (!data?.data) return null;
    return data.data.map((user) => {
      return (
        <Stack
          flex={1}
          alignItems="center"
          direction="row"
          spacing={0}
          key={"users-" + user.id}
          onClick={() => onSelectUser(user)}
          style={{
            cursor: "pointer",
          }}
        >
          <ImageAvatar
            user={user}
            sx={{
              bgcolor: generateRandomColorWithName(user.full_name || ""),
              m: 1,
            }}
            link={false}
          >
            <Typography variant="body2" color="white">
              {getFirstLettersOfWord(user.full_name || "")}
            </Typography>
          </ImageAvatar>
          <Typography variant="subtitle1" color="text.primary">
            {user?.full_name}
          </Typography>
        </Stack>
      );
    });
  };

  if (!data?.data)
    return <Typography variant="body1">{t("chats.noUsersFound")}</Typography>;

  return <Stack>{renderUsers()}</Stack>;
}
