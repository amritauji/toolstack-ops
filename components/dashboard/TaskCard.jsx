import React from 'react';

function TaskCard({ task, moveTask, currentStatus }) {
  return (
    <div className="bg-gray-50 rounded p-3 mb-3">
      <p className="text-sm font-medium mb-1">{task.title}</p>
      
      <div className="flex gap-2 mt-2">
        {currentStatus !== "todo" && (
          <button 
            onClick={() => moveTask(task.id, "todo")}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            ← To Do
          </button>
        )}
        {currentStatus !== "in_progress" && (
          <button 
            onClick={() => moveTask(task.id, "in_progress")}
            className="text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded"
          >
            ⏳ In Progress
          </button>
        )}
        {currentStatus !== "done" && (
          <button 
            onClick={() => moveTask(task.id, "done")}
            className="text-xs bg-green-200 hover:bg-green-300 px-2 py-1 rounded"
          >
            ✓ Done
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(TaskCard);