import { createSupabaseServer } from "./supabaseServer";

export async function getAdminAnalytics() {
  const supabase = await createSupabaseServer();

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const [
    { count: totalTasks },
    { count: inProgress },
    { count: completedLast7 },
    { count: overdue },
    { count: activeUsers },
  ] = await Promise.all([
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("tasks").select("*", { count: "exact", head: true })
      .eq("status", "done")
      .gte("updated_at", sevenDaysAgo.toISOString()),
    supabase.from("tasks").select("*", { count: "exact", head: true })
      .neq("status", "done")
      .lt("due_date", now.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true })
      .gte("last_login", sevenDaysAgo.toISOString()),
  ]);

  return {
    totalTasks,
    inProgress,
    completedLast7,
    overdue,
    activeUsers,
  };
}

export async function getTaskDistribution() {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("tasks")
    .select(`
      assigned_to,
      profiles:assigned_to (
        full_name
      )
    `)
    .neq("status", "done");

  const distribution = {};
  
  data?.forEach(task => {
    const userId = task.assigned_to;
    const userName = task.profiles?.full_name || "Unassigned";
    
    if (!distribution[userId || "unassigned"]) {
      distribution[userId || "unassigned"] = {
        name: userName,
        count: 0
      };
    }
    distribution[userId || "unassigned"].count++;
  });

  return Object.values(distribution).sort((a, b) => b.count - a.count);
}