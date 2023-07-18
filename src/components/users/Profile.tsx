import { Profile } from "src/types";
import { Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import ImageAvatar from "@components/common/ImageAvatar";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { StyledLink } from "..";
import EditIcon from "@mui/icons-material/Edit";
type Props = {
  profile: Profile;
  isMe?: boolean;
};

export default function ShowProfile({ profile, isMe = false }: Props) {
  return (
    <Grid container spacing={5} justifyContent={"center"}>
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            position: "relative",
          }}
        >
          {isMe && (
            <StyledLink
              href="/profile/settings"
              itemType="iconButton"
              sx={{
                position: "absolute",
                top: "0.5em",
                right: "0.5em",
              }}
              iconButtonProps={{
                color: "primary",
              }}
            >
              <EditIcon />
            </StyledLink>
          )}

          <ImageAvatar
            user={profile}
            sx={{
              bgcolor: generateRandomColorWithName(profile.full_name || ""),
              width: "7em",
              height: "7em",
            }}
            alt={profile.full_name || ""}
          >
            <Typography variant="h3" color="white">
              {getFirstLettersOfWord(profile.full_name || "")}
            </Typography>
          </ImageAvatar>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {profile?.full_name}
          </Typography>

          <Stack
            spacing={2}
            pt={3}
            flex={1}
            sx={{
              width: "100%",
            }}
          >
            <Stack
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
              flex={1}
            >
              <AccountBoxIcon />
              <Typography
                sx={{
                  mx: 1,
                }}
                variant="body2"
              >
                {profile?.full_name}
              </Typography>
            </Stack>
            <Divider />
            <Stack
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
            >
              <AlternateEmailIcon />
              <Typography
                variant="body2"
                sx={{
                  mx: 1,
                }}
              >
                {profile?.email}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
