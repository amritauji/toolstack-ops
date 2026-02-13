"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/profile";
import Avatar from "@/components/Avatar";
import UsageDashboard from '@/components/UsageDashboard';

export default function ProfileClient({ profile, usage }) {
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 102400) {
      alert("Image must be less than 100KB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result && typeof result === 'string' && result.startsWith('data:image/')) {
        setAvatarPreview(result);
      }
    };
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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        padding: 40,
        marginBottom: 32,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Avatar src={avatarPreview || profile?.avatar_url} size={120} />
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, margin: 0 }}>
                {profile?.full_name}
              </h1>
              <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 12, margin: 0 }}>
                {profile?.email}
              </p>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'inline-block'
              }}>
                {profile?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 32,
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'profile' ? '2px solid #667eea' : '2px solid transparent',
            color: activeTab === 'profile' ? '#667eea' : '#6b7280',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            marginBottom: -2,
            transition: 'all 0.2s'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'usage' ? '2px solid #667eea' : '2px solid transparent',
            color: activeTab === 'usage' ? '#667eea' : '#6b7280',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            marginBottom: -2,
            transition: 'all 0.2s'
          }}
        >
          Usage & Billing
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'security' ? '2px solid #667eea' : '2px solid transparent',
            color: activeTab === 'security' ? '#667eea' : '#6b7280',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
            marginBottom: -2,
            transition: 'all 0.2s'
          }}
        >
          Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#111827" }}>Personal Information</h3>

            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Edit Profile
              </button>
            )}

            {editing && (
              <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>
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
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>
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
                      background: loading ? "#9ca3af" : "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 20px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: 14
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
                      background: "#f3f4f6",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "10px 20px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Usage & Billing Tab */}
      {activeTab === 'usage' && (
        <div>
          <UsageDashboard usage={usage} plan={profile?.plan || 'free'} />
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Change Password */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#111827" }}>Change Password</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Password change coming soon!'); }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8, color: "#374151" }}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#111827" }}>Two-Factor Authentication</h3>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>Add an extra layer of security to your account</p>
            <button
              onClick={() => alert('2FA setup coming soon!')}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
            >
              Enable 2FA
            </button>
          </div>

          {/* Active Sessions */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#111827" }}>Active Sessions</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f9fafb', borderRadius: 8 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Current Session</p>
                <p style={{ fontSize: 12, color: '#6b7280' }}>Windows • Chrome • {new Date().toLocaleDateString()}</p>
              </div>
              <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}