import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let requests = [];
  try {
    const { data } = await supabase
      .from("profile_change_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    requests = data || [];
  } catch (error) {
    // Table doesn't exist yet
  }

  return <ProfileClient profile={profile} requests={requests} />;
}