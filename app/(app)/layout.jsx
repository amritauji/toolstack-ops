import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import AppLayoutClient from "./AppLayoutClient";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";

export default async function AppLayout({ children }) {
  try {
    const supabase = await createSupabaseServer();
    const { data, error: authError } = await supabase.auth.getUser();

    if (authError || !data.user) {
      redirect("/login");
    }

    // Fetch user profile for navbar
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, username, email, avatar_url, role")
      .eq("id", data.user.id)
      .single();

    // If profile doesn't exist, create a basic one
    if (!profile || profileError) {
      const userData = data.user.user_metadata || {};
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name || 'User',
          username: userData.username || data.user.email?.split('@')[0] || 'user',
          role: 'user'
        });
      
      if (insertError) {
        console.error('Profile creation failed:', insertError);
      }
      
      // Fetch the newly created profile
      const { data: newProfile } = await supabase
        .from("profiles")
        .select("id, full_name, username, email, avatar_url, role")
        .eq("id", data.user.id)
        .single();
      
      profile = newProfile;
    }

    return (
      <ErrorBoundary>
        <div data-barba-namespace="dashboard">
          <Navbar profile={profile} />
          <AppLayoutClient>{children}</AppLayoutClient>
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Layout error:', error);
    redirect("/login");
  }
}