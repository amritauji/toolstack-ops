import { createSupabaseServer } from "./supabaseServer";

export async function getActivityFeed() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_org_id) return [];

  const { data } = await supabase
    .from("activity_logs")
    .select(`
      id,
      action,
      created_at,
      details,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq('org_id', profile.current_org_id)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}