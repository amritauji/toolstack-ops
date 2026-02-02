import { createSupabaseServer } from "./supabaseServer";

export async function getActivityFeed() {
  const supabase = await createSupabaseServer();

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
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}