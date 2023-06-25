import { Database } from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type TeamMember = Database["public"]["Tables"]["teamMembers"]["Row"];
type TeamMemberWithUser = TeamMember & {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
};
type TeamWithMembers = Team & { teamMembers: TeamMemberWithUser[] };

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type { Team, TeamMember, TeamWithMembers, Profile };
