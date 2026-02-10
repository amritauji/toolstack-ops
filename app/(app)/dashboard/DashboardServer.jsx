import { getTasks } from "@/lib/tasks";
import { getAssignableUsers } from "@/lib/users";
import { getActivityFeed } from "@/lib/activityFeed";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  try {
    const [tasks, users, activities] = await Promise.all([
      getTasks(),
      getAssignableUsers(),
      getActivityFeed()
    ]);

    return (
      <DashboardClient 
        initialTasks={tasks || []}
        users={users || []}
        activities={activities || []}
      />
    );
  } catch (error) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>Failed to load dashboard</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}