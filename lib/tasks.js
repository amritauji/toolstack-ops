"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import { validateTaskData } from "@/lib/validation";
import { withErrorHandling, AppError, ErrorCodes, handleSupabaseError } from "@/lib/errorHandling";
import { withCache, cacheKeys, invalidateCache } from "@/lib/cache";
import { withDatabaseMetrics } from "@/lib/database";
import { sanitizeInput } from "@/lib/sanitize";

export const getTasks = withCache(
  cacheKeys.tasks,
  withDatabaseMetrics(async () => {
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: profile } = await supabase
      .from('profiles')
      .select('current_org_id')
      .eq('id', user.id)
      .single();

    if (!profile?.current_org_id) return [];

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
      .eq('org_id', profile.current_org_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getTasks error:", error);
      return [];
    }

    return data;
  }),
  2 * 60 * 1000
);

export const createTask = withErrorHandling(async (formData) => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_org_id) {
    throw new AppError("Please set up your organization first", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const taskData = {
    title: sanitizeInput(formData.get("title")),
    assigned_to: formData.get("assigned_to") || null,
    priority: formData.get("priority") || "medium",
    due_date: formData.get("due_date") || null,
    project_id: formData.get("project_id") || null
  };

  const validation = validateTaskData(taskData);
  if (!validation.isValid) {
    throw new AppError(validation.errors.join(', '), 400, ErrorCodes.VALIDATION_ERROR);
  }

  const { data, error } = await supabase.from("tasks").insert({
    ...validation.sanitized,
    created_by: user.id,
    org_id: profile.current_org_id,
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
  
  // Send notification if task is assigned
  if (validation.sanitized.assigned_to) {
    const { notifyTaskAssignment } = await import('./notifications');
    const { data: assigner } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    await notifyTaskAssignment(
      data.id,
      validation.sanitized.assigned_to,
      assigner?.full_name || 'Someone',
      validation.sanitized.title,
      profile.current_org_id
    );
  }

  // Trigger automations
  const { processAutomationTrigger } = await import('./automations');
  await processAutomationTrigger('task_created', data.id, null, data);

  revalidatePath("/dashboard");
  return data;
});

export async function updateTaskStatus(taskId, status) {
  const supabase = await createSupabaseServer();

  const { data: task } = await supabase
    .from("tasks")
    .select('title, assigned_to, org_id, status')
    .eq("id", taskId)
    .single();

  const oldStatus = task?.status;

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

  // Send notification
  if (task?.assigned_to && task?.org_id) {
    const { notifyStatusChange } = await import('./notifications');
    await notifyStatusChange(taskId, task.title, status, task.assigned_to, task.org_id);
  }

  // Trigger automations
  const { processAutomationTrigger } = await import('./automations');
  await processAutomationTrigger('status_change', taskId, { status: oldStatus }, { status });
}

export async function updateTask(formData) {
  const supabase = await createSupabaseServer();

  const taskId = formData.get("taskId");
  const title = sanitizeInput(formData.get("title"));
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