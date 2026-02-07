"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role, last_login, created_at")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function deleteUserAsDeveloper(userId) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: devProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (devProfile?.role !== "developer") {
    throw new Error("Unauthorized");
  }

  const supabaseAdmin = createSupabaseAdmin();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  
  if (error) throw error;

  revalidatePath("/developer");
}

export async function updateUserRole(userId, newRole) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: devProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (devProfile?.role !== "developer") {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) throw error;

  revalidatePath("/developer");
}

export async function createUser(formData) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: devProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (devProfile?.role !== "developer") {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("full_name");
  const username = formData.get("username");
  const role = formData.get("role") || "user";

  const supabaseAdmin = createSupabaseAdmin();
  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      username: username,
    }
  });

  if (error) throw error;

  if (role !== "user") {
    await supabase
      .from("profiles")
      .update({ role })
      .eq("id", newUser.user.id);
  }

  revalidatePath("/developer");
  return newUser;
}
