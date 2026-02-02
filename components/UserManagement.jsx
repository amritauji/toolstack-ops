"use client";

import { deleteUser } from "@/lib/profileRequests";
import Avatar from "@/components/Avatar";

export default function UserManagement({ users }) {
  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to delete ${userName}'s account? This action cannot be undone.`)) {
      await deleteUser(userId);
      window.location.reload();
    }
  };

  const getActivityStatus = (lastLogin) => {
    if (!lastLogin) return { emoji: "🔴", label: "Never", color: "#ef4444" };
    
    const daysSince = Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return { emoji: "🟢", label: "Active", color: "#10b981" };
    if (daysSince <= 14) return { emoji: "🟡", label: "Recent", color: "#f59e0b" };
    return { emoji: "🔴", label: "Inactive", color: "#ef4444" };
  };

  return (
    <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        👥 User Management
        <span style={{ 
          background: "#e5e7eb", 
          color: "#374151", 
          fontSize: 12, 
          padding: "2px 8px", 
          borderRadius: 12,
          fontWeight: 500
        }}>
          {users.length} users
        </span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.map(user => {
          const status = getActivityStatus(user.last_login);
          return (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: "#fafbfc"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar src={user.avatar_url} size={40} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                    {user.full_name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>
                    {user.email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ 
                      background: user.role === "admin" ? "#dbeafe" : "#f3f4f6",
                      color: user.role === "admin" ? "#1e40af" : "#374151",
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 500,
                      textTransform: "uppercase"
                    }}>
                      {user.role}
                    </span>
                    <span style={{ 
                      fontSize: 11, 
                      color: status.color,
                      fontWeight: 500
                    }}>
                      {status.emoji} {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
                    Tasks: {user.task_count || 0}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    Last: {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                  </div>
                </div>
                
                {user.role !== "admin" && (
                  <button
                    onClick={() => handleDeleteUser(user.id, user.full_name)}
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: 4,
                      padding: "4px 8px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                    title="Delete user account"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}