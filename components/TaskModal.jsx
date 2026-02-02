"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import PriorityBadge from "./PriorityBadge";
import { updateTask } from "@/lib/tasks";

export default function TaskModal({ task, users, isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task?.title || "",
    priority: task?.priority || "medium",
    due_date: task?.due_date || "",
    assigned_to: task?.assigned_to || ""
  });

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(editData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("taskId", task.id);
    
    await updateTask(formData);
    setIsEditing(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: 12,
        padding: 32,
        maxWidth: 600,
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#2d3748" }}>
            Task Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#a0aec0"
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Title */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6 }}>
              TITLE
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
            ) : (
              <div style={{ fontSize: 16, fontWeight: 500, color: "#2d3748" }}>
                {task.title}
              </div>
            )}
          </div>

          {/* Priority & Due Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6 }}>
                PRIORITY
              </label>
              {isEditing ? (
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <PriorityBadge level={task.priority} />
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6 }}>
                DUE DATE
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.due_date}
                  onChange={(e) => setEditData({...editData, due_date: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              ) : (
                <div style={{ fontSize: 14, color: "#4a5568" }}>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                </div>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6 }}>
              ASSIGNED TO
            </label>
            {isEditing ? (
              <select
                value={editData.assigned_to}
                onChange={(e) => setEditData({...editData, assigned_to: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  fontSize: 14
                }}
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.full_name}</option>
                ))}
              </select>
            ) : (
              task.profiles ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar src={task.profiles.avatar_url} size={24} />
                  <span style={{ fontSize: 14, color: "#2d3748" }}>
                    {task.profiles.full_name}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "#a0aec0" }}>Unassigned</div>
              )
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e2e8f0",
                    background: "white",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "8px 16px",
                    background: "#3182ce",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "8px 16px",
                  background: "#3182ce",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}