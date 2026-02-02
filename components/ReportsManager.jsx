"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/ModernComponents";

export default function ReportsManager({ tasks, users, activities }) {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30');

  const reports = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'team', name: 'Team Performance', icon: '👥' },
    { id: 'time', name: 'Time Analysis', icon: '⏰' },
    { id: 'trends', name: 'Trends', icon: '📈' }
  ];

  const filteredTasks = useMemo(() => {
    const days = parseInt(dateRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return tasks.filter(task => new Date(task.created_at) >= cutoff);
  }, [tasks, dateRange]);

  const stats = useMemo(() => {
    const completed = filteredTasks.filter(t => t.status === 'done');
    const overdue = filteredTasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    );
    
    const byPriority = {
      high: filteredTasks.filter(t => t.priority === 'high').length,
      medium: filteredTasks.filter(t => t.priority === 'medium').length,
      low: filteredTasks.filter(t => t.priority === 'low').length
    };
    
    const byStatus = {
      todo: filteredTasks.filter(t => t.status === 'todo').length,
      in_progress: filteredTasks.filter(t => t.status === 'in_progress').length,
      done: filteredTasks.filter(t => t.status === 'done').length
    };
    
    const completionRate = filteredTasks.length > 0 
      ? (completed.length / filteredTasks.length) * 100 
      : 0;
    
    return {
      total: filteredTasks.length,
      completed: completed.length,
      overdue: overdue.length,
      completionRate,
      byPriority,
      byStatus
    };
  }, [filteredTasks]);

  const teamStats = useMemo(() => {
    const userTasks = {};
    users.forEach(user => {
      const userTaskList = filteredTasks.filter(t => t.assigned_to === user.id);
      const completed = userTaskList.filter(t => t.status === 'done');
      
      userTasks[user.id] = {
        user,
        total: userTaskList.length,
        completed: completed.length,
        completionRate: userTaskList.length > 0 ? (completed.length / userTaskList.length) * 100 : 0
      };
    });
    
    return Object.values(userTasks).sort((a, b) => b.completionRate - a.completionRate);
  }, [filteredTasks, users]);

  const renderOverview = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <MetricCard
          title="Total Tasks"
          value={stats.total}
          icon="📋"
          color="#7c6df2"
        />
        <MetricCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          color="#10b981"
        />
        <MetricCard
          title="Overdue"
          value={stats.overdue}
          icon="⚠️"
          color="#ef4444"
        />
        <MetricCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate)}%`}
          icon="📊"
          color="#f59e0b"
        />
      </div>

      {/* Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <ChartCard title="Tasks by Status" data={stats.byStatus} />
        <ChartCard title="Tasks by Priority" data={stats.byPriority} />
      </div>
    </div>
  );

  const renderTeamPerformance = () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
        Team Performance
      </h3>
      
      {teamStats.map(userStat => (
        <div
          key={userStat.user.id}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: 'white'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: userStat.user.avatar_url ? `url(${userStat.user.avatar_url})` : '#7c6df2',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: 'white',
                fontWeight: '600'
              }}>
                {!userStat.user.avatar_url && userStat.user.full_name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                  {userStat.user.full_name}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {userStat.user.role}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                {Math.round(userStat.completionRate)}%
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {userStat.completed}/{userStat.total} tasks
              </div>
            </div>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            background: '#f1f5f9',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${userStat.completionRate}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7c6df2, #a855f7)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductivity = () => {
    const avgTasksPerDay = stats.total / parseInt(dateRange);
    const avgCompletionTime = 2.5; // Mock data
    
    return (
      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <MetricCard
            title="Avg Tasks/Day"
            value={avgTasksPerDay.toFixed(1)}
            icon="📅"
            color="#7c6df2"
          />
          <MetricCard
            title="Avg Completion Time"
            value={`${avgCompletionTime}d`}
            icon="⏱️"
            color="#10b981"
          />
          <MetricCard
            title="Active Tasks"
            value={stats.byStatus.in_progress}
            icon="🔄"
            color="#f59e0b"
          />
          <MetricCard
            title="Efficiency Score"
            value={`${Math.round(stats.completionRate)}%`}
            icon="⚡"
            color="#ef4444"
          />
        </div>
        
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          background: 'white'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            Productivity Insights
          </h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            <InsightItem
              icon="🎯"
              text={`${stats.completed} tasks completed in the last ${dateRange} days`}
            />
            <InsightItem
              icon="📈"
              text={`${Math.round(stats.completionRate)}% completion rate`}
            />
            <InsightItem
              icon="⚠️"
              text={`${stats.overdue} tasks are overdue and need attention`}
            />
            <InsightItem
              icon="🔥"
              text={`${stats.byPriority.high} high-priority tasks in progress`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
            Reports & Analytics
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Track performance and identify trends
          </p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Report Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        overflowX: 'auto'
      }}>
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedReport === report.id ? '#7c6df2' : '#f8fafc',
              color: selectedReport === report.id ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{report.icon}</span>
            {report.name}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div>
        {selectedReport === 'overview' && renderOverview()}
        {selectedReport === 'team' && renderTeamPerformance()}
        {selectedReport === 'productivity' && renderProductivity()}
        {(selectedReport === 'time' || selectedReport === 'trends') && (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              Coming Soon
            </div>
            <div style={{ fontSize: '14px' }}>
              This report is under development
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
            {title}
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, data }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div style={{
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      background: 'white'
    }}>
      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
        {title}
      </h4>
      
      <div style={{ display: 'grid', gap: '8px' }}>
        {Object.entries(data).map(([key, value]) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '60px',
                fontSize: '12px',
                color: '#6b7280',
                textTransform: 'capitalize'
              }}>
                {key.replace('_', ' ')}
              </div>
              
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  flex: 1,
                  height: '8px',
                  background: '#f1f5f9',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: '#7c6df2',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  minWidth: '30px'
                }}>
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span style={{ fontSize: '14px', color: '#374151' }}>{text}</span>
    </div>
  );
}