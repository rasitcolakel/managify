import { authProvider } from "src/authProvider";
import { Team } from "src/types";
import { supabaseClient } from "src/utility";

type addNewTeamMemberProps = {
  teamId: number;
  userId: string;
};
export const checkTeamHasTheUser = async ({
  teamId,
  userId,
}: addNewTeamMemberProps) => {
  const { data, error } = await supabaseClient
    .from("teamMembers")
    .select("*")
    .eq("team_id", teamId)
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data.length ? true : false;
};

export const checkIsTeamOwner = async (team: Team): Promise<boolean> => {
  const user: any = await authProvider.getIdentity();

  if (team.owner.id === user?.id) {
    return true;
  }
  return false;
};

export const getMyMemberData = async (teamId: number) => {
  const authData = (await authProvider.getIdentity()) as any;
  if (!authData) {
    throw new Error("User is not logged in");
  }

  const { data, error } = await supabaseClient
    .from("teamMembers")
    .select("*, profile:profiles(*)")
    .eq("team_id", teamId)
    .eq("user_id", authData.id);
  if (error) {
    throw error;
  }
  return data[0];
};

export const deleteTeamMember = async (id: number) => {
  const { error } = await supabaseClient
    .from("teamMembers")
    .delete()
    .eq("id", id);
  if (error) {
    throw error;
  }
};

export const changeOwner = async (teamId: number, newOwnerId: string) => {
  const { error } = await supabaseClient
    .from("teams")
    .update({ owner: newOwnerId })
    .eq("id", teamId);
  if (error) {
    throw error;
  }
};

export const getTeamsOwnedByAuthUser = async () => {
  const { data, error } = await supabaseClient.rpc(
    "get_teams_owned_by_authenticated_user"
  );

  if (error) {
    throw error;
  }
  return data as number[];
};

export const makeTeamDeleted = async (teamId: number) => {
  await updateTeamStatus(teamId, "deleted");
};

export const makeTeamActive = async (teamId: number) => {
  await updateTeamStatus(teamId, "active");
};

export const updateTeamStatus = async (
  teamId: number,
  status: "active" | "deleted"
) => {
  const { error } = await supabaseClient
    .from("teams")
    .update({ status })
    .eq("id", teamId);

  if (error) {
    throw error;
  }
};
