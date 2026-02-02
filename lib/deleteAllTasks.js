"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function deleteAllTasks() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if current user is admin
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Delete all tasks - using a condition that matches all records
  const { error } = await supabase
    .from("tasks")
    .delete()
    .neq("created_at", "1900-01-01T00:00:00.000Z");

  if (error) throw new Error("Failed to delete tasks");

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}