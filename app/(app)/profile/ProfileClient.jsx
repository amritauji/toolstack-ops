"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/profile";
import Avatar from "@/components/Avatar";
import UsageDashboard from '@/components/UsageDashboard';

export default function ProfileClient({ profile, usage }) {
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 102400) {
      alert("Image must be less than 100KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target);
      await updateProfile(formData);
      setEditing(false);
      setAvatarPreview(null);
      window.location.reload();
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>My Profile</h1>

      <div style={{ background: "white", borderRadius: 8, padding: 24, border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar src={avatarPreview || profile?.avatar_url} size={80} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{profile?.full_name}</h2>
            <p style={{ color: "#6b7280", marginBottom: 4 }}>{profile?.email}</p>
            <span style={{ 
              background: profile?.role === "developer" ? "#f3e8ff" : profile?.role === "admin" ? "#dbeafe" : "#f3f4f6",
              color: profile?.role === "developer" ? "#6b21a8" : profile?.role === "admin" ? "#1e40af" : "#374151",
              padding: "3px 8px", 
              borderRadius: 4, 
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase"
            }}>
              {profile?.role}
            </span>
          </div>
        </div>

        {!editing && (
          <button 
            onClick={() => setEditing(true)}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Edit Profile
          </button>
        )}

        {editing && (
          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                Profile Picture
              </label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
              <span style={{ fontSize: 12, color: "#6b7280" }}>Max 100KB</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                defaultValue={profile?.full_name}
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

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? "#9ca3af" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 500
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setAvatarPreview(null);
                }}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Usage Dashboard */}
      <div style={{ marginTop: 24 }}>
        <UsageDashboard usage={usage} plan={profile?.plan || 'free'} />
      </div>
    </div>
  );
}