"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/ModernComponents";

export default function CalendarView({ tasks, users, onTaskClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  
  const days = [];
  const date = new Date(startDate);
  
  while (date <= monthEnd || days.length < 42) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach(task => {
      if (task.due_date) {
        const dateKey = new Date(task.due_date).toDateString();
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
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
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#111827'
        }}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigateMonth(-1)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #7c6df2',
              background: '#7c6df2',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        background: '#e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            style={{
              background: '#f8fafc',
              padding: '12px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayTasks = tasksByDate[day.toDateString()] || [];
          
          return (
            <div
              key={index}
              style={{
                background: 'white',
                minHeight: '120px',
                padding: '8px',
                opacity: isCurrentMonth ? 1 : 0.3,
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: isToday ? '600' : '400',
                  color: isToday ? '#7c6df2' : '#374151',
                  background: isToday ? '#f0f4ff' : 'transparent',
                  padding: isToday ? '2px 6px' : '0',
                  borderRadius: '4px'
                }}>
                  {day.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span style={{
                    fontSize: '10px',
                    background: '#7c6df2',
                    color: 'white',
                    padding: '2px 4px',
                    borderRadius: '8px',
                    fontWeight: '500'
                  }}>
                    {dayTasks.length}
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {dayTasks.slice(0, 3).map(task => (
                  <div
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    style={{
                      padding: '4px 6px',
                      borderRadius: '4px',
                      background: `${getPriorityColor(task.priority)}20`,
                      border: `1px solid ${getPriorityColor(task.priority)}40`,
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: getPriorityColor(task.priority),
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    textAlign: 'center',
                    padding: '2px'
                  }}>
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}