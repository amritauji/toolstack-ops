"use client";

import { useState, useEffect } from "react";
import { startTimeEntry, stopTimeEntry, getUserActiveTimeEntry } from "@/lib/timeTracking";
import toast from 'react-hot-toast';

const TimeTracker = ({ tasks = [] }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const active = await getUserActiveTimeEntry();
        if (active) {
          setActiveTimer(active);
          const elapsed = Math.floor((Date.now() - new Date(active.start_time)) / 1000);
          setElapsedTime(elapsed);
        }
      } catch {
        // Silent fail
      }
    };
    load();
  }, []);

  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = async (taskId, taskTitle) => {
    try {
      const entry = await startTimeEntry(taskId);
      setActiveTimer({ ...entry, tasks: { title: taskTitle } });
      setElapsedTime(0);
      toast.success('Timer started');
    } catch {
      toast.error('Failed to start timer');
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;
    try {
      await stopTimeEntry(activeTimer.id);
      setActiveTimer(null);
      setElapsedTime(0);
      toast.success('Timer stopped');
    } catch {
      toast.error('Failed to stop timer');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Time Tracker</h3>

        {activeTimer ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', fontFamily: 'monospace', fontWeight: '700', color: '#667eea', marginBottom: '8px' }}>
              {formatTime(elapsedTime)}
            </div>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Working on: {activeTimer.tasks?.title}</p>
            <button
              onClick={stopTimer}
              style={{
                padding: '12px 24px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Stop Timer
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Select a task to start tracking time</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {tasks.slice(0, 3).map((task) => (
                <button
                  key={task.id}
                  onClick={() => startTimer(task.id, task.title)}
                  style={{
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{task.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;