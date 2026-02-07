import { getTaskMetrics, getTeamMetrics, getActivityTimeline, getRecentActivity } from '@/lib/analytics';
import { getAssignableUsers } from '@/lib/users';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AdminDashboard from '@/components/AdminDashboard';

export const metadata = {
  title: 'Admin - ToolStack Ops',
  description: 'Analytics and user management',
};

export default async function AnalyticsPage() {
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

  const [taskMetrics, teamMetrics, timeline, recentActivity, users] = await Promise.all([
    getTaskMetrics(),
    getTeamMetrics(),
    getActivityTimeline(),
    getRecentActivity(10),
    getAssignableUsers()
  ]);

  return (
    <div style={{ padding: '24px' }}>
      <DashboardHeader profile={profile} />
      <AdminDashboard
        taskMetrics={taskMetrics}
        teamMetrics={teamMetrics}
        timeline={timeline}
        recentActivity={recentActivity}
        users={users}
        currentUserRole={profile?.role}
      />
    </div>
  );
}
