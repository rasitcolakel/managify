import ImageAvatar from "@components/common/ImageAvatar";
import { ChatsContext } from "@contexts/ChatsContext";
import { ColorModeContext } from "@contexts/index";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useInfiniteList } from "@refinedev/core";
import { useInView } from "framer-motion";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { Message } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
  readableDate,
} from "src/utility";

type Props = {};

export default function RenderMessages({}: Props) {
  const { currentChat } = useContext(ChatsContext);
  const { profile, mode } = useContext(ColorModeContext);
  const ref = useRef(null);
  const isInView = useInView(ref);

  const { data, fetchNextPage, hasNextPage } = useInfiniteList<Message>({
    resource: "messages",
    meta: {
      select: "*, sender:profiles(*)",
    },
    liveMode: "auto",
    pagination: {
      pageSize: 10,
    },
    filters: [
      {
        field: "chat_id",
        operator: "eq",
        value: currentChat?.id,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  const messages: Message[] = useMemo(() => {
    return data?.pages.map((page) => page.data).flat() || [];
  }, [data?.pages]);

  useEffect(() => {
    if (isInView) {
      fetchNextPage();
    }
  }, [isInView, fetchNextPage]);

  const renderMessages = useMemo(() => {
    return messages.map((message) => (
      <Stack
        direction="row"
        justifyContent="flex-end"
        key={message.id}
        alignItems="center"
        alignSelf={
          message.sender_id === profile?.id ? "flex-end" : "flex-start"
        }
        flexDirection={
          message.sender_id === profile?.id ? "row-reverse" : "row"
        }
        pb={1}
      >
        <ImageAvatar
          user={message.sender}
          sx={{
            bgcolor: generateRandomColorWithName(
              message.sender.full_name || ""
            ),
            m: 1,
            width: "1.3em",
            height: "1.3em",
          }}
        >
          <Typography variant="body2" color="white">
            {getFirstLettersOfWord(message.sender.full_name || "")}
          </Typography>
        </ImageAvatar>
        <Stack direction="column">
          <Box
            bgcolor={
              message.sender_id === profile?.id
                ? "primary.main"
                : "background.paper"
            }
            sx={{
              minWidth: "100px",
              borderRadius: 3,
              p: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                p: 0,
                m: 0,
              }}
              color={
                message.sender_id === profile?.id ? "white" : "text.primary"
              }
            >
              {message.message}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{
              p: 0,
              m: 0.5,
            }}
            color={mode === "dark" ? "text.secondary" : "text.disabled"}
            textAlign={message.sender_id === profile?.id ? "right" : "left"}
          >
            {readableDate(message.created_at || "")}
          </Typography>
        </Stack>
      </Stack>
    ));
  }, [messages, mode, profile?.id]);

  return (
    <Box
      display="flex"
      flexDirection="column-reverse"
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
      {renderMessages}
      <Stack
        justifyContent="center"
        alignItems="center"
        ref={ref}
        sx={{
          width: "100%",
          minHeight: 200,
          display: hasNextPage ? "flex" : "none",
        }}
      >
        <CircularProgress />
      </Stack>
    </Box>
  );
}
