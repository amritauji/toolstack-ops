import { createSupabaseServer } from "./supabaseServer";

export async function getAssignableUsers() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
    .in("role", ["admin", "user"])
    .order("full_name");

  if (error) {
    console.error("getAssignableUsers error:", error);
    return [];
  }

  return data || [];
}