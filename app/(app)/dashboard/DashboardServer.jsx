import { getTasks } from "@/lib/tasks";
import { getAssignableUsers } from "@/lib/users";
import { getActivityFeed } from "@/lib/activityFeed";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const [tasks, users, activities] = await Promise.all([
    getTasks().catch(() => []),
    getAssignableUsers().catch(() => []),
    getActivityFeed().catch(() => [])
  ]);

  return (
    <DashboardClient 
      initialTasks={tasks || []}
      users={users || []}
      activities={activities || []}
    />
  );
}