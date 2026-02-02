// Database connection pooling configuration
import { createClient } from '@supabase/supabase-js';

// Connection pool configuration
const poolConfig = {
  // Maximum number of connections in the pool
  max: parseInt(process.env.DB_POOL_MAX) || 20,
  
  // Minimum number of connections in the pool
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  
  // Maximum time a connection can be idle before being released
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  
  // Maximum time to wait for a connection
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
  
  // How often to run eviction checks
  evictionRunIntervalMillis: parseInt(process.env.DB_EVICTION_INTERVAL) || 10000,
  
  // Number of connections to check during eviction
  numTestsPerEvictionRun: parseInt(process.env.DB_TESTS_PER_EVICTION) || 3,
  
  // Minimum time a connection must be idle before being eligible for eviction
  softIdleTimeoutMillis: parseInt(process.env.DB_SOFT_IDLE_TIMEOUT) || 5000,
};

// Enhanced Supabase client with connection pooling awareness
export function createPooledSupabaseClient() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      db: {
        schema: 'public',
      },
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'x-connection-pool': 'enabled'
        }
      }
    }
  );

  return client;
}

// Connection health check
export async function checkDatabaseHealth() {
  const client = createPooledSupabaseClient();
  
  try {
    const start = Date.now();
    const { data, error } = await client
      .from('profiles')
      .select('id')
      .limit(1);
    
    const duration = Date.now() - start;
    
    return {
      healthy: !error,
      responseTime: duration,
      error: error?.message,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      healthy: false,
      responseTime: null,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Database metrics
export class DatabaseMetrics {
  constructor() {
    this.connections = {
      active: 0,
      idle: 0,
      total: 0
    };
    this.queries = {
      total: 0,
      slow: 0,
      failed: 0
    };
    this.performance = {
      avgResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity
    };
  }

  recordQuery(duration, success = true) {
    this.queries.total++;
    
    if (!success) {
      this.queries.failed++;
    }
    
    if (duration > 1000) { // Slow query threshold: 1 second
      this.queries.slow++;
    }
    
    // Update performance metrics
    this.performance.maxResponseTime = Math.max(this.performance.maxResponseTime, duration);
    this.performance.minResponseTime = Math.min(this.performance.minResponseTime, duration);
    
    // Simple moving average
    this.performance.avgResponseTime = 
      (this.performance.avgResponseTime * (this.queries.total - 1) + duration) / this.queries.total;
  }

  getStats() {
    return {
      connections: { ...this.connections },
      queries: { ...this.queries },
      performance: { ...this.performance },
      errorRate: this.queries.total > 0 ? this.queries.failed / this.queries.total : 0,
      slowQueryRate: this.queries.total > 0 ? this.queries.slow / this.queries.total : 0
    };
  }

  reset() {
    this.connections = { active: 0, idle: 0, total: 0 };
    this.queries = { total: 0, slow: 0, failed: 0 };
    this.performance = { avgResponseTime: 0, maxResponseTime: 0, minResponseTime: Infinity };
  }
}

// Global database metrics instance
export const dbMetrics = new DatabaseMetrics();

// Wrapper for database operations with metrics
export function withDatabaseMetrics(operation) {
  return async (...args) => {
    const start = Date.now();
    let success = true;
    
    try {
      const result = await operation(...args);
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - start;
      dbMetrics.recordQuery(duration, success);
    }
  };
}

// Periodic health checks
if (typeof window === 'undefined') {
  setInterval(async () => {
    const health = await checkDatabaseHealth();
    if (!health.healthy) {
      console.error('Database health check failed:', health.error);
    }
  }, 60000); // Every minute
}