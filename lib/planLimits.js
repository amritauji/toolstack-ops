// Plan limits and enforcement configuration

export const PLAN_LIMITS = {
  free: {
    name: 'Free',
    maxUsers: 3,
    maxTasks: 50,
    maxStorage: 100, // MB
    features: {
      realtime: true,
      comments: true,
      attachments: false,
      analytics: false,
      api: false,
      integrations: false
    }
  },
  starter: {
    name: 'Starter',
    maxUsers: 10,
    maxTasks: -1, // unlimited
    maxStorage: 5120, // 5GB in MB
    features: {
      realtime: true,
      comments: true,
      attachments: true,
      analytics: false,
      api: false,
      integrations: false
    }
  },
  professional: {
    name: 'Professional',
    maxUsers: 50,
    maxTasks: -1, // unlimited
    maxStorage: 20480, // 20GB in MB
    features: {
      realtime: true,
      comments: true,
      attachments: true,
      analytics: true,
      api: true,
      integrations: false
    }
  },
  enterprise: {
    name: 'Enterprise',
    maxUsers: -1, // unlimited
    maxTasks: -1, // unlimited
    maxStorage: -1, // unlimited
    features: {
      realtime: true,
      comments: true,
      attachments: true,
      analytics: true,
      api: true,
      integrations: true
    }
  }
};

// Check if user can perform action based on plan
export function canPerformAction(plan, action, currentUsage) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  
  switch (action) {
    case 'add_user':
      if (limits.maxUsers === -1) return { allowed: true };
      return {
        allowed: currentUsage.users < limits.maxUsers,
        limit: limits.maxUsers,
        current: currentUsage.users,
        message: `Free plan limited to ${limits.maxUsers} users`
      };
      
    case 'add_task':
      if (limits.maxTasks === -1) return { allowed: true };
      return {
        allowed: currentUsage.tasks < limits.maxTasks,
        limit: limits.maxTasks,
        current: currentUsage.tasks,
        message: `Free plan limited to ${limits.maxTasks} tasks`
      };
      
    case 'upload_file':
      if (!limits.features.attachments) {
        return {
          allowed: false,
          message: 'File attachments require Starter plan or higher'
        };
      }
      if (limits.maxStorage === -1) return { allowed: true };
      return {
        allowed: currentUsage.storage < limits.maxStorage,
        limit: limits.maxStorage,
        current: currentUsage.storage,
        message: `Storage limit reached (${limits.maxStorage}MB)`
      };
      
    case 'access_analytics':
      return {
        allowed: limits.features.analytics,
        message: 'Analytics require Professional plan or higher'
      };
      
    case 'access_api':
      return {
        allowed: limits.features.api,
        message: 'API access requires Professional plan or higher'
      };
      
    default:
      return { allowed: true };
  }
}

// Get usage percentage
export function getUsagePercentage(plan, type, current) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const limit = limits[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
  
  if (limit === -1) return 0; // unlimited
  return Math.min(100, Math.round((current / limit) * 100));
}

// Check if approaching limit
export function isApproachingLimit(plan, type, current) {
  const percentage = getUsagePercentage(plan, type, current);
  return percentage >= 80;
}

// Check if at limit
export function isAtLimit(plan, type, current) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const limit = limits[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
  
  if (limit === -1) return false; // unlimited
  return current >= limit;
}
