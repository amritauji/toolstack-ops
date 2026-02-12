'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';

export async function getCurrentUsage() {
  const supabase = await createSupabaseServer();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { users: 0, tasks: 0, storage: 0 };

    const { data: profile } = await supabase
      .from('profiles')
      .select('current_org_id')
      .eq('id', user.id)
      .single();

    if (!profile?.current_org_id) return { users: 0, tasks: 0, storage: 0 };

    const { getOrgUsage } = await import('@/lib/planEnforcement');
    return await getOrgUsage(profile.current_org_id);
  } catch (error) {
    console.error('Error getting usage:', error);
    return { users: 0, tasks: 0, storage: 0 };
  }
}

export async function getUserPlan() {
  const supabase = await createSupabaseServer();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'free';
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_org_id')
      .eq('id', user.id)
      .single();

    if (!profile?.current_org_id) return 'free';

    const { data: org } = await supabase
      .from('organizations')
      .select('plan')
      .eq('id', profile.current_org_id)
      .single();
    
    return org?.plan || 'free';
  } catch (error) {
    console.error('Error getting user plan:', error);
    return 'free';
  }
}

export async function checkActionAllowed(action) {
  const { checkPlanLimit } = await import('@/lib/planEnforcement');
  return await checkPlanLimit(action);
}
