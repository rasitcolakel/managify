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
type TeamMemberWithProfile = TeamWithMembers["teamMembers"][0];

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type TaskAssignment = Database["public"]["Tables"]["taskAssignments"]["Row"];

type TaskAssignmentWithAssignee = TaskAssignment & {
  assignee: TeamMemberWithProfile;
};

type TaskWithAssignee = Database["public"]["Tables"]["tasks"]["Row"] & {
  taskAssignments: TaskAssignmentWithAssignee[];
};

type getMembersOfTeamType =
  Database["public"]["Functions"]["get_team_members_of_a_team"]["Returns"];

type getMyTeamMembershipsType =
  Database["public"]["Functions"]["get_my_team_memberships"]["Returns"];

export type {
  Team,
  TeamMember,
  TeamWithMembers,
  Profile,
  WithRequired,
  TeamMemberWithProfile,
  TaskWithAssignee,
  getMembersOfTeamType,
  getMyTeamMembershipsType,
};
