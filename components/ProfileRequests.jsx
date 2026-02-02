"use client";

import { reviewProfileRequest } from "@/lib/profileRequests";
import Avatar from "@/components/Avatar";

export default function ProfileRequests({ requests }) {
  const pendingRequests = requests.filter(r => r.status === "pending");

  const handleReview = async (requestId, action, adminNotes = "") => {
    const form = new FormData();
    form.set("requestId", requestId);
    form.set("action", action);
    form.set("adminNotes", adminNotes);
    
    await reviewProfileRequest(form);
    window.location.reload();
  };

  return (
    <div style={{ background: "white", borderRadius: 8, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        📝 Profile Change Requests
        {pendingRequests.length > 0 && (
          <span style={{ 
            background: "#fef3c7", 
            color: "#92400e", 
            fontSize: 12, 
            padding: "2px 8px", 
            borderRadius: 12,
            fontWeight: 500
          }}>
            {pendingRequests.length} pending
          </span>
        )}
      </h2>

      {pendingRequests.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: 14, textAlign: "center", padding: 20 }}>
          No pending profile requests
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pendingRequests.map(request => (
            <RequestCard key={request.id} request={request} onReview={handleReview} />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({ request, onReview }) {
  const changes = request.requested_changes;
  const current = request.current_data;

  return (
    <div style={{ 
      border: "1px solid #e5e7eb", 
      borderRadius: 8, 
      padding: 16,
      background: "#fafbfc"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Avatar src={current.avatar_url} size={40} />
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
            {request.profiles?.full_name}
          </h4>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            {new Date(request.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        {changes.full_name !== current.full_name && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Name:</span>
            <div style={{ fontSize: 14 }}>
              <span style={{ color: "#ef4444", textDecoration: "line-through" }}>
                {current.full_name}
              </span>
              {" → "}
              <span style={{ color: "#10b981", fontWeight: 500 }}>
                {changes.full_name}
              </span>
            </div>
          </div>
        )}

        {changes.avatar_url !== current.avatar_url && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Avatar:</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <Avatar src={current.avatar_url} size={24} />
              <span>→</span>
              <Avatar src={changes.avatar_url} size={24} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onReview(request.id, "approve")}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          ✓ Approve
        </button>
        <button
          onClick={() => {
            const notes = prompt("Rejection reason (optional):");
            onReview(request.id, "reject", notes || "");
          }}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          ✗ Reject
        </button>
      </div>
    </div>
  );
}