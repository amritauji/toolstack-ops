"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { uploadAvatar } from "@/lib/uploadAvatar";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const fullName = formData.get("full_name");
  const avatarFile = formData.get("avatar");

  let avatarUrl = null;
  if (avatarFile && avatarFile.size > 0) {
    avatarUrl = await uploadAvatar(avatarFile, user.id);
  }

  const updates = { full_name: fullName };
  if (avatarUrl) updates.avatar_url = avatarUrl;

  // Developer can update directly
  if (profile?.role === "developer") {
    await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    
    revalidatePath("/profile");
    return { success: true };
  }

  // Admin can update directly
  if (profile?.role === "admin") {
    await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    
    revalidatePath("/profile");
    return { success: true };
  }

  // Regular user can update directly
  await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);
  
  revalidatePath("/profile");
  return { success: true };
}
