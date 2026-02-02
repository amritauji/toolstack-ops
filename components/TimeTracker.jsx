"use client";

import { useState, useEffect } from "react";
import { Button, Badge } from "@/components/ui/ModernComponents";
import { supabase } from "@/lib/supabaseClient";

export default function TimeTracker({ taskId, currentUser }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (taskId) {
      loadTimeEntries();
      checkActiveSession();
    }
  }, [taskId]);

  useEffect(() => {
    let interval;
    if (isTracking && currentSession) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(currentSession.start_time);
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentSession]);

  const loadTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('task_id', taskId)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      
      setTimeEntries(data || []);
      const total = data?.reduce((sum, entry) => sum + (entry.duration || 0), 0) || 0;
      setTotalTime(total);
    } catch (error) {
      console.error('Error loading time entries:', error);
    }
  };

  const checkActiveSession = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('task_id', taskId)
        .eq('user_id', currentUser.id)
        .is('end_time', null)
        .single();
      
      if (data) {
        setCurrentSession(data);
        setIsTracking(true);
      }
    } catch (error) {
      // No active session
    }
  };

  const startTracking = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          task_id: taskId,
          user_id: currentUser.id,
          start_time: new Date().toISOString(),
          description: ''
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setCurrentSession(data);
      setIsTracking(true);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error starting time tracking:', error);
    }
  };

  const stopTracking = async () => {
    if (!currentSession) return;
    
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime - new Date(currentSession.start_time)) / 1000);
      
      const { error } = await supabase
        .from('time_entries')
        .update({
          end_time: endTime.toISOString(),
          duration: duration
        })
        .eq('id', currentSession.id);
      
      if (error) throw error;
      
      setIsTracking(false);
      setCurrentSession(null);
      setElapsedTime(0);
      loadTimeEntries();
    } catch (error) {
      console.error('Error stopping time tracking:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
          Time Tracking
        </h4>
        <Badge variant={isTracking ? "success" : "secondary"} size="sm">
          {isTracking ? 'Active' : 'Stopped'}
        </Badge>
      </div>

      {/* Timer Display */}
      <div style={{
        textAlign: 'center',
        padding: '20px',
        background: isTracking ? '#f0f4ff' : '#f8fafc',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          color: isTracking ? '#7c6df2' : '#6b7280',
          fontFamily: 'monospace'
        }}>
          {formatTime(elapsedTime)}
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
          {isTracking ? 'Currently tracking' : 'Timer stopped'}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {!isTracking ? (
          <Button
            variant="primary"
            size="sm"
            onClick={startTracking}
            style={{ flex: 1 }}
          >
            ▶️ Start Timer
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={stopTracking}
            style={{ flex: 1 }}
          >
            ⏹️ Stop Timer
          </Button>
        )}
      </div>

      {/* Total Time */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Total Time Logged
        </span>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
          {formatDuration(totalTime)}
        </span>
      </div>

      {/* Recent Entries */}
      {timeEntries.length > 0 && (
        <div>
          <h5 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Recent Sessions
          </h5>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {timeEntries.slice(0, 5).map(entry => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(entry.start_time).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {new Date(entry.start_time).toLocaleTimeString()} - 
                    {entry.end_time ? new Date(entry.end_time).toLocaleTimeString() : 'Active'}
                  </div>
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  {entry.duration ? formatDuration(entry.duration) : 'Active'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}