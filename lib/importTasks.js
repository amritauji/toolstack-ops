"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function importTasks(tasks) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const tasksToInsert = tasks.map(task => ({
    title: task.title,
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    due_date: task.due_date || null,
    assigned_to: task.assigned_to || null,
    created_by: user.id,
  }));

  const { data, error } = await supabase
    .from("tasks")
    .insert(tasksToInsert)
    .select();

  if (error) {
    throw new Error("Failed to import tasks");
  }

  await logActivity({
    action: "TASKS_IMPORTED",
    resourceType: "task",
    resourceId: null,
    details: { count: data.length },
  });

  revalidatePath("/dashboard");
  return data;
}