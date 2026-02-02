"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const uploadTaskAttachment = withErrorHandling(async (taskId, file) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError("File too large (max 5MB)", 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new AppError("File type not allowed", 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${taskId}/${Date.now()}.${fileExt}`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('task-attachments')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('task-attachments')
    .getPublicUrl(fileName);

  // Save to database
  const { data, error } = await supabase
    .from('task_attachments')
    .insert({
      task_id: taskId,
      user_id: user.id,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_url: publicUrl
    })
    .select(`
      id,
      file_name,
      file_size,
      file_type,
      file_url,
      created_at,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return data;
});

export const getTaskAttachments = withErrorHandling(async (taskId) => {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from('task_attachments')
    .select(`
      id,
      file_name,
      file_size,
      file_type,
      file_url,
      created_at,
      profiles:user_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
});

export const deleteTaskAttachment = withErrorHandling(async (attachmentId) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  // Get attachment info
  const { data: attachment, error: fetchError } = await supabase
    .from('task_attachments')
    .select('file_url, user_id')
    .eq('id', attachmentId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) throw fetchError;

  // Extract file path from URL
  const filePath = attachment.file_url.split('/').slice(-3).join('/');

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('task-attachments')
    .remove([filePath]);

  if (storageError) console.warn('Storage deletion failed:', storageError);

  // Delete from database
  const { error } = await supabase
    .from('task_attachments')
    .delete()
    .eq('id', attachmentId)
    .eq('user_id', user.id);

  if (error) throw error;
});