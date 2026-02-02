"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TaskCard from "./TaskCard";

export default function KanbanColumn({ title, status, tasks, setTasks }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showInput, setShowInput] = useState(false);
  
  const filtered = tasks.filter(t => t.status === status);

  const moveTask = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    // Persist change
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    // Rollback if failed
    if (error) {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status } : t))
      );
    }
  };

  const createTask = async (title) => {
    if (!title.trim()) return;
    
    const newTask = {
      title,
      status,
      created_at: new Date().toISOString(),
    };

    // Optimistic insert
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
    setShowInput(false);

    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select("id, title, status, assigned_to, created_at, due_date")
      .single();

    if (error) {
      setTasks(prev => prev.filter(t => t !== newTask));
    } else {
      setTasks(prev =>
        prev.map(t => (t === newTask ? data : t))
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-4 flex justify-between items-center">
        {title}
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
          {filtered.length}
        </span>
      </h3>

      {filtered.map(task => (
        <TaskCard key={task.id} task={task} moveTask={moveTask} currentStatus={status} />
      ))}
      
      {showInput ? (
        <div className="mt-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTask(newTaskTitle)}
            placeholder="Task title..."
            className="w-full p-2 border rounded mb-2 text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={() => createTask(newTaskTitle)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => { setShowInput(false); setNewTaskTitle(""); }}
              className="bg-gray-300 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-gray-400 mt-3"
        >
          + Add task
        </button>
      )}
    </div>
  );
}