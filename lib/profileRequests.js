"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function getProfileRequests() {
  const supabase = await createSupabaseServer();

  try {
    const { data, error } = await supabase
      .from("profile_change_requests")
      .select(`
        id,
        user_id,
        requested_changes,
        current_data,
        status,
        admin_notes,
        created_at,
        profiles:user_id (
          full_name,
          email,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  } catch (error) {
    return [];
  }
}

export async function createProfileRequest(formData) {
  const supabase = await createSupabaseServer();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const requestedChanges = {
      full_name: formData.get("full_name"),
      avatar_url: formData.get("avatar_url"),
    };

    const { error } = await supabase
      .from("profile_change_requests")
      .insert({
        user_id: user.id,
        requested_changes: requestedChanges,
        current_data: currentProfile,
      });

    if (error) throw error;
    revalidatePath("/profile");
  } catch (error) {
    throw new Error("Profile requests feature not available yet");
  }
}

export async function reviewProfileRequest(formData) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const requestId = formData.get("requestId");
  const action = formData.get("action");
  const adminNotes = formData.get("adminNotes");

  if (action === "approve") {
    const { data: request } = await supabase
      .from("profile_change_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (request) {
      await supabase
        .from("profiles")
        .update(request.requested_changes)
        .eq("id", request.user_id);
    }
  }

  await supabase
    .from("profile_change_requests")
    .update({
      status: action === "approve" ? "approved" : "rejected",
      admin_notes: adminNotes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  revalidatePath("/admin");
}

export async function deleteUser(userId) {
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

  // Delete user profile (cascades to tasks and other references)
  await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  revalidatePath("/admin");
}