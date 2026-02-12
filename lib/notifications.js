"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";
import { revalidatePath } from "next/cache";

export const getNotifications = withErrorHandling(async (limit = 50) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
});

export const getUnreadCount = withErrorHandling(async () => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
});

export const createNotification = withErrorHandling(async (notificationData) => {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single();

  if (error) throw error;
  return data;
});

export const markAsRead = withErrorHandling(async (notificationId) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

export const markAllAsRead = withErrorHandling(async () => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

export const deleteNotification = withErrorHandling(async (notificationId) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

// Helper to send notification on task assignment
export const notifyTaskAssignment = async (taskId, assigneeId, assignerName, taskTitle, orgId) => {
  await createNotification({
    user_id: assigneeId,
    org_id: orgId,
    type: 'task_assigned',
    title: 'New task assigned',
    message: `${assignerName} assigned you to: ${taskTitle}`,
    resource_type: 'task',
    resource_id: taskId
  });
};

// Helper to send notification on comment
export const notifyComment = async (taskId, commenterId, commenterName, taskTitle, assigneeId, orgId) => {
  if (assigneeId && assigneeId !== commenterId) {
    await createNotification({
      user_id: assigneeId,
      org_id: orgId,
      type: 'comment_added',
      title: 'New comment',
      message: `${commenterName} commented on: ${taskTitle}`,
      resource_type: 'task',
      resource_id: taskId
    });
  }
};

// Helper to send notification on status change
export const notifyStatusChange = async (taskId, taskTitle, newStatus, assigneeId, orgId) => {
  if (assigneeId) {
    await createNotification({
      user_id: assigneeId,
      org_id: orgId,
      type: 'status_changed',
      title: 'Task status updated',
      message: `Task "${taskTitle}" is now ${newStatus}`,
      resource_type: 'task',
      resource_id: taskId
    });
  }
};
