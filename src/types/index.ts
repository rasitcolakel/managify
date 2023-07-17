import { Database } from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"] & {
  owner: Profile;
  teamMembers: TeamMemberWithUser[];
  tasks: Task[];
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

type Task = Database["public"]["Tables"]["tasks"]["Row"];

type TaskWithAssignee = Task & {
  taskAssignments: TaskAssignmentWithAssignee[];
};

type getMembersOfTeamType =
  Database["public"]["Functions"]["get_team_members_of_a_team"]["Returns"];

type getMyTeamMembershipsType =
  Database["public"]["Functions"]["get_my_team_memberships"]["Returns"];

type TaskUpdates = Database["public"]["Tables"]["taskUpdates"]["Row"];

type Invitation = Database["public"]["Tables"]["teamMembers"]["Row"] & {
  team: Team;
};

export type {
  Task,
  Team,
  TeamMember,
  TeamWithMembers,
  Invitation,
  Profile,
  TaskUpdates,
  WithRequired,
  TeamMemberWithProfile,
  TaskWithAssignee,
  getMembersOfTeamType,
  getMyTeamMembershipsType,
};
