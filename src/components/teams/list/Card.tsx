import * as React from "react";
import MUICard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  AvatarGroup,
  Box,
  CardHeader,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { TCardItem } from "./CardList";
import Line from "./Line";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditIcon from "@mui/icons-material/Edit";
import TrashIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import EyeIcon from "@mui/icons-material/Visibility";
import { TeamsAction } from "pages/teams";
import { Profile } from "src/types";
import { useTranslate } from "@refinedev/core";
import { StyledLink, StyledMenu, StyledMenuItem } from "@components/index";
import ImageAvatar from "@components/common/ImageAvatar";

type Props = {
  cardItem?: TCardItem;
  // eslint-disable-next-line no-unused-vars
  onAction: (id: TCardItem["id"], type: TeamsAction) => void;
  user: Profile | null;
};

export default function Card({ cardItem, onAction, user }: Props) {
  const t = useTranslate();
  const doneTasks =
    cardItem?.tasks?.filter((task) => task.status === "done").length || 0;
  const totalTasks = cardItem?.tasks?.length || 0;
  const percent = totalTasks ? (doneTasks / totalTasks) * 100 : 0;
  const [menuEl, setMenuEl] = React.useState<null | HTMLElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuEl(event.currentTarget);
  };
  const closeMenu = async () => {
    setMenuEl(null);
  };

  return (
    <MUICard
      sx={{
        width: "100%",
        height: 220,
        padding: "8px",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <Grid
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            spacing={1}
            width="100%"
          >
            <StyledLink href={`/teams/show/${cardItem?.id}`} itemType="text">
              <Typography gutterBottom variant="h5" color="text.primary">
                {cardItem?.title}
              </Typography>
            </StyledLink>
            <IconButton aria-label="settings" onClick={openMenu}>
              <MoreHorizIcon />
            </IconButton>
            <StyledMenu
              id="update-status-menu"
              anchorEl={menuEl}
              open={Boolean(menuEl)}
              onClose={closeMenu}
              MenuListProps={{
                "aria-labelledby": "update-status-button",
              }}
            >
              {cardItem?.status === "active" && (
                <StyledLink href={`/teams/show/${cardItem?.id}`}>
                  <StyledMenuItem>
                    <EyeIcon fontSize="small" color="primary" />
                    <Typography
                      variant="inherit"
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        color: "primary.main",
                      }}
                    >
                      {t("buttons.show")}
                    </Typography>
                  </StyledMenuItem>
                </StyledLink>
              )}
              {cardItem?.owner.id === user?.id && (
                <>
                  {cardItem?.status === "active" ? (
                    <>
                      <StyledLink href={`/teams/edit/${cardItem?.id}`}>
                        <StyledMenuItem>
                          <EditIcon fontSize="small" color="success" />
                          <Typography
                            variant="inherit"
                            sx={{
                              flex: 1,
                              textAlign: "center",
                              color: "success.main",
                            }}
                          >
                            {t("buttons.edit")}
                          </Typography>
                        </StyledMenuItem>
                      </StyledLink>

                      <StyledMenuItem
                        onClick={() => {
                          if (cardItem?.id) {
                            closeMenu();
                            onAction(cardItem?.id, "delete");
                          }
                        }}
                      >
                        <TrashIcon fontSize="small" color="error" />
                        <Typography
                          variant="inherit"
                          sx={{
                            flex: 1,
                            textAlign: "center",
                            color: "error.main",
                          }}
                        >
                          {t("buttons.delete")}
                        </Typography>
                      </StyledMenuItem>
                    </>
                  ) : (
                    <StyledMenuItem
                      onClick={() => {
                        if (cardItem?.id) {
                          closeMenu();
                          onAction(cardItem?.id, "restore");
                        }
                      }}
                    >
                      <RestoreFromTrashIcon fontSize="small" color="warning" />
                      <Typography
                        variant="inherit"
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          color: "warning.main",
                        }}
                      >
                        {t("buttons.restore")}
                      </Typography>
                    </StyledMenuItem>
                  )}
                </>
              )}
            </StyledMenu>
          </Grid>
        }
        sx={{
          padding: "0.4em 1em",
        }}
      />
      <CardContent
        sx={{
          padding: "0 1em",
        }}
      >
        <Stack pb={3}>
          <Typography
            color="text.secondary"
            marginBottom="0px"
            variant="body1"
            whiteSpace="pre-wrap"
          >
            {cardItem?.description}
          </Typography>
        </Stack>

        <Grid
          alignItems="center"
          display="flex"
          flexDirection="row"
          gap={2}
          justifyContent="space-between"
          width="100%"
        >
          <Line width={percent} />
          <Typography color="text.secondary" variant="body2">
            {percent}%
          </Typography>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          spacing={2}
          width="100%"
        >
          <AvatarGroup max={6}>
            {cardItem?.teamMembers?.map((member) => (
              <ImageAvatar
                user={member.profile}
                sx={{
                  bgcolor: generateRandomColorWithName(
                    member.profile.full_name || ""
                  ),
                  width: "1.5em",
                  height: "1.5em",
                  color: "#fff",
                }}
                key={member.id}
                alt={member.profile.full_name || ""}
              >
                <Typography variant="body2" color="white">
                  {getFirstLettersOfWord(member.profile.full_name || "")}
                </Typography>
              </ImageAvatar>
            ))}
          </AvatarGroup>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="row"
            fontSize="10px"
            fontWeight="bold"
            gap={1.5}
            padding="2px 15px"
            borderRadius={10}
            sx={{
              border: "1px solid #e5e7eb",
            }}
          >
            <TaskAltIcon color="inherit" fontSize="small" />
            <Typography
              color="text.secondary"
              marginBottom="0px"
              variant="body2"
              whiteSpace="pre-wrap"
            >
              {doneTasks} / {totalTasks}
            </Typography>
          </Box>
        </Grid>
      </CardActions>
    </MUICard>
  );
}
