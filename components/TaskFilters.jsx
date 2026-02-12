"use client";

import { useState } from "react";

export default function TaskFilters({ users, onFilter }) {
  const [filters, setFilters] = useState({
    search: "",
    assignee: "",
    priority: "",
    status: ""
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div style={{
      background: "white",
      borderRadius: 8,
      padding: 16,
      border: "1px solid #e2e8f0",
      marginBottom: 24
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16 }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            fontSize: 14,
            color: "#0f172a",
            background: "white"
          }}
        />

        {/* Assignee Filter */}
        <select
          value={filters.assignee}
          onChange={(e) => handleFilterChange("assignee", e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            fontSize: 14,
            color: "#0f172a",
            background: "white"
          }}
        >
          <option value="">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.full_name}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            fontSize: 14,
            color: "#0f172a",
            background: "white"
          }}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            fontSize: 14,
            color: "#0f172a",
            background: "white"
          }}
        >
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}