import React, { useCallback, useEffect } from "react";
import { TeamWithMembers } from "src/types";
import RenderMember from "./RenderMember";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Add from "@mui/icons-material/Add";
import RoundedIconButton from "@components/common/RoundedIconButton";
import { Typography } from "@mui/material";
import { HttpError, useNotification, useTranslate } from "@refinedev/core";
import CreateTeamMemberModal from "@components/teams/members/createTeamMemberModal";
import { useModalForm } from "@refinedev/react-hook-form";
import { checkIsTeamOwner, checkTeamHasTheUser } from "src/services/teams";
import { useAsyncFunction } from "@components/hooks/useAsyncFunction";

type Props = {
  team: TeamWithMembers;
};

export type AddTeamMember = {
  user_id: string;
  team_id: number;
};

export const TeamMembers = ({ team }: Props) => {
  const { teamMembers } = team;
  const { open } = useNotification();
  const t = useTranslate();
  const { data: isOwner, execute } = useAsyncFunction<
    typeof checkIsTeamOwner,
    boolean
  >(checkIsTeamOwner);

  const renderMember = useCallback(
    (teamMember: Props["team"]["teamMembers"][0]) => (
      <Grid key={teamMember.id} item xs={12} sm={6} md={6} lg={4} xl={3}>
        <RenderMember
          key={teamMember.id}
          teamMember={teamMember}
          isOwner={team.owner.id === teamMember.user_id}
        />
      </Grid>
    ),
    [team.owner.id]
  );

  useEffect(() => {
    execute(team);
  }, [execute, team]);

  const createTeamMemberDrawerProps = useModalForm<
    AddTeamMember,
    HttpError,
    AddTeamMember
  >({
    refineCoreProps: { action: "create", resource: "teamMembers" },
    syncWithLocation: true,
    defaultValues: {
      team_id: team.id,
    },
  });

  const {
    modal: { show: showCreateDrawer },
  } = createTeamMemberDrawerProps;

  const onClose = () => {
    createTeamMemberDrawerProps.reset();
    createTeamMemberDrawerProps.modal.close();
  };

  const openModal = () => {
    createTeamMemberDrawerProps.setValue("team_id", team.id);
    showCreateDrawer();
  };

  const checkUserAlreadyInTeam = async (callback: any) => {
    const { user_id } = createTeamMemberDrawerProps.getValues();
    const check = await checkTeamHasTheUser({
      teamId: team.id,
      userId: user_id,
    });
    if (check) {
      const error = {
        message: t("teams.errors.user_already_member"),
        type: "error" as any,
      };
      open?.(error);
      createTeamMemberDrawerProps.setError("user_id", error);
      return;
    }
    callback();
  };

  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pt={1}
        pr={1}
      >
        <Typography variant="h6">{`Members(${teamMembers.length})`}</Typography>
        {!!isOwner && (
          <RoundedIconButton
            icon={
              <Add
                style={{
                  color: "white",
                }}
              />
            }
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={openModal}
          />
        )}
      </Stack>
      <Grid container spacing={1} pt={2}>
        {teamMembers.map((teamMember) => renderMember(teamMember))}
      </Grid>
      {!!isOwner && (
        <CreateTeamMemberModal
          {...createTeamMemberDrawerProps}
          onClose={onClose}
          saveButtonProps={{
            ...createTeamMemberDrawerProps.saveButtonProps,
            onClick: async () => {
              checkUserAlreadyInTeam(
                createTeamMemberDrawerProps.saveButtonProps.onClick
              );
            },
          }}
        />
      )}
    </Stack>
  );
};
