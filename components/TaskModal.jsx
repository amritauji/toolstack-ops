"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  DatePicker,
  Avatar,
  Chip
} from "@nextui-org/react";
import { useState } from "react";
import TaskComments from "@/components/TaskComments";

const TaskModal = ({ isOpen, onClose, task = null, onSave }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    status: task?.status || "todo",
    assignee: task?.assignee || "",
    project: task?.project || "",
    dueDate: task?.dueDate || "",
    estimatedHours: task?.estimatedHours || ""
  });
  const [loading, setLoading] = useState(false);

  const priorities = [
    { key: "low", label: "Low", color: "success" },
    { key: "medium", label: "Medium", color: "warning" },
    { key: "high", label: "High", color: "danger" }
  ];

  const statuses = [
    { key: "todo", label: "To Do" },
    { key: "in-progress", label: "In Progress" },
    { key: "review", label: "Review" },
    { key: "done", label: "Done" }
  ];

  const projects = [
    { key: "website", label: "Website Redesign" },
    { key: "mobile", label: "Mobile App" },
    { key: "marketing", label: "Marketing Campaign" },
    { key: "devops", label: "DevOps" }
  ];

  const teamMembers = [
    { key: "john", label: "John Doe" },
    { key: "jane", label: "Jane Smith" },
    { key: "mike", label: "Mike Johnson" },
    { key: "sarah", label: "Sarah Wilson" }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const taskData = {
        ...formData,
        id: task?.id || Date.now(),
        createdAt: task?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave?.(taskData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <h3 className="text-xl font-semibold">
            {task ? "Edit Task" : "Create New Task"}
          </h3>
        </ModalHeader>
        
        <ModalBody className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            isRequired
          />

          <Textarea
            label="Description"
            placeholder="Describe the task..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            minRows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              selectedKeys={[formData.priority]}
              onChange={(e) => handleInputChange("priority", e.target.value)}
            >
              {priorities.map((priority) => (
                <SelectItem key={priority.key} value={priority.key}>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" color={priority.color} variant="dot">
                      {priority.label}
                    </Chip>
                  </div>
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Status"
              selectedKeys={[formData.status]}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              {statuses.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Project"
              selectedKeys={[formData.project]}
              onChange={(e) => handleInputChange("project", e.target.value)}
            >
              {projects.map((project) => (
                <SelectItem key={project.key} value={project.key}>
                  {project.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Assignee"
              selectedKeys={[formData.assignee]}
              onChange={(e) => handleInputChange("assignee", e.target.value)}
            >
              {teamMembers.map((member) => (
                <SelectItem key={member.key} value={member.key}>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" name={member.label.charAt(0)} />
                    {member.label}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />

            <Input
              type="number"
              label="Estimated Hours"
              placeholder="0"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange("estimatedHours", e.target.value)}
              endContent={<span className="text-sm text-gray-500">hrs</span>}
            />
          </div>

          {task?.id && (
            <div style={{ marginTop: 24, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
              <TaskComments taskId={task.id} />
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSave}
            isDisabled={!formData.title.trim() || loading}
            isLoading={loading}
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;