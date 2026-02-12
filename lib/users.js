import { createSupabaseServer } from "./supabaseServer";

export async function getAssignableUsers() {
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
    .from('org_members')
    .select(`
      profiles:user_id (
        id,
        full_name,
        avatar_url,
        role
      )
    `)
    .eq('org_id', profile.current_org_id);

  if (error) {
    console.error("getAssignableUsers error:", error);
    return [];
  }

  return data?.map(m => m.profiles).filter(Boolean) || [];
}