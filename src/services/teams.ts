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
  if (!authProvider.getIdentity) {
    return false;
  }
  const user: any = await authProvider.getIdentity();

  if (team.owner.id === user?.id) {
    return true;
  }
  return false;
};
