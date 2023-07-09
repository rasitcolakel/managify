import { TaskWithAssignee } from "src/types";
import { supabaseClient } from "src/utility";

export type CreateTask = Pick<
  TaskWithAssignee,
  "title" | "description" | "assignees" | "team_id"
>;

export const newTask = async (task: CreateTask) => {
  const { data, error } = await supabaseClient
    .from("tasks")
    .insert({
      title: task.title,
      description: task.description,
      team_id: task.team_id,
      status: "todo",
      priority: "low",
      // 3 days from now in ISO format (YYYY-MM-DD)
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  await assignTeamMember(data.id, task.team_id!, task.assignees);
  return data;
};

export const assignTeamMember = async (
  task_id: number,
  team_id: number,
  teamMembers: number[]
) => {
  const { data, error } = await supabaseClient
    .from("taskAssignments")
    .insert(
      teamMembers.map((team_member_id) => ({
        task_id,
        team_id,
        team_member_id,
      }))
    )
    .select();
  if (error) {
    throw error;
  }
  return data;
};
