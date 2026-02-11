import { createSupabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { getCurrentUsage } from '@/lib/usage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  try {
    const supabase = await createSupabaseServer();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Get usage data
    const usage = await getCurrentUsage();

    return (
      <div style={{ padding: '24px' }}>
        <DashboardHeader profile={profile} />
        <ProfileClient profile={profile} usage={usage} />
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Failed to load profile</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}