"use client";

import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { changeTaskStatus } from "./actions";
import Avatar from "@/components/Avatar";
import PriorityBadge from "@/components/PriorityBadge";
import DueDate from "@/components/DueDate";
import TaskPreview from "@/components/TaskPreview";
import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import toast from 'react-hot-toast';

const columnStyles = {
  todo: { border: "#e2e8f0", bg: "#f7fafc" },
  in_progress: { border: "#fed7aa", bg: "#fffbeb" },
  done: { border: "#bbf7d0", bg: "#f0fff4" }
};

export default function KanbanColumn({ title, tasks, users, status, selectedTasks, onSelectionChange, onTaskClick, emptyState }) {
  const styles = columnStyles[status] || columnStyles.todo;
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div 
      ref={setNodeRef}
      style={{
      background: styles.bg,
      borderRadius: 8,
      padding: 16,
      minHeight: 500,
      border: `1px solid ${styles.border}`
    }}>
      {/* Column Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: `1px solid ${styles.border}`
      }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#2d3748",
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          {title}
        </h2>
        <div style={{
          background: "#4a5568",
          color: "white",
          fontSize: 12,
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: 4,
          minWidth: 20,
          textAlign: "center"
        }}>
          {tasks.length}
        </div>
      </div>

      {/* Tasks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tasks.length === 0 ? (
          emptyState || (
            <div style={{
              textAlign: "center",
              padding: 32,
              color: "#a0aec0",
              fontSize: 14
            }}>
              No tasks
            </div>
          )
        ) : (
          tasks.map(task => (
            <TaskPreview key={task.id} task={task}>
              <TaskCard
                task={task}
                users={users}
                selectedTasks={selectedTasks}
                onSelectionChange={onSelectionChange}
                onTaskClick={onTaskClick}
              />
            </TaskPreview>
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, users, selectedTasks, onSelectionChange, onTaskClick }) {
  const isSelected = selectedTasks.includes(task.id);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : {};

  const handleCheckboxChange = () => {
    if (isSelected) {
      onSelectionChange(selectedTasks.filter(id => id !== task.id));
    } else {
      onSelectionChange([...selectedTasks, task.id]);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
      background: "white",
      borderRadius: 6,
      padding: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: isSelected ? "2px solid #3182ce" : "1px solid #e2e8f0",
      cursor: "pointer"
    }}>
      {/* Checkbox */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: 2 }}
        />
        <div style={{ flex: 1 }} onClick={() => onTaskClick(task)}>
          {/* Task Title */}
          <h3 style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#2d3748",
            marginBottom: 12,
            lineHeight: 1.4
          }}>
            {task.title}
          </h3>
        </div>
      </div>

      {/* Priority & Due Date */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <PriorityBadge level={task.priority || "medium"} />
        <DueDate date={task.due_date} />
      </div>

      {/* Assignee */}
      {task.profiles && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          padding: 8,
          background: "#f7fafc",
          borderRadius: 4,
          border: "1px solid #e2e8f0"
        }}>
          <Avatar src={task.profiles.avatar_url} size={20} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "#4a5568" }}>
            {task.profiles.full_name}
          </span>
        </div>
      )}

      {/* Status Update */}
      <form action={changeTaskStatus} onClick={(e) => e.stopPropagation()}>
        <input type="hidden" name="taskId" value={task.id} />
        <div style={{ display: "flex", gap: 8 }}>
          <select
            name="status"
            defaultValue={task.status}
            style={{
              flex: 1,
              fontSize: 12,
              padding: 6,
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#4a5568"
            }}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button
            type="submit"
            style={{
              fontSize: 12,
              padding: "6px 12px",
              background: "#3182ce",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}