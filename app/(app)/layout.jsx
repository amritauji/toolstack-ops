import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import AppLayoutClient from "./AppLayoutClient";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }) {
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  // Fetch user profile for navbar
  let { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, avatar_url, role")
    .eq("id", data.user.id)
    .single();

  // If profile doesn't exist, create a basic one
  if (!profile) {
    const userData = data.user.user_metadata || {};
    await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: userData.full_name || 'User',
        username: userData.username || data.user.email?.split('@')[0] || 'user',
        role: 'user'
      });
    
    // Fetch the newly created profile
    const { data: newProfile } = await supabase
      .from("profiles")
      .select("id, full_name, username, email, avatar_url, role")
      .eq("id", data.user.id)
      .single();
    
    profile = newProfile;
  }

  return (
    <div>
      <Navbar profile={profile} />
      <AppLayoutClient>{children}</AppLayoutClient>
    </div>
  );
}