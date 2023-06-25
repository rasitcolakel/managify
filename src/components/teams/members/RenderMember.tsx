import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslate } from "@refinedev/core";
import React, { memo } from "react";
import { TeamWithMembers } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";

type Props = {
  teamMember: TeamWithMembers["teamMembers"][0];
  isOwner: boolean;
};

function RenderMember({ teamMember, isOwner }: Props) {
  const fullName = `${teamMember.profile?.first_name} ${teamMember.profile?.last_name}`;
  const isInvited = teamMember.status === "invited";
  const t = useTranslate();
  const getAvatarAlt = React.useCallback(() => {
    return getFirstLettersOfWord(fullName);
  }, [fullName]);

  return (
    <Card
      sx={{
        margin: 1,
      }}
    >
      <Stack
        padding={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          sx={{
            bgcolor: generateRandomColorWithName(fullName),
            height: "3em",
            width: "3em",
          }}
        >
          <Typography variant="h6" color="white">
            {getAvatarAlt()}
          </Typography>
        </Avatar>
        <Stack padding={1} flex="1">
          <Typography variant="h6">
            {teamMember.profile?.first_name} {teamMember.profile?.last_name}
          </Typography>
          <Typography variant="body2">
            {t("teamMembers.types." + (isOwner ? "owner" : "member"))}
          </Typography>
        </Stack>
        {isInvited && (
          <Chip
            label={t("teamMembers.statuses.invited")}
            color="warning"
            variant="outlined"
          />
        )}
      </Stack>
    </Card>
  );
}

export default memo(RenderMember);
