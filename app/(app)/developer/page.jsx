import { getAllUsers } from "@/lib/developer";
import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DeveloperDashboard from "./DeveloperDashboard";

export default async function DeveloperPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const users = await getAllUsers();

  if (!profile) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Profile not found</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <DashboardHeader profile={profile} />
      <DeveloperDashboard users={users} />
    </div>
  );
}