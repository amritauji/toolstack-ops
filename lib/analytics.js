'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';

// Get task completion metrics
export async function getTaskMetrics() {
  const supabase = await createSupabaseServer();
  
  try {
    // Get all tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, priority, created_at, due_date');
    
    if (!tasks) return null;

    // Calculate metrics
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Overdue tasks
    const now = new Date();
    const overdue = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < now && t.status !== 'done'
    ).length;
    
    // Priority breakdown
    const highPriority = tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'low').length;
    
    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate,
      overdue,
      priority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority
      }
    };
  } catch (error) {
    console.error('Error getting task metrics:', error);
    return null;
  }
}

// Get team productivity metrics
export async function getTeamMetrics() {
  const supabase = await createSupabaseServer();
  
  try {
    // Get all users with their task counts
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url');
    
    if (!users) return null;

    // Get task counts for each user
    const userMetrics = await Promise.all(
      users.map(async (user) => {
        const { count: totalTasks } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id);
        
        const { count: completedTasks } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user.id)
          .eq('status', 'done');
        
        const completionRate = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;
        
        return {
          ...user,
          totalTasks: totalTasks || 0,
          completedTasks: completedTasks || 0,
          completionRate
        };
      })
    );
    
    return userMetrics.sort((a, b) => b.completedTasks - a.completedTasks);
  } catch (error) {
    console.error('Error getting team metrics:', error);
    return null;
  }
}

// Get activity timeline (last 30 days)
export async function getActivityTimeline() {
  const supabase = await createSupabaseServer();
  
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get tasks created in last 30 days
    const { data: tasks } = await supabase
      .from('tasks')
      .select('created_at, status')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });
    
    if (!tasks) return null;

    // Group by date
    const timeline = {};
    tasks.forEach(task => {
      const date = new Date(task.created_at).toLocaleDateString();
      if (!timeline[date]) {
        timeline[date] = { created: 0, completed: 0 };
      }
      timeline[date].created++;
      if (task.status === 'done') {
        timeline[date].completed++;
      }
    });
    
    // Convert to array
    return Object.entries(timeline).map(([date, data]) => ({
      date,
      ...data
    }));
  } catch (error) {
    console.error('Error getting activity timeline:', error);
    return null;
  }
}

// Get recent activity feed
export async function getRecentActivity(limit = 10) {
  const supabase = await createSupabaseServer();
  
  try {
    // Get recent tasks with user info
    const { data: tasks } = await supabase
      .from('tasks')
      .select(`
        id,
        title,
        status,
        created_at,
        assigned_to,
        profiles:assigned_to (full_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return tasks || [];
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
}

// Export analytics data as CSV
export async function exportAnalyticsCSV() {
  const metrics = await getTaskMetrics();
  const team = await getTeamMetrics();
  
  if (!metrics || !team) return null;
  
  // Create CSV content
  let csv = 'Analytics Report\n\n';
  
  // Task Metrics
  csv += 'Task Metrics\n';
  csv += 'Metric,Value\n';
  csv += `Total Tasks,${metrics.total}\n`;
  csv += `Completed,${metrics.completed}\n`;
  csv += `In Progress,${metrics.inProgress}\n`;
  csv += `To Do,${metrics.todo}\n`;
  csv += `Completion Rate,${metrics.completionRate}%\n`;
  csv += `Overdue,${metrics.overdue}\n\n`;
  
  // Team Metrics
  csv += 'Team Performance\n';
  csv += 'Name,Total Tasks,Completed Tasks,Completion Rate\n';
  team.forEach(user => {
    csv += `${user.full_name},${user.totalTasks},${user.completedTasks},${user.completionRate}%\n`;
  });
  
  return csv;
}
