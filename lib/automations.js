"use server";

import { createSupabaseServer } from "@/lib/supabaseServer";
import { withErrorHandling, AppError, ErrorCodes } from "@/lib/errorHandling";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export const getAutomations = withErrorHandling(async () => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  const { data, error } = await supabase
    .from('automations')
    .select('*')
    .eq('org_id', profile.current_org_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
});

export const createAutomation = withErrorHandling(async (formData) => {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new AppError("Not authenticated", 401, ErrorCodes.UNAUTHORIZED);

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  const automationData = {
    org_id: profile.current_org_id,
    name: formData.get('name'),
    trigger_type: formData.get('trigger_type'),
    trigger_config: JSON.parse(formData.get('trigger_config') || '{}'),
    action_type: formData.get('action_type'),
    action_config: JSON.parse(formData.get('action_config') || '{}'),
    created_by: user.id
  };

  const { data, error } = await supabase
    .from('automations')
    .insert(automationData)
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
});

export const toggleAutomation = withErrorHandling(async (automationId, isActive) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('automations')
    .update({ is_active: isActive })
    .eq('id', automationId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

export const deleteAutomation = withErrorHandling(async (automationId) => {
  const supabase = await createSupabaseServer();

  const { error } = await supabase
    .from('automations')
    .delete()
    .eq('id', automationId);

  if (error) throw error;
  
  revalidatePath('/dashboard');
});

// Process automation triggers
export const processAutomationTrigger = async (triggerType, taskId, oldData, newData) => {
  const supabase = await createSupabaseServer();

  // Get active automations for this trigger
  const { data: automations } = await supabase
    .from('automations')
    .select('*')
    .eq('trigger_type', triggerType)
    .eq('is_active', true);

  if (!automations || automations.length === 0) return;

  for (const automation of automations) {
    try {
      // Check if trigger conditions match
      if (!checkTriggerConditions(automation.trigger_config, oldData, newData)) {
        continue;
      }

      // Execute action
      await executeAutomationAction(automation, taskId);
    } catch (error) {
      console.error(`Automation ${automation.id} failed:`, error);
    }
  }
};

function checkTriggerConditions(triggerConfig, oldData, newData) {
  // status_change: check if status changed to specific value
  if (triggerConfig.status && newData?.status === triggerConfig.status) {
    return true;
  }
  
  // priority_change: check if priority changed to specific value
  if (triggerConfig.priority && newData?.priority === triggerConfig.priority) {
    return true;
  }
  
  // Default: trigger matches
  return true;
}

async function executeAutomationAction(automation, taskId) {
  const supabase = await createSupabaseServer();
  const { action_type, action_config } = automation;

  switch (action_type) {
    case 'change_status':
      await supabase
        .from('tasks')
        .update({ status: action_config.status })
        .eq('id', taskId);
      break;

    case 'change_priority':
      await supabase
        .from('tasks')
        .update({ priority: action_config.priority })
        .eq('id', taskId);
      break;

    case 'assign_user':
      await supabase
        .from('tasks')
        .update({ assigned_to: action_config.user_id })
        .eq('id', taskId);
      break;

    case 'send_notification':
      if (action_config.user_id) {
        await createNotification({
          user_id: action_config.user_id,
          org_id: automation.org_id,
          type: 'automation',
          title: action_config.title || 'Automation triggered',
          message: action_config.message,
          resource_type: 'task',
          resource_id: taskId
        });
      }
      break;
  }
}
