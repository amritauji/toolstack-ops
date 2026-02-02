"use client";

import { useState } from "react";
import { createProfileRequest } from "@/lib/profileRequests";
import Avatar from "@/components/Avatar";

export default function ProfileClient({ profile, requests }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    avatar_url: profile?.avatar_url || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.set("full_name", formData.full_name);
    form.set("avatar_url", formData.avatar_url);
    
    await createProfileRequest(form);
    setEditing(false);
    window.location.reload();
  };

  const pendingRequest = requests.find(r => r.status === "pending");

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>My Profile</h1>

      {/* Current Profile */}
      <div style={{ background: "white", borderRadius: 8, padding: 24, marginBottom: 24, border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar src={profile?.avatar_url} size={80} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{profile?.full_name}</h2>
            <p style={{ color: "#6b7280", marginBottom: 4 }}>{profile?.email}</p>
            <span style={{ 
              background: "#f3f4f6", 
              color: "#374151", 
              padding: "2px 8px", 
              borderRadius: 4, 
              fontSize: 12,
              fontWeight: 500
            }}>
              {profile?.role}
            </span>
          </div>
        </div>

        {!editing && !pendingRequest && (
          <button 
            onClick={() => setEditing(true)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer"
            }}
          >
            Request Profile Update
          </button>
        )}

        {pendingRequest && (
          <div style={{ 
            background: "#fef3c7", 
            border: "1px solid #f59e0b", 
            borderRadius: 6, 
            padding: 12,
            marginTop: 16
          }}>
            <p style={{ color: "#92400e", fontSize: 14, fontWeight: 500 }}>
              ⏳ Profile update request pending admin approval
            </p>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editing && (
        <div style={{ background: "white", borderRadius: 8, padding: 24, marginBottom: 24, border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Request Profile Changes</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14
                }}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: "pointer"
                }}
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request History */}
      {requests.length > 0 && (
        <div style={{ background: "white", borderRadius: 8, padding: 24, border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Request History</h3>
          {requests.map(request => (
            <div key={request.id} style={{ 
              borderBottom: "1px solid #f3f4f6", 
              paddingBottom: 12, 
              marginBottom: 12 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ 
                  fontSize: 12, 
                  color: request.status === "approved" ? "#10b981" : request.status === "rejected" ? "#ef4444" : "#f59e0b",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {request.status}
                </span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {new Date(request.created_at).toLocaleDateString()}
                </span>
              </div>
              {request.admin_notes && (
                <p style={{ fontSize: 14, color: "#374151", fontStyle: "italic" }}>
                  Admin: {request.admin_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}