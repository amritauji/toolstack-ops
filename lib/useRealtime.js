"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useRealtimeSubscription(table, callback) {
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef(null);
  const callbackRef = useRef(callback);
  const mountedRef = useRef(true);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!mountedRef.current) return;
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
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
          setIsConnected(status === 'SUBSCRIBED');
        }
      });

    channelRef.current = channel;

    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
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