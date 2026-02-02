"use server";

import { updateTaskStatus, updateTask } from "@/lib/tasks";
import { revalidatePath } from "next/cache";

export async function changeTaskStatus(formData) {
  const taskId = formData.get("taskId");
  const status = formData.get("status");

  if (!taskId || !status) return;

  await updateTaskStatus(taskId, status);
  revalidatePath("/dashboard");
}

export async function assignTaskAction(formData) {
  const taskId = formData.get("taskId");
  const userId = formData.get("userId");

  if (!taskId || !userId) return;

  // Create FormData for updateTask
  const updateFormData = new FormData();
  updateFormData.set("taskId", taskId);
  updateFormData.set("assigned_to", userId);

  await updateTask(updateFormData);
  revalidatePath("/dashboard");
}