"use client";

import { useState } from "react";
import { deleteAllTasks } from "@/lib/deleteAllTasks";

export default function DeleteAllTasks({ taskCount }) {
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (confirmText !== "DELETE") return;
    
    setDeleting(true);
    try {
      await deleteAllTasks();
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete tasks: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (taskCount === 0) return null;

  return (
    <>
      <div style={styles.container}>
        <h3 style={styles.title}>🗑️ Danger Zone</h3>
        <div style={styles.content}>
          <div style={styles.warning}>
            <p style={styles.warningText}>
              Delete all {taskCount} tasks permanently. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={styles.deleteButton}
          >
            Delete All Tasks
          </button>
        </div>
      </div>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Delete All Tasks</h3>
            <p style={styles.modalText}>
              You are about to permanently delete <strong>{taskCount} tasks</strong>. This action cannot be undone.
            </p>
            <p style={styles.modalSubtext}>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              style={styles.input}
              placeholder="Type DELETE here"
              autoFocus
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmText("");
                }}
                style={styles.cancelButton}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={confirmText !== "DELETE" || deleting}
                style={{
                  ...styles.confirmButton,
                  opacity: confirmText !== "DELETE" || deleting ? 0.5 : 1,
                  cursor: confirmText !== "DELETE" || deleting ? "not-allowed" : "pointer"
                }}
              >
                {deleting ? "Deleting..." : "Delete All Tasks"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#dc2626',
    marginBottom: 16,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  warning: {
    flex: 1,
  },
  warningText: {
    fontSize: 14,
    color: '#7f1d1d',
    margin: 0,
  },
  deleteButton: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#dc2626',
    marginBottom: 12,
    margin: 0,
  },
  modalText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  modalSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    marginBottom: 20,
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
  confirmButton: {
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
};