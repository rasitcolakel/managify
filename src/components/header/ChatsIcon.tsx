import { Badge } from "@mui/material";
import { useList } from "@refinedev/core";
import React from "react";
import { Profile } from "src/types";
import MailIcon from "@mui/icons-material/Mail";
import Link from "@components/common/Link";

type Props = {
  profile: Profile;
};

export default function ChatsIcon({ profile }: Props) {
  const { data } = useList({
    resource: "messages",
    meta: {
      select:
        "*, chats(*, participants:chatParticipants(*, profile:profiles!user_id(*)))",
    },
    pagination: {
      pageSize: 1000,
    },
    liveMode: "auto",
    filters: [
      {
        field: "is_seen",
        operator: "eq",
        value: false,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
    onLiveEvent: () => {
      refetch();
    },
  });

  const refetch = () => {
    // data?.refetch();
  };

  const unseenMessages: number =
    data?.data.filter((message) => message.sender_id !== profile?.id).length ||
    0;

  return (
    <Link href="/chats" itemType="iconButton">
      <Badge badgeContent={unseenMessages} color="primary">
        <MailIcon color="action" />
      </Badge>
    </Link>
  );
}
