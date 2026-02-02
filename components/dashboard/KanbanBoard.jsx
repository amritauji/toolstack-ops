"use client";

import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ tasks, setTasks }) {
  return (
    <div className="grid grid-cols-3 gap-6 px-6">
      <KanbanColumn title="To Do" status="todo" tasks={tasks} setTasks={setTasks} />
      <KanbanColumn title="In Progress" status="in_progress" tasks={tasks} setTasks={setTasks} />
      <KanbanColumn title="Done" status="done" tasks={tasks} setTasks={setTasks} />
    </div>
  );
}