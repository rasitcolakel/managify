import { Database } from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"] & {
  owner: Profile;
};

type TeamMember = Database["public"]["Tables"]["teamMembers"]["Row"];
type TeamMemberWithUser = TeamMember & {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
};
type TeamWithMembers = Team & { teamMembers: TeamMemberWithUser[] };

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type { Team, TeamMember, TeamWithMembers, Profile, WithRequired };
