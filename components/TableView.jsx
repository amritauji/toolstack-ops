"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/ModernComponents";

export default function TableView({ 
  tasks, 
  users, 
  selectedTasks, 
  onSelectionChange, 
  onTaskClick 
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return tasks;
    
    return [...tasks].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'assigned_to') {
        const userA = users.find(u => u.id === aVal);
        const userB = users.find(u => u.id === bVal);
        aVal = userA?.full_name || 'Unassigned';
        bVal = userB?.full_name || 'Unassigned';
      }
      
      if (sortConfig.key === 'created_at' || sortConfig.key === 'due_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortConfig, users]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    onSelectionChange(checked ? tasks.map(t => t.id) : []);
  };

  const handleSelectTask = (taskId, checked) => {
    onSelectionChange(prev => 
      checked 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#64748b';
      case 'in_progress': return '#f59e0b';
      case 'done': return '#10b981';
      default: return '#64748b';
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <span style={{ color: '#cbd5e1' }}>↕️</span>;
    }
    return (
      <span style={{ color: '#7c6df2' }}>
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px', textAlign: 'left', width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#7c6df2'
                  }}
                />
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('title')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Task
                  <SortIcon column="title" />
                </div>
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('status')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('priority')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Priority
                  <SortIcon column="priority" />
                </div>
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('assigned_to')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Assignee
                  <SortIcon column="assigned_to" />
                </div>
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('due_date')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Due Date
                  <SortIcon column="due_date" />
                </div>
              </th>
              
              <th 
                style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                onClick={() => handleSort('created_at')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Created
                  <SortIcon column="created_at" />
                </div>
              </th>
            </tr>
          </thead>
          
          <tbody>
            {sortedTasks.map((task, index) => {
              const assignedUser = users.find(u => u.id === task.assigned_to);
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
              
              return (
                <tr 
                  key={task.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: selectedTasks.includes(task.id) ? '#f0f4ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedTasks.includes(task.id)) {
                      e.target.style.background = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedTasks.includes(task.id)) {
                      e.target.style.background = 'white';
                    }
                  }}
                  onClick={() => onTaskClick(task)}
                >
                  <td style={{ padding: '16px' }} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => handleSelectTask(task.id, e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#7c6df2'
                      }}
                    />
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '4px'
                      }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <Badge 
                      variant="secondary"
                      style={{
                        background: `${getStatusColor(task.status)}20`,
                        color: getStatusColor(task.status),
                        textTransform: 'capitalize'
                      }}
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <Badge 
                      variant="secondary"
                      style={{
                        background: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority),
                        textTransform: 'capitalize'
                      }}
                    >
                      {task.priority}
                    </Badge>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    {assignedUser ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: assignedUser.avatar_url ? `url(${assignedUser.avatar_url})` : '#7c6df2',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {!assignedUser.avatar_url && assignedUser.full_name?.charAt(0)}
                        </div>
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {assignedUser.full_name}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '14px', color: '#9ca3af' }}>Unassigned</span>
                    )}
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: '14px',
                      color: isOverdue ? '#ef4444' : '#374151',
                      fontWeight: isOverdue ? '500' : '400'
                    }}>
                      {formatDate(task.due_date)}
                      {isOverdue && ' ⚠️'}
                    </span>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {formatDate(task.created_at)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {tasks.length === 0 && (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
              No tasks found
            </div>
            <div style={{ fontSize: '14px' }}>
              Try adjusting your filters or create a new task
            </div>
          </div>
        )}
      </div>
    </div>
  );
}