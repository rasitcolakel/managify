import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslate } from "@refinedev/core";
import React, { memo, useContext } from "react";
import { TeamMemberWithProfile } from "src/types";
import {
  generateRandomColorWithName,
  getFirstLettersOfWord,
} from "src/utility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import useConfirmationModal from "@components/common/useConfirmationModal";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { TeamContext } from "@contexts/TeamContext";
import ImageAvatar from "@components/common/ImageAvatar";
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  marginLeft: theme.spacing(1),
}));

type Props = {
  teamMember: TeamMemberWithProfile;
  isOwner: boolean;
  type: "owner" | "member";
};

function RenderMember({ teamMember, isOwner, type }: Props) {
  const { onDeleteMember, onMakeOwner } = useContext(TeamContext);

  const fullName = `${teamMember.profile?.first_name} ${teamMember.profile?.last_name}`;

  const isInvited = teamMember.status === "invited";
  const isDeclined = teamMember.status === "declined";

  const t = useTranslate();

  const getAvatarAlt = React.useCallback(() => {
    return getFirstLettersOfWord(fullName);
  }, [fullName]);

  // Settings menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { openModal, ConfirmationModal } = useConfirmationModal();

  const openDeleteModal = () => {
    openModal(deleteMember, t("teamMembers.deleteMemberQuestion"));
    // close the menu
    handleClose();
  };

  const deleteMember = () => {
    onDeleteMember(teamMember);
  };

  const openMakeOwnerModal = () => {
    openModal(makeOwner, t("teamMembers.makeOwnerQuestion"));
    // close the menu
    handleClose();
  };

  const makeOwner = () => {
    onMakeOwner(teamMember);
  };

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
        <ImageAvatar
          user={teamMember.profile}
          sx={{
            bgcolor: generateRandomColorWithName(fullName),
            height: "3em",
            width: "3em",
          }}
        >
          <Typography variant="h6" color="white">
            {getAvatarAlt()}
          </Typography>
        </ImageAvatar>
        <Stack padding={1} flex="1">
          <Typography variant="h6">
            {teamMember.profile?.first_name} {teamMember.profile?.last_name}
          </Typography>
          <Typography variant="body2">
            {t("teamMembers.types." + type)}
          </Typography>
        </Stack>
        {isInvited && (
          <Chip
            label={t("teamMembers.statuses.invited")}
            color="warning"
            variant="outlined"
            size="small"
          />
        )}
        {isDeclined && (
          <Chip
            label={t("teams.invitation.declined")}
            color="error"
            variant="outlined"
            size="small"
          />
        )}
        {/* Settings menu */}
        {isOwner && type === "member" && (
          <>
            <StyledIconButton onClick={handleClick}>
              <MoreVertIcon />
            </StyledIconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuList>
                <MenuItem disabled={isInvited} onClick={openMakeOwnerModal}>
                  <ListItemIcon>
                    <SupervisedUserCircleIcon
                      fontSize="small"
                      color="success"
                    />
                  </ListItemIcon>
                  <ListItemText>
                    {t("teamMembers.buttons.makeOwner")}
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={openDeleteModal}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>{t("buttons.remove")}</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
        {ConfirmationModal}
        {/* Settings menu */}
      </Stack>
    </Card>
  );
}

export default memo(RenderMember);
