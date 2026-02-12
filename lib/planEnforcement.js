"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { canPerformAction } from "@/lib/planLimits";

export async function checkPlanLimit(action) {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_org_id) {
    return { allowed: true };
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', profile.current_org_id)
    .single();

  if (!org) {
    return { allowed: true };
  }

  const plan = org?.plan || 'free';
  const usage = await getOrgUsage(profile.current_org_id);

  return canPerformAction(plan, action, usage);
}

export async function getOrgUsage(orgId) {
  const supabase = await createSupabaseServer();

  const [
    { count: userCount },
    { count: taskCount },
    { data: attachments }
  ] = await Promise.all([
    supabase
      .from('org_members')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId),
    supabase
      .from('task_attachments')
      .select('file_size')
      .eq('org_id', orgId)
  ]);

  const storageMB = attachments?.reduce((sum, a) => sum + (a.file_size || 0), 0) / (1024 * 1024) || 0;

  return {
    users: userCount || 0,
    tasks: taskCount || 0,
    storage: Math.round(storageMB)
  };
}

export async function enforceLimit(action) {
  const result = await checkPlanLimit(action);
  
  if (!result.allowed) {
    throw new Error(result.message || 'Plan limit reached');
  }
  
  return result;
}
