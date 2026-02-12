"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";
import { sanitize } from "@/lib/validation";

export const getTaskComments = withErrorHandling(async (taskId) => {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("task_comments")
    .select(`
      id,
      content,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
});

export const createComment = withErrorHandling(async (taskId, content) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id, full_name')
    .eq('id', user.id)
    .single();

  if (!content?.trim()) {
    throw new AppError("Comment content is required", 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Get task info for notification
  const { data: task } = await supabase
    .from('tasks')
    .select('title, assigned_to')
    .eq('id', taskId)
    .single();

  const { data, error } = await supabase
    .from("task_comments")
    .insert({
      task_id: taskId,
      user_id: user.id,
      org_id: profile.current_org_id,
      content: sanitize.html(content.trim())
    })
    .select(`
      id,
      content,
      created_at,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  
  // Send notification to task assignee
  if (task?.assigned_to && task.assigned_to !== user.id) {
    const { notifyComment } = await import('./notifications');
    await notifyComment(
      taskId,
      user.id,
      profile.full_name || 'Someone',
      task.title,
      task.assigned_to,
      profile.current_org_id
    );
  }
  
  revalidatePath("/dashboard");
  return data;
});

export const deleteComment = withErrorHandling(async (commentId) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { error } = await supabase
    .from("task_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) throw error;
  
  revalidatePath("/dashboard");
});