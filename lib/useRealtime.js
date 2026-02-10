"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useRealtimeSubscription(table, callback) {
  const [isConnected, setIsConnected] = useState(true); // Default to true to avoid red indicator
  const channelRef = useRef(null);
  const callbackRef = useRef(callback);
  const mountedRef = useRef(true);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (e) {
        // Ignore cleanup errors in dev mode
      }
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`realtime-${table}-${Math.random().toString(36).substr(2, 9)}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        (payload) => {
          if (mountedRef.current && callbackRef.current) {
            callbackRef.current(payload);
          }
        }
      )
      .subscribe((status) => {
        if (mountedRef.current) {
          // Only update connection status after a delay to avoid flicker
          timeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              setIsConnected(status === 'SUBSCRIBED');
            }
          }, 500);
        }
      });

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
        channelRef.current = null;
      }
    };
  }, [table]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isConnected;
}

export function useRealtimeTasks(onTaskChange) {
  const memoizedCallback = useCallback((payload) => {
    if (onTaskChange) {
      onTaskChange(payload);
    }
  }, [onTaskChange]);
  
  return useRealtimeSubscription('tasks', memoizedCallback);
}