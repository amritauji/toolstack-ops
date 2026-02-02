import { createSupabaseServer } from "./supabaseServer";

export async function getFilteredTasks(filter) {
  const supabase = await createSupabaseServer();
  const today = new Date().toISOString();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let query = supabase
    .from("tasks")
    .select(`
      id,
      title,
      status,
      due_date,
      created_at,
      profiles:assigned_to (
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (filter === "in-progress") {
    query = query.eq("status", "in_progress");
  } else if (filter === "completed-7d") {
    query = query.eq("status", "done").gte("updated_at", sevenDaysAgo.toISOString());
  } else if (filter === "overdue") {
    query = query.neq("status", "done").lt("due_date", today);
  }
  // For "all" filter, no additional conditions are added

  const { data, error } = await query;
  
  if (error) {
    console.error("getFilteredTasks error:", error);
    return [];
  }

  return data || [];
}

export async function getTeamActivity() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, last_login")
    .order("last_login", { ascending: false });

  if (error) {
    console.error("getTeamActivity error:", error);
    return [];
  }

  return data || [];
}