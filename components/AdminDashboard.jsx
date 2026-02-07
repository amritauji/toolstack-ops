"use client";

import { useState } from 'react';
import UserManagement from './UserManagement';

export default function AdminDashboard({ taskMetrics, teamMetrics, timeline, recentActivity, users, currentUserRole }) {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div style={styles.container}>
      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={activeTab === 'analytics' ? styles.tabActive : styles.tab}
        >
          📊 Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? styles.tabActive : styles.tab}
        >
          👥 User Management
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          {/* Key Metrics */}
          <div style={styles.metricsGrid}>
            <MetricCard title="Total Tasks" value={taskMetrics?.total || 0} icon="📋" color="#3b82f6" />
            <MetricCard title="Completed" value={taskMetrics?.completed || 0} icon="✅" color="#10b981" />
            <MetricCard title="In Progress" value={taskMetrics?.inProgress || 0} icon="⏳" color="#f59e0b" />
            <MetricCard title="Completion Rate" value={`${taskMetrics?.completionRate || 0}%`} icon="📈" color="#8b5cf6" />
          </div>

          {/* Team Performance */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Team Performance</h3>
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
                      <div style={styles.teamMemberStats}>{user.completedTasks} / {user.totalTasks} tasks</div>
                    </div>
                  </div>
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${user.completionRate}%`,
                        background: user.completionRate >= 80 ? '#10b981' : user.completionRate >= 50 ? '#f59e0b' : '#ef4444'
                      }} />
                    </div>
                    <span style={styles.progressLabel}>{user.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <UserManagement users={users} currentUserRole={currentUserRole} />
      )}
    </div>
  );
}

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

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  tabNav: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: '#f9fafb',
    padding: '4px',
    borderRadius: '8px',
    width: 'fit-content'
  },
  tab: {
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabActive: {
    padding: '12px 24px',
    background: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
  card: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '20px'
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
  progressContainer: {
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
  }
};
