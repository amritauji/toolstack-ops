import { getFilteredTasks } from "@/lib/adminTasks";
import Link from "next/link";

export default async function AdminTasksPage({ searchParams }) {
  const params = await searchParams;
  const filter = params?.filter || "all";
  const tasks = await getFilteredTasks(filter);

  const filterLabels = {
    all: "All Tasks",
    "in-progress": "In Progress Tasks",
    "completed-7d": "Completed (Last 7 Days)",
    overdue: "Overdue Tasks",
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/admin" style={{ fontSize: 14, color: "#6b7280" }}>
          ← Back to Admin
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>
          {filterLabels[filter]} ({tasks.length})
        </h1>
      </div>

      <div style={{ background: "white", borderRadius: 8, overflow: "hidden" }}>
        {tasks.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
            No tasks found for this filter
          </div>
        ) : (
          <div>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: 16,
                padding: 16,
                background: "#f9fafb",
                fontSize: 12,
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
              }}
            >
              <div>Task</div>
              <div>Status</div>
              <div>Assigned To</div>
              <div>Due Date</div>
            </div>

            {/* Rows */}
            {tasks.map(task => (
              <div
                key={task.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: 16,
                  padding: 16,
                  borderBottom: "1px solid #f3f4f6",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: 500 }}>{task.title}</div>
                <div>
                  <StatusBadge status={task.status} />
                </div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {task.profiles?.full_name || "Unassigned"}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280" }}>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    todo: "#6b7280",
    in_progress: "#f59e0b",
    done: "#10b981",
  };

  return (
    <span
      style={{
        fontSize: 12,
        padding: "2px 8px",
        borderRadius: 999,
        backgroundColor: colors[status] + "20",
        color: colors[status],
        textTransform: "capitalize",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}