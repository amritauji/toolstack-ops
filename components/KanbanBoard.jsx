"use client";

import { useState } from "react";
import { Card, CardBody, Button, Chip, Avatar, Progress } from "@nextui-org/react";

const KanbanBoard = ({ tasks = [], onTaskUpdate, onTaskCreate }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "default" },
    { id: "in-progress", title: "In Progress", color: "primary" },
    { id: "review", title: "Review", color: "warning" },
    { id: "done", title: "Done", color: "success" }
  ];

  const mockTasks = [
    { id: 1, title: "Design homepage mockup", status: "todo", priority: "high", assignee: "John Doe", dueDate: "2024-01-20", project: "Website" },
    { id: 2, title: "Setup CI/CD pipeline", status: "in-progress", priority: "medium", assignee: "Jane Smith", dueDate: "2024-01-22", project: "DevOps" },
    { id: 3, title: "Content review", status: "review", priority: "low", assignee: "Mike Johnson", dueDate: "2024-01-25", project: "Marketing" },
    { id: 4, title: "Deploy to production", status: "done", priority: "high", assignee: "Sarah Wilson", dueDate: "2024-01-18", project: "Website" }
  ];

  const allTasks = tasks.length > 0 ? tasks : mockTasks;

  const getTasksByStatus = (status) => {
    return allTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTask = { ...draggedTask, status: newStatus };
      onTaskUpdate?.(updatedTask);
      console.log(`Task "${draggedTask.title}" moved to ${newStatus}`);
    }
    setDraggedTask(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <Button color="primary" onPress={() => onTaskCreate?.()}>
          + Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-gray-50 rounded-lg p-4 min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">{column.title}</h3>
              <Chip size="sm" color={column.color} variant="flat">
                {getTasksByStatus(column.id).length}
              </Chip>
            </div>

            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Chip size="sm" color={getPriorityColor(task.priority)} variant="dot">
                        {task.priority}
                      </Chip>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded">{task.project}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <Avatar size="sm" name={task.assignee?.charAt(0)} />
                      <span className="text-xs text-gray-500">{task.dueDate}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;