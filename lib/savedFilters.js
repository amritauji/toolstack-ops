"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";
import { revalidatePath } from "next/cache";

export const getSavedFilters = withErrorHandling(async () => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data, error } = await supabase
    .from('saved_filters')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
});

export const createSavedFilter = withErrorHandling(async (name, filterConfig) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  const { data, error } = await supabase
    .from('saved_filters')
    .insert({
      user_id: user.id,
      org_id: profile.current_org_id,
      name,
      filter_config: filterConfig
    })
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
});

export const updateSavedFilter = withErrorHandling(async (filterId, name, filterConfig) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('saved_filters')
    .update({ name, filter_config: filterConfig, updated_at: new Date().toISOString() })
    .eq('id', filterId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

export const deleteSavedFilter = withErrorHandling(async (filterId) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('saved_filters')
    .delete()
    .eq('id', filterId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

export const setDefaultFilter = withErrorHandling(async (filterId) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  // Unset all defaults
  await supabase
    .from('saved_filters')
    .update({ is_default: false })
    .eq('user_id', user.id);

  // Set new default
  const { error } = await supabase
    .from('saved_filters')
    .update({ is_default: true })
    .eq('id', filterId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});
