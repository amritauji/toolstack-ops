"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import { validateTaskData } from "@/lib/validation";
import { withErrorHandling, AppError, ErrorCodes, handleSupabaseError } from "@/lib/errorHandling";
import { withCache, cacheKeys, invalidateCache } from "@/lib/cache";
import { withDatabaseMetrics } from "@/lib/database";
import { addEmailJob } from "@/lib/jobQueue";

export const getTasks = withCache(
  cacheKeys.tasks,
  withDatabaseMetrics(async () => {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        status,
        priority,
        due_date,
        assigned_to,
        profiles:assigned_to (
          id,
          full_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getTasks error:", error);
      return [];
    }

    return data;
  }),
  2 * 60 * 1000 // 2 minutes cache
);

export const createTask = withErrorHandling(async (formData) => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const taskData = {
    title: formData.get("title"),
    assigned_to: formData.get("assigned_to") || null,
    priority: formData.get("priority") || "medium",
    due_date: formData.get("due_date") || null
  };

  const validation = validateTaskData(taskData);
  if (!validation.isValid) {
    throw new AppError(validation.errors.join(', '), 400, ErrorCodes.VALIDATION_ERROR);
  }

  const { data, error } = await supabase.from("tasks").insert({
    ...validation.sanitized,
    created_by: user.id,
  }).select().single();

  if (error) {
    throw handleSupabaseError(error);
  }

  await logActivity({
    action: "TASK_CREATED",
    resourceType: "task",
    resourceId: data.id,
    details: { title: validation.sanitized.title, priority: validation.sanitized.priority, assigned_to: validation.sanitized.assigned_to },
  });

  // Invalidate cache
  invalidateCache('tasks');
  
  // Send notification email if task is assigned
  if (validation.sanitized.assigned_to) {
    addEmailJob(
      'assignee@example.com', // Would get actual email from user profile
      'New Task Assigned',
      `You have been assigned a new task: ${validation.sanitized.title}`,
      { delay: 5000 } // 5 second delay
    );
  }

  revalidatePath("/dashboard");
  return data;
});

export async function updateTaskStatus(taskId, status) {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) {
    throw new Error("Failed to update task status");
  }

  await logActivity({
    action: "TASK_STATUS_CHANGED",
    resourceType: "task",
    resourceId: taskId,
    details: { status },
  });
  
  // Invalidate cache
  invalidateCache('tasks');
}

export async function updateTask(formData) {
  const supabase = await createSupabaseServer();

  const taskId = formData.get("taskId");
  const title = formData.get("title");
  const priority = formData.get("priority");
  const due_date = formData.get("due_date") || null;
  const assigned_to = formData.get("assigned_to") || null;

  const { error } = await supabase
    .from("tasks")
    .update({ title, priority, due_date, assigned_to })
    .eq("id", taskId);

  if (error) {
    throw new Error("Failed to update task");
  }

  await logActivity({
    action: "TASK_UPDATED",
    resourceType: "task",
    resourceId: taskId,
    details: { title, priority, due_date, assigned_to },
  });
  
  // Invalidate cache
  invalidateCache('tasks');

  revalidatePath("/dashboard");
}

export async function bulkUpdateTasks(formData) {
  const supabase = await createSupabaseServer();

  const taskIds = JSON.parse(formData.get("taskIds"));
  const action = formData.get("action");
  const value = formData.get("value");

  let updateData = {};
  if (action === "status") updateData.status = value;
  if (action === "priority") updateData.priority = value;
  if (action === "assignee") updateData.assigned_to = value || null;

  const { error } = await supabase
    .from("tasks")
    .update(updateData)
    .in("id", taskIds);

  if (error) {
    throw new Error("Failed to bulk update tasks");
  }

  await logActivity({
    action: "BULK_UPDATE",
    resourceType: "task",
    resourceId: null,
    details: { action, value, count: taskIds.length },
  });
  
  // Invalidate cache
  invalidateCache('tasks');

  revalidatePath("/dashboard");
}