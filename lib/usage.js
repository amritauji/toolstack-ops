'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';

// Get current usage for organization/workspace
export async function getCurrentUsage() {
  const supabase = await createSupabaseServer();
  
  try {
    // Get user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Get task count
    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });
    
    // Get storage usage (sum of attachment sizes)
    const { data: attachments } = await supabase
      .from('attachments')
      .select('file_size');
    
    const storageUsed = attachments?.reduce((sum, att) => sum + (att.file_size || 0), 0) || 0;
    const storageMB = Math.round(storageUsed / (1024 * 1024));
    
    return {
      users: userCount || 0,
      tasks: taskCount || 0,
      storage: storageMB
    };
  } catch (error) {
    console.error('Error getting usage:', error);
    return {
      users: 0,
      tasks: 0,
      storage: 0
    };
  }
}

// Get user's current plan
export async function getUserPlan() {
  const supabase = await createSupabaseServer();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'free';
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    
    return profile?.plan || 'free';
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'free';
  }
}

// Check if action is allowed
export async function checkActionAllowed(action) {
  const plan = await getUserPlan();
  const usage = await getCurrentUsage();
  
  const { canPerformAction } = await import('@/lib/planLimits');
  return canPerformAction(plan, action, usage);
}
