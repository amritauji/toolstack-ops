import { getTasks } from "@/lib/tasks";
import { getAssignableUsers } from "@/lib/users";
import { getActivityFeed } from "@/lib/activityFeed";
import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const tasks = await getTasks();
  const users = await getAssignableUsers();
  const activities = await getActivityFeed();

  return (
    <div style={{ padding: '24px' }}>
      <DashboardHeader profile={profile} />
      <DashboardClient 
        initialTasks={tasks}
        users={users}
        activities={activities}
        currentUser={profile}
      />
    </div>
  );
}