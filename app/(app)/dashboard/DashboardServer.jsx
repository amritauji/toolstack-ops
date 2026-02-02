import { getTasks } from "@/lib/tasks";
import { getAssignableUsers } from "@/lib/users";
import { getActivityFeed } from "@/lib/activityFeed";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const tasks = await getTasks();
  const users = await getAssignableUsers();
  const activities = await getActivityFeed();

  return (
    <DashboardClient 
      initialTasks={tasks}
      users={users}
      activities={activities}
    />
  );
}