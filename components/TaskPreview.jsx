"use client";

import { useState } from "react";

export default function TaskPreview({ task, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (!task) return children;

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const priorityColors = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ position: 'relative' }}
      >
        {children}
      </div>

      {isVisible && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)',
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            zIndex: 10000,
            minWidth: '300px',
            maxWidth: '400px',
            pointerEvents: 'none'
          }}
        >
          {/* Title */}
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#0f172a',
            marginBottom: '8px'
          }}>
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '12px',
              lineHeight: '1.5',
              maxHeight: '60px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: priorityColors[task.priority] || '#94a3b8'
              }} />
              <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                {task.priority} priority
              </span>
            </div>

            {/* Assignee */}
            {task.profiles && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {task.profiles.full_name?.charAt(0)}
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {task.profiles.full_name}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '12px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderTop: 'none',
            borderLeft: 'none',
            transform: 'translateX(-50%) rotate(45deg)'
          }} />
        </div>
      )}
    </>
  );
}
