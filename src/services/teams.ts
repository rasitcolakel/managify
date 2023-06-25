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
