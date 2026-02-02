"use client";

import { useState, useEffect } from "react";
import { getTaskComments, createComment, deleteComment } from "@/lib/comments";
import Avatar from "@/components/Avatar";
import { useRealtimeSubscription } from "@/lib/useRealtime";

export default function TaskComments({ taskId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [taskId]);

  // Real-time updates
  useRealtimeSubscription('task_comments', (payload) => {
    if (payload.new?.task_id === taskId || payload.old?.task_id === taskId) {
      loadComments();
    }
  });

  const loadComments = async () => {
    try {
      const data = await getTaskComments(taskId);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(taskId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (loading) return <div style={{ padding: 16, color: "#6b7280" }}>Loading comments...</div>;

  return (
    <div style={{ padding: 16, borderTop: "1px solid #e5e7eb" }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#374151" }}>
        Comments ({comments.length})
      </h4>

      {/* Comments List */}
      <div style={{ marginBottom: 16, maxHeight: 200, overflowY: "auto" }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                padding: 8,
                background: "#f9fafb",
                borderRadius: 6
              }}
            >
              <Avatar src={comment.profiles?.avatar_url} size={24} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>
                    {comment.profiles?.full_name}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  {comment.profiles?.id === currentUserId && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        fontSize: 11,
                        color: "#dc2626",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: "auto"
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.4 }}>
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{
            width: "100%",
            minHeight: 60,
            padding: 8,
            border: "1px solid #d1d5db",
            borderRadius: 4,
            fontSize: 12,
            resize: "vertical",
            marginBottom: 8
          }}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          style={{
            background: submitting ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "6px 12px",
            fontSize: 12,
            cursor: submitting ? "not-allowed" : "pointer",
            fontWeight: 500
          }}
        >
          {submitting ? "Adding..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}