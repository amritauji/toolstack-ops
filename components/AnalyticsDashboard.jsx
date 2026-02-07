"use client";

import { useState } from 'react';

export default function AnalyticsDashboard({ taskMetrics, teamMetrics, timeline, recentActivity }) {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const { exportAnalyticsCSV } = await import('@/lib/analytics');
      const csv = await exportAnalyticsCSV();
      
      if (csv) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Export Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button onClick={handleExport} disabled={exportLoading} style={styles.exportButton}>
          {exportLoading ? 'Exporting...' : '📊 Export CSV'}
        </button>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <MetricCard
          title="Total Tasks"
          value={taskMetrics?.total || 0}
          icon="📋"
          color="#3b82f6"
        />
        <MetricCard
          title="Completed"
          value={taskMetrics?.completed || 0}
          icon="✅"
          color="#10b981"
        />
        <MetricCard
          title="In Progress"
          value={taskMetrics?.inProgress || 0}
          icon="⏳"
          color="#f59e0b"
        />
        <MetricCard
          title="Completion Rate"
          value={`${taskMetrics?.completionRate || 0}%`}
          icon="📈"
          color="#8b5cf6"
        />
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* Status Distribution */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Task Status Distribution</h3>
          <div style={styles.chartContent}>
            <PieChart
              data={[
                { label: 'Completed', value: taskMetrics?.completed || 0, color: '#10b981' },
                { label: 'In Progress', value: taskMetrics?.inProgress || 0, color: '#f59e0b' },
                { label: 'To Do', value: taskMetrics?.todo || 0, color: '#6b7280' }
              ]}
            />
          </div>
        </div>

        {/* Priority Breakdown */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Priority Breakdown</h3>
          <div style={styles.chartContent}>
            <BarChart
              data={[
                { label: 'High', value: taskMetrics?.priority?.high || 0, color: '#ef4444' },
                { label: 'Medium', value: taskMetrics?.priority?.medium || 0, color: '#f59e0b' },
                { label: 'Low', value: taskMetrics?.priority?.low || 0, color: '#10b981' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div style={styles.teamCard}>
        <h3 style={styles.chartTitle}>Team Performance</h3>
        <div style={styles.teamList}>
          {teamMetrics?.map((user, index) => (
            <div key={user.id} style={styles.teamMember}>
              <div style={styles.teamMemberInfo}>
                <span style={styles.rank}>#{index + 1}</span>
                <div style={styles.avatar}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} style={styles.avatarImg} />
                  ) : (
                    <span style={styles.avatarText}>{user.full_name?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div style={styles.teamMemberName}>{user.full_name}</div>
                  <div style={styles.teamMemberStats}>
                    {user.completedTasks} / {user.totalTasks} tasks completed
                  </div>
                </div>
              </div>
              <div style={styles.teamMemberProgress}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${user.completionRate}%`,
                      background: user.completionRate >= 80 ? '#10b981' : user.completionRate >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span style={styles.progressLabel}>{user.completionRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      {timeline && timeline.length > 0 && (
        <div style={styles.timelineCard}>
          <h3 style={styles.chartTitle}>Activity Timeline (Last 30 Days)</h3>
          <div style={styles.timelineChart}>
            <LineChart data={timeline} />
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div style={styles.activityCard}>
        <h3 style={styles.chartTitle}>Recent Activity</h3>
        <div style={styles.activityList}>
          {recentActivity?.map((task) => (
            <div key={task.id} style={styles.activityItem}>
              <div style={styles.activityIcon}>
                {task.status === 'done' ? '✅' : task.status === 'in_progress' ? '⏳' : '📋'}
              </div>
              <div style={styles.activityContent}>
                <div style={styles.activityTitle}>{task.title}</div>
                <div style={styles.activityMeta}>
                  {task.profiles?.full_name || 'Unassigned'} • {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{
                ...styles.statusBadge,
                background: task.status === 'done' ? '#dcfce7' : task.status === 'in_progress' ? '#fef3c7' : '#f3f4f6',
                color: task.status === 'done' ? '#166534' : task.status === 'in_progress' ? '#92400e' : '#374151'
              }}>
                {task.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, icon, color }) {
  return (
    <div style={styles.metricCard}>
      <div style={{ ...styles.metricIcon, background: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <div style={styles.metricValue}>{value}</div>
        <div style={styles.metricTitle}>{title}</div>
      </div>
    </div>
  );
}

// Simple Pie Chart
function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div style={styles.pieChart}>
      {data.map((item, index) => (
        <div key={index} style={styles.pieItem}>
          <div style={{ ...styles.pieColor, background: item.color }} />
          <div style={styles.pieLabel}>
            {item.label}: {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple Bar Chart
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div style={styles.barChart}>
      {data.map((item, index) => (
        <div key={index} style={styles.barItem}>
          <div style={styles.barLabel}>{item.label}</div>
          <div style={styles.barContainer}>
            <div 
              style={{
                ...styles.barFill,
                width: `${(item.value / max) * 100}%`,
                background: item.color
              }}
            />
            <span style={styles.barValue}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple Line Chart
function LineChart({ data }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.created, d.completed)), 1);
  
  return (
    <div style={styles.lineChart}>
      {data.map((point, index) => (
        <div key={index} style={styles.linePoint}>
          <div style={styles.lineBar}>
            <div 
              style={{
                ...styles.lineSegment,
                height: `${(point.created / maxValue) * 100}%`,
                background: '#3b82f6'
              }}
              title={`Created: ${point.created}`}
            />
            <div 
              style={{
                ...styles.lineSegment,
                height: `${(point.completed / maxValue) * 100}%`,
                background: '#10b981'
              }}
              title={`Completed: ${point.completed}`}
            />
          </div>
          <div style={styles.lineLabel}>{point.date.split('/')[1]}/{point.date.split('/')[0]}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  exportButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  metricCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  metricIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0f172a'
  },
  metricTitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px'
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  chartCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '20px'
  },
  chartContent: {
    minHeight: '200px'
  },
  pieChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  pieItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  pieColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px'
  },
  pieLabel: {
    fontSize: '14px',
    color: '#475569'
  },
  barChart: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  barItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  barLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#475569'
  },
  barContainer: {
    position: 'relative',
    height: '32px',
    background: '#f1f5f9',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 0.3s ease'
  },
  barValue: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a'
  },
  teamCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px'
  },
  teamList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  teamMember: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  teamMemberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  rank: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#64748b',
    minWidth: '32px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  avatarText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 600
  },
  teamMemberName: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a'
  },
  teamMemberStats: {
    fontSize: '12px',
    color: '#64748b'
  },
  teamMemberProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  progressBar: {
    width: '200px',
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    minWidth: '40px'
  },
  timelineCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px'
  },
  timelineChart: {
    height: '200px',
    overflowX: 'auto'
  },
  lineChart: {
    display: 'flex',
    gap: '8px',
    height: '100%',
    alignItems: 'flex-end'
  },
  linePoint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '40px'
  },
  lineBar: {
    display: 'flex',
    gap: '4px',
    height: '150px',
    alignItems: 'flex-end'
  },
  lineSegment: {
    width: '16px',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease'
  },
  lineLabel: {
    fontSize: '10px',
    color: '#64748b',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap'
  },
  activityCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px'
  },
  activityIcon: {
    fontSize: '20px'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#0f172a',
    marginBottom: '4px'
  },
  activityMeta: {
    fontSize: '12px',
    color: '#64748b'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'capitalize'
  }
};
