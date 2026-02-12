"use server";

import { updateTaskStatus, updateTask } from "@/lib/tasks";

export async function changeTaskStatus(formData) {
  try {
    const taskId = formData.get("taskId");
    const status = formData.get("status");

    if (!taskId || !status) return { error: 'Missing required fields' };

    await updateTaskStatus(taskId, status);
    return { success: true };
  } catch (error) {
    console.error('Change task status error:', error);
    return { error: error.message };
  }
}

export async function assignTaskAction(formData) {
  try {
    const taskId = formData.get("taskId");
    const userId = formData.get("userId");

    if (!taskId || !userId) return { error: 'Missing required fields' };

    // Create FormData for updateTask
    const updateFormData = new FormData();
    updateFormData.set("taskId", taskId);
    updateFormData.set("assigned_to", userId);

    await updateTask(updateFormData);
    return { success: true };
  } catch (error) {
    console.error('Assign task error:', error);
    return { error: error.message };
  }
}