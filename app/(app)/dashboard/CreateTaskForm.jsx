"use client";

import { useState } from 'react';
import { createTask } from "@/lib/tasks";
import { checkActionAllowed } from '@/lib/usage';
import UpgradeModal from '@/components/UpgradeModal';

export default function CreateTaskForm({ users, currentPlan = 'free' }) {
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, reason: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user can create task
    const check = await checkActionAllowed('add_task');
    if (!check.allowed) {
      setUpgradeModal({ isOpen: true, reason: 'task_limit' });
      return;
    }

    // Proceed with task creation
    const formData = new FormData(e.target);
    await createTask(formData);
    e.target.reset();
  };
  return (
    <>
    <div style={{
      background: "white",
      borderRadius: 8,
      padding: 20,
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
          {/* Task Title */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Task Title
            </label>
            <input
              name="title"
              placeholder="Enter task description..."
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "white",
                color: "#2d3748",
                outline: "none"
              }}
            />
          </div>

          {/* Assign To */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Assign To
            </label>
            <select
              name="assigned_to"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "white",
                color: "#2d3748",
                outline: "none"
              }}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Priority
            </label>
            <select
              name="priority"
              defaultValue="medium"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "white",
                color: "#2d3748",
                outline: "none"
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#4a5568", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Due Date
            </label>
            <input
              name="due_date"
              type="date"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: 14,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "white",
                color: "#2d3748",
                outline: "none"
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 500,
              background: "#3182ce",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
    <UpgradeModal 
      isOpen={upgradeModal.isOpen}
      onClose={() => setUpgradeModal({ isOpen: false, reason: '' })}
      reason={upgradeModal.reason}
      currentPlan={currentPlan}
    />
    </>
  );
}