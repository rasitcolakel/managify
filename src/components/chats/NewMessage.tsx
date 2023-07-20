import { IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Send } from "@mui/icons-material";
import { ColorModeContext } from "@contexts/index";
import ImageAvatar from "@components/common/ImageAvatar";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import { useForm } from "react-hook-form";
import { ChatsContext } from "@contexts/ChatsContext";
import { useTranslate } from "@refinedev/core";
type Props = {};

export default function NewMessage({}: Props) {
  const { profile } = useContext(ColorModeContext);
  const { isMobile, addMessage } = useContext(ChatsContext);
  const t = useTranslate();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<{
    message: string;
  }>({});

  const onSubmit = handleSubmit(async (data) => {
    const isAdded = await addMessage(data.message);
    if (isAdded) {
      setValue("message", "");
    }
  });

  if (!profile) return null;
  return (
    <Stack
      flex={1}
      height={"100%"}
      flexDirection="row"
      alignItems="center"
      spacing="0"
    >
      <ImageAvatar
        user={profile}
        link={false}
        sx={{
          bgcolor: generateRandomColorWithName(profile.full_name || ""),
          m: 1,
          width: isMobile ? 30 : 40,
          height: isMobile ? 30 : 40,
        }}
      >
        <Typography variant="body2" color="white">
          {getFirstLettersOfWord(profile.full_name || "")}
        </Typography>
      </ImageAvatar>
      <TextField
        {...register("message", {
          required: true,
        })}
        size="small"
        id="outlined-basic"
        placeholder={t("chats.typeMessage")}
        variant="outlined"
        fullWidth
        sx={{
          px: isMobile ? 0.5 : 3,
        }}
        error={!!errors.message}
      />
      <IconButton
        sx={{
          backgroundColor: "primary.main",
          p: isMobile ? 0.8 : 1.3,
          color: "white",
        }}
        onClick={onSubmit}
      >
        <Send fontSize="small" />
      </IconButton>
    </Stack>
  );
}
