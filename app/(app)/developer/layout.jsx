import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function DeveloperLayout({ children }) {
  try {
    const supabase = await createSupabaseServer();
    const { data, error: authError } = await supabase.auth.getUser();

    if (authError || !data.user) {
      redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    // Security: Explicitly check for null/undefined profile
    if (!profile || profileError || profile.role !== "developer") {
      redirect("/dashboard");
    }

    return <>{children}</>;
  } catch (error) {
    console.error('Developer layout error:', error);
    redirect("/login");
  }
}
