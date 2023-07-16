import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TaskWithAssignee } from "src/types";
import { supabaseClient } from "src/utility";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Istanbul");
export type CreateTask = Pick<
  TaskWithAssignee,
  "title" | "description" | "team_id" | "priority" | "status" | "due_date"
> & {
  assignees: number[];
};

export type InsertTaskUpdateProps = {
  task_id: number;
  team_id: number;
  updates: TaskUpdate[];
};
export type TaskUpdate = {
  type: "create" | "status" | "priority" | "assignee" | "due_date" | "comment";
  content?: string;
};

export const newTask = async (task: CreateTask) => {
  const { data, error } = await supabaseClient
    .from("tasks")
    .insert({
      title: task.title,
      description: task.description,
      team_id: task.team_id,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  await assignTeamMember(data.id, task.team_id!, task.assignees);
  return data;
};

export const updateTask = async (
  id: TaskWithAssignee["id"],
  task: CreateTask
) => {
  const oldTask = await getTaskAssignments(id);
  const { deletedIds, newIds } = getTaskAssignmentChanges(
    oldTask.taskAssignments,
    task.assignees
  );

  const taskUpdates: TaskUpdate[] = [];

  if (oldTask.priority !== task.priority) {
    taskUpdates.push({
      type: "priority",
      content: task.priority as string,
    });
  }

  if (oldTask.status !== task.status) {
    taskUpdates.push({
      type: "status",
      content: task.status as string,
    });
  }

  if (oldTask.due_date !== task.due_date) {
    const newDate = dayjs(task.due_date).utc().format();
    const diff = dayjs(newDate).diff(oldTask.due_date, "m");
    if (diff > 0) {
      taskUpdates.push({
        type: "due_date",
        content: newDate,
      });
    }
  }

  const { error } = await supabaseClient
    .from("tasks")
    .update({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }

  if (deletedIds.length) {
    await supabaseClient.from("taskAssignments").delete().in("id", deletedIds);
  }

  if (newIds.length) {
    await assignTeamMember(id, task.team_id!, newIds);
  }

  if (taskUpdates.length) {
    await insertTaskUpdate({
      task_id: id,
      team_id: task.team_id!,
      updates: taskUpdates,
    });
  }

  return {
    id,
    ...task,
  };
};

export const updateTaskStatus = async (
  id: TaskWithAssignee["id"],
  team_id: TaskWithAssignee["team_id"],
  status: TaskWithAssignee["status"]
) => {
  const { error, data } = await supabaseClient

    .from("tasks")
    .update({
      status,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }

  await insertTaskUpdate({
    task_id: id,
    team_id: team_id!,
    updates: [
      {
        type: "status",
        content: status ?? "",
      },
    ],
  });

  return data;
};

export const updateTaskPriority = async (
  id: TaskWithAssignee["id"],
  team_id: TaskWithAssignee["team_id"],
  priority: TaskWithAssignee["priority"]
) => {
  const { error, data } = await supabaseClient

    .from("tasks")
    .update({
      priority,
    })
    .eq("id", id);
  if (error) {
    throw error;
  }

  await insertTaskUpdate({
    task_id: id,
    team_id: team_id!,
    updates: [
      {
        type: "priority",
        content: priority ?? "",
      },
    ],
  });

  return data;
};

const getTaskAssignmentChanges = (
  oldAssignments: TaskWithAssignee["taskAssignments"],
  newAssignments: CreateTask["assignees"]
) => {
  const deletedIds = oldAssignments
    .filter(
      (oldAssignment) =>
        oldAssignment.team_member_id &&
        !newAssignments.includes(oldAssignment.team_member_id)
    )
    .map((oldAssignment) => oldAssignment.id);
  const newIds = newAssignments.filter(
    (newAssignment) =>
      !oldAssignments
        .map((oldAssignment) => oldAssignment.team_member_id)
        .includes(newAssignment)
  );
  return {
    deletedIds,
    newIds,
  };
};

export const getTaskAssignments = async (
  task_id: number
): Promise<TaskWithAssignee> => {
  const { data, error } = await supabaseClient
    .from("tasks")
    .select("*, taskAssignments(*)")
    .eq("id", task_id)
    .single();
  if (error) {
    throw error;
  }
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

export const insertTaskUpdate = async ({
  task_id,
  team_id,
  updates,
}: InsertTaskUpdateProps) => {
  const newTaskUpdates = updates.map((change) => ({
    task_id,
    team_id,
    ...change,
  }));

  const { data, error } = await supabaseClient
    .from("taskUpdates")
    .insert(newTaskUpdates)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const getTasksCreatedByUser = async () => {
  const { data, error } = await supabaseClient.rpc(
    "get_tasks_created_by_auth_user"
  );

  if (error) {
    throw error;
  }
  return data as number[];
};
