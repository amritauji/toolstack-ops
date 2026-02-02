"use client";

export default function TasksPage() {
  return (
    <div style={wrapper}>
      {/* Header */}
      <div style={header}>
        <h1 style={title}>Tasks</h1>
        <button style={createBtn}>+ Create Task</button>
      </div>

      {/* Filters */}
      <div style={filters}>
        <button style={filterBtn}>All</button>
        <button style={filterBtn}>My Tasks</button>
        <button style={filterBtn}>Unassigned</button>
      </div>

      {/* Kanban Board */}
      <div style={kanban}>
        <Column title="To Do" />
        <Column title="In Progress" />
        <Column title="Done" />
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function Column({ title }) {
  return (
    <div style={column}>
      <h3 style={columnTitle}>{title}</h3>

      <div style={taskPlaceholder}>
        No tasks yet
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const wrapper = {
  padding: 24,
  fontFamily: "system-ui, sans-serif",
  background: "#f8fafc",
  minHeight: "calc(100vh - 64px)"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24
};

const title = {
  fontSize: 28,
  fontWeight: 700
};

const createBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer"
};

const filters = {
  display: "flex",
  gap: 12,
  marginBottom: 24
};

const filterBtn = {
  padding: "8px 14px",
  border: "1px solid #e5e7eb",
  background: "white",
  borderRadius: 20,
  cursor: "pointer"
};

const kanban = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16
};

const column = {
  background: "white",
  borderRadius: 12,
  padding: 16,
  minHeight: 320,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
};

const columnTitle = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12
};

const taskPlaceholder = {
  fontSize: 14,
  color: "#94a3b8"
};