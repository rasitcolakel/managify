import {Database} from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type TeamMember = Database["public"]["Tables"]["teamMembers"]["Row"];
type TeamMemberWithUser = TeamMember & {
    profile: Database["public"]["Tables"]["profiles"]["Row"];
};
type TeamWithMembers = Team & { teamMembers: TeamMemberWithUser[] };

export type {Team, TeamMember, TeamWithMembers};
