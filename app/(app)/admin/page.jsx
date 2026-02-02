import { getAdminAnalytics, getTaskDistribution } from "@/lib/adminAnalytics";
import { getTeamActivity } from "@/lib/adminTasks";
import { getTasks } from "@/lib/tasks";
import { getActivityFeed } from "@/lib/activityFeed";
import { getProfileRequests, reviewProfileRequest, deleteUser } from "@/lib/profileRequests";
import { deleteAllTasks } from "@/lib/deleteAllTasks";
import AdminExportImport from "@/components/AdminExportImport";
import UserManagement from "@/components/UserManagement";
import ProfileRequests from "@/components/ProfileRequests";
import DeleteAllTasks from "@/components/DeleteAllTasks";
import ActivityFeed from "@/components/ActivityFeed";
import Link from "next/link";

export default async function AdminPage() {
  const stats = await getAdminAnalytics();
  const distribution = await getTaskDistribution();
  const teamActivity = await getTeamActivity();
  const allTasks = await getTasks();
  const profileRequests = await getProfileRequests();
  const activities = await getActivityFeed();

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8, color: "#1f2937" }}>Admin Dashboard</h1>
        <p style={{ color: "#6b7280", marginBottom: 32 }}>System overview and user management</p>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
          <ClickableStat label="Total Tasks" value={stats.totalTasks} filter="all" />
          <ClickableStat label="In Progress" value={stats.inProgress} filter="in-progress" />
          <ClickableStat label="Completed (7d)" value={stats.completedLast7} filter="completed-7d" />
          <ClickableStat label="Overdue" value={stats.overdue} filter="overdue" danger />
          <Stat label="Active Users" value={stats.activeUsers} />
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Profile Requests */}
            <ProfileRequests requests={profileRequests} />
            
            {/* User Management */}
            <UserManagement users={teamActivity} />
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Recent Activity */}
            <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ActivityFeed items={activities} />
            </div>
            
            {/* Execution Health */}
            <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Execution Health</h2>
              <ExecutionInsights stats={stats} />
            </div>

            {/* Task Distribution */}
            <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Task Distribution</h2>
              <TaskDistributionTable distribution={distribution} />
            </div>
          </div>
        </div>

        {/* Admin Export/Import */}
        <AdminExportImport 
          stats={stats}
          distribution={distribution}
          teamActivity={teamActivity}
          allTasks={allTasks}
        />

        {/* Delete All Tasks */}
        <DeleteAllTasks taskCount={stats.totalTasks} />
      </div>
    </div>
  );
}

function ClickableStat({ label, value, filter, danger }) {
  return (
    <Link href={`/admin/tasks?filter=${filter}`} style={{ textDecoration: "none" }}>
      <div style={{ 
        background: "white", 
        borderRadius: 8, 
        border: "1px solid #e5e7eb", 
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s"
      }}>
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 600, color: danger ? "#dc2626" : "#111827" }}>
          {value ?? 0}
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, danger }) {
  return (
    <div style={{ background: "white", borderRadius: 8, border: "1px solid #e5e7eb", padding: 16 }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: danger ? "#dc2626" : "#111827" }}>
        {value ?? 0}
      </div>
    </div>
  );
}

function ExecutionInsights({ stats }) {
  const insights = [];

  if (stats.overdue > 0) {
    insights.push(`⚠️ ${stats.overdue} tasks overdue — review assignments`);
  }

  if (stats.completedLast7 > stats.inProgress) {
    insights.push(`🚀 High momentum: ${stats.completedLast7} tasks completed this week`);
  }

  if (stats.activeUsers < 3) {
    insights.push(`👤 Low team activity — only ${stats.activeUsers} users active`);
  }

  if (insights.length === 0) {
    insights.push("✅ Operations running smoothly");
  }

  return (
    <div>
      {insights.map((insight, i) => (
        <div key={i} style={{ fontSize: 14, marginBottom: 8, color: "#374151" }}>
          {insight}
        </div>
      ))}
    </div>
  );
}

function TaskDistributionTable({ distribution }) {
  return (
    <div>
      {distribution.length === 0 ? (
        <p style={{ fontSize: 14, color: "#6b7280" }}>No active tasks</p>
      ) : (
        <div>
          {distribution.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <span style={{ fontSize: 14 }}>{item.name}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: item.count > 5 ? "#dc2626" : item.count > 3 ? "#f59e0b" : "#374151",
                }}
              >
                {item.count} tasks
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamActivityTable({ users }) {
  const getActivityStatus = (lastLogin) => {
    if (!lastLogin) return { emoji: "🔴", label: "Never" };
    
    const daysSince = Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return { emoji: "🟢", label: "Active" };
    if (daysSince <= 14) return { emoji: "🟡", label: "Inactive" };
    return { emoji: "🔴", label: "Inactive" };
  };

  return (
    <div>
      {users.length === 0 ? (
        <p style={{ fontSize: 14, color: "#6b7280" }}>No users found</p>
      ) : (
        <div>
          {users.map((user, i) => {
            const status = getActivityStatus(user.last_login);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{user.full_name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{user.role}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12 }}>{status.emoji} {status.label}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}