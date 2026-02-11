import { getAdminAnalytics, getTaskDistribution } from "@/lib/adminAnalytics";
import { getTeamActivity } from "@/lib/adminTasks";
import { getTasks } from "@/lib/tasks";
import { getActivityFeed } from "@/lib/activityFeed";
import { getProfileRequests } from "@/lib/profileRequests";
import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AdminDashboardNew from "./AdminDashboardNew";

export default async function AdminPage() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Check if user is admin or developer
    if (profile?.role !== 'admin' && profile?.role !== 'developer') {
      redirect('/dashboard');
    }

    const stats = await getAdminAnalytics();
    const distribution = await getTaskDistribution();
    const teamActivity = await getTeamActivity();
    const allTasks = await getTasks();
    const profileRequests = await getProfileRequests();
    const activities = await getActivityFeed();

    return (
      <div style={{ padding: '24px' }}>
        <DashboardHeader profile={profile} />
        <AdminDashboardNew 
          stats={stats}
          distribution={distribution}
          teamActivity={teamActivity}
          allTasks={allTasks}
          profileRequests={profileRequests}
          activities={activities}
        />
      </div>
    );
  } catch (error) {
    console.error('Admin page error:', error);
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Failed to load admin page</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}