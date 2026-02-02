"use client";

import { useState, useEffect } from "react";
import { getTaskAttachments, uploadTaskAttachment, deleteTaskAttachment } from "@/lib/attachments";
import Avatar from "@/components/Avatar";

export default function TaskAttachments({ taskId, currentUserId }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAttachments();
  }, [taskId]);

  const loadAttachments = async () => {
    try {
      const data = await getTaskAttachments(taskId);
      setAttachments(data);
    } catch (error) {
      console.error("Failed to load attachments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadTaskAttachment(taskId, file);
      await loadAttachments();
      e.target.value = "";
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm("Delete this attachment?")) return;
    
    try {
      await deleteTaskAttachment(attachmentId);
      await loadAttachments();
    } catch (error) {
      console.error("Failed to delete attachment:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) return <div style={{ padding: 16, color: "#6b7280" }}>Loading attachments...</div>;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
          Attachments ({attachments.length})
        </h4>
        
        <label style={{
          background: "#3b82f6",
          color: "white",
          padding: "6px 12px",
          borderRadius: 4,
          fontSize: 12,
          cursor: uploading ? "not-allowed" : "pointer",
          opacity: uploading ? 0.6 : 1
        }}>
          {uploading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </label>
      </div>

      {attachments.length === 0 ? (
        <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: 20 }}>
          No attachments yet. Upload files to share with your team.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "#f9fafb"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  background: "#e5e7eb",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6b7280"
                }}>
                  {attachment.file_type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 2 }}>
                    {attachment.file_name}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>
                    {formatFileSize(attachment.file_size)} • {new Date(attachment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11,
                    color: "#3b82f6",
                    textDecoration: "none",
                    padding: "4px 8px",
                    border: "1px solid #3b82f6",
                    borderRadius: 3
                  }}
                >
                  View
                </a>
                
                {attachment.profiles?.id === currentUserId && (
                  <button
                    onClick={() => handleDelete(attachment.id)}
                    style={{
                      fontSize: 11,
                      color: "#dc2626",
                      background: "none",
                      border: "1px solid #dc2626",
                      borderRadius: 3,
                      padding: "4px 8px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}