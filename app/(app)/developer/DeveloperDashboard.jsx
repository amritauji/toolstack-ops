"use client";

import { useState } from "react";
import { deleteUserAsDeveloper, updateUserRole, createUser } from "@/lib/developer";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import toast from 'react-hot-toast';

export default function DeveloperDashboard({ users }) {
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showRoleChange, setShowRoleChange] = useState(null);

  const handleDeleteUser = async (userId, userName) => {
    try {
      await deleteUserAsDeveloper(userId);
      toast.success(`${userName} deleted successfully`);
      window.location.reload();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete user: " + error.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      setShowRoleChange(null);
      window.location.reload();
    } catch (error) {
      console.error('Role change error:', error);
      toast.error("Failed to update role: " + error.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await createUser(formData);
      toast.success('User created successfully');
      setShowCreateModal(false);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create user: " + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  const stats = {
    total: users.length,
    developers: users.filter(u => u.role === "developer").length,
    admins: users.filter(u => u.role === "admin").length,
    users: users.filter(u => u.role === "user").length,
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#1f2937", marginBottom: 8 }}>
            🔧 Developer Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>System-wide user management and administration</p>
        </div>

        <div className="developer-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Total Users</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#1f2937" }}>{stats.total}</div>
          </div>
          <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Developers</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#8b5cf6" }}>{stats.developers}</div>
          </div>
          <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Admins</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#3b82f6" }}>{stats.admins}</div>
          </div>
          <div style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Regular Users</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#10b981" }}>{stats.users}</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 8, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600 }}>User Management</h2>
            <div className="developer-filters" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "developer", "admin", "user"].map(role => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    style={{
                      padding: "6px 12px",
                      border: filter === role ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                      borderRadius: 6,
                      background: filter === role ? "#eef2ff" : "white",
                      color: filter === role ? "#4f46e5" : "#6b7280",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      textTransform: "capitalize"
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                + Create User
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="user-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  background: "#fafbfc"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar src={user.avatar_url} size={48} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>
                      {user.email}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        background: user.role === "developer" ? "#f3e8ff" : user.role === "admin" ? "#dbeafe" : "#f3f4f6",
                        color: user.role === "developer" ? "#6b21a8" : user.role === "admin" ? "#1e40af" : "#374151",
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontWeight: 600,
                        textTransform: "uppercase"
                      }}>
                        {user.role}
                      </span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>
                        Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="user-actions" style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowRoleChange({ id: user.id, name: user.full_name, currentRole: user.role })}
                    style={{
                      background: "#eff6ff",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                  >
                    🔄 Change Role
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm({ id: user.id, name: user.full_name })}
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: 500
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <EmptyState
              icon="👥"
              title={`No ${filter} users found`}
              description={filter === "all" ? "Create your first user to get started" : `There are no users with the ${filter} role`}
              action={
                filter === "all" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 20px",
                      fontSize: 14,
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Create First User
                  </button>
                )
              }
            />
          )}
        </div>
      </div>

      {showCreateModal && (
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
            width: "100%",
            maxWidth: 500,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Create New User</h2>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Full Name</label>
                <input
                  name="full_name"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Username</label>
                <input
                  name="username"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Role</label>
                <select
                  name="role"
                  defaultValue="user"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    background: "white",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 6,
                    background: "#10b981",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
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
            width: "100%",
            maxWidth: 450,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "#dc2626" }}>⚠️ Delete User</h2>
            <p style={{ marginBottom: 24, color: "#6b7280" }}>
              Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong>?
              <br/><br/>
              This will permanently remove:
              <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                <li>User account from Supabase Auth</li>
                <li>Profile and all data</li>
                <li>All tasks and comments</li>
              </ul>
              <br/>
              <strong>This action CANNOT be undone.</strong>
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  background: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteUser(showDeleteConfirm.id, showDeleteConfirm.name);
                  setShowDeleteConfirm(null);
                }}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 6,
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoleChange && (
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
            width: "100%",
            maxWidth: 400,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Change Role</h2>
            <p style={{ marginBottom: 16, color: "#6b7280" }}>
              Change role for <strong>{showRoleChange.name}</strong>
            </p>
            <p style={{ marginBottom: 16, fontSize: 14, color: "#6b7280" }}>
              Current role: <strong style={{ textTransform: "uppercase" }}>{showRoleChange.currentRole}</strong>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {["user", "admin", "developer"].map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(showRoleChange.id, role)}
                  disabled={role === showRoleChange.currentRole}
                  style={{
                    padding: "12px 16px",
                    border: role === showRoleChange.currentRole ? "2px solid #e5e7eb" : "1px solid #e5e7eb",
                    borderRadius: 6,
                    background: role === showRoleChange.currentRole ? "#f3f4f6" : "white",
                    cursor: role === showRoleChange.currentRole ? "not-allowed" : "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    textTransform: "capitalize",
                    textAlign: "left"
                  }}
                >
                  {role} {role === showRoleChange.currentRole && "(Current)"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRoleChange(null)}
              style={{
                width: "100%",
                padding: "10px 20px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
