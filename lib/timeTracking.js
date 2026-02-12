"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";
import { revalidatePath } from "next/cache";

export const startTimeEntry = withErrorHandling(async (taskId) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_org_id) {
    throw new AppError("No organization selected", 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Check if there's already an active entry
  const { data: activeEntry } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', user.id)
    .is('end_time', null)
    .single();

  if (activeEntry) {
    throw new AppError("Stop current timer first", 400, ErrorCodes.VALIDATION_ERROR);
  }

  const { data, error } = await supabase
    .from('time_entries')
    .insert({
      task_id: taskId,
      user_id: user.id,
      org_id: profile.current_org_id,
      start_time: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
});

export const stopTimeEntry = withErrorHandling(async (entryId) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: entry } = await supabase
    .from('time_entries')
    .select('start_time')
    .eq('id', entryId)
    .eq('user_id', user.id)
    .single();

  if (!entry) throw new AppError("Entry not found", 404, ErrorCodes.NOT_FOUND);

  const endTime = new Date();
  const startTime = new Date(entry.start_time);
  const durationSeconds = Math.floor((endTime - startTime) / 1000);

  const { data, error } = await supabase
    .from('time_entries')
    .update({
      end_time: endTime.toISOString(),
      duration_seconds: durationSeconds
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
});

export const getTaskTimeEntries = withErrorHandling(async (taskId) => {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('time_entries')
    .select(`
      id,
      start_time,
      end_time,
      duration_seconds,
      description,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('task_id', taskId)
    .order('start_time', { ascending: false });

  if (error) throw error;
  return data || [];
});

export const getUserActiveTimeEntry = withErrorHandling(async () => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('time_entries')
    .select(`
      id,
      task_id,
      start_time,
      tasks (
        id,
        title
      )
    `)
    .eq('user_id', user.id)
    .is('end_time', null)
    .single();

  return data;
});
