"use client";

import { useState } from "react";
import { bulkUpdateTasks } from "@/lib/tasks";

export default function BulkOperations({ tasks, users, selectedTasks, onSelectionChange }) {
  const [bulkAction, setBulkAction] = useState("");
  const [bulkValue, setBulkValue] = useState("");

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(tasks.map(t => t.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedTasks.length === 0) return;

    const formData = new FormData();
    formData.append("taskIds", JSON.stringify(selectedTasks));
    formData.append("action", bulkAction);
    formData.append("value", bulkValue);

    await bulkUpdateTasks(formData);
    onSelectionChange([]);
    setBulkAction("");
    setBulkValue("");
  };

  if (tasks.length === 0) return null;

  return (
    <div style={{
      background: "white",
      borderRadius: 8,
      padding: 16,
      border: "1px solid #e2e8f0",
      marginBottom: 16
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Select All */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: '#0f172a' }}>
          <input
            type="checkbox"
            checked={selectedTasks.length === tasks.length && tasks.length > 0}
            onChange={handleSelectAll}
          />
          Select All ({selectedTasks.length} selected)
        </label>

        {selectedTasks.length > 0 && (
          <>
            {/* Bulk Action */}
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              style={{
                padding: "6px 10px",
                border: "1px solid #e2e8f0",
                borderRadius: 4,
                fontSize: 14,
                color: "#0f172a",
                background: "white"
              }}
            >
              <option value="">Choose Action</option>
              <option value="status">Change Status</option>
              <option value="priority">Change Priority</option>
              <option value="assignee">Change Assignee</option>
            </select>

            {/* Bulk Value */}
            {bulkAction === "status" && (
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#0f172a",
                  background: "white"
                }}
              >
                <option value="">Select Status</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            )}

            {bulkAction === "priority" && (
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#0f172a",
                  background: "white"
                }}
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            )}

            {bulkAction === "assignee" && (
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#0f172a",
                  background: "white"
                }}
              >
                <option value="">Select Assignee</option>
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.full_name}</option>
                ))}
              </select>
            )}

            {/* Apply Button */}
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || !bulkValue}
              style={{
                padding: "6px 12px",
                background: bulkAction && bulkValue ? "#3182ce" : "#e2e8f0",
                color: bulkAction && bulkValue ? "white" : "#a0aec0",
                border: "none",
                borderRadius: 4,
                cursor: bulkAction && bulkValue ? "pointer" : "not-allowed",
                fontSize: 14
              }}
            >
              Apply to {selectedTasks.length} tasks
            </button>
          </>
        )}
      </div>
    </div>
  );
}