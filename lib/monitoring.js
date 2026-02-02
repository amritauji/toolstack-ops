// Basic monitoring and logging
export class Logger {
  static log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    if (typeof window === 'undefined') {
      // Server-side logging
      console.log(JSON.stringify(logEntry));
    } else {
      // Client-side logging
      console[level](message, meta);
    }
  }

  static info(message, meta) {
    this.log('info', message, meta);
  }

  static warn(message, meta) {
    this.log('warn', message, meta);
  }

  static error(message, meta) {
    this.log('error', message, meta);
  }

  static debug(message, meta) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, meta);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static startTimer(label) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${label}-start`);
    }
  }

  static endTimer(label) {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${label}-end`);
      window.performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = window.performance.getEntriesByName(label)[0];
      Logger.info(`Performance: ${label}`, { duration: measure.duration });
    }
  }

  static async measureAsync(label, fn) {
    this.startTimer(label);
    try {
      const result = await fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      Logger.error(`Error in ${label}`, { error: error.message });
      throw error;
    }
  }
}

// Error tracking
export function trackError(error, context = {}) {
  Logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    code: error.code,
    context
  });

  // In production, you would send this to an error tracking service
  // like Sentry, LogRocket, or Bugsnag
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { extra: context });
  }
}

// Health check utility
export async function healthCheck() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {}
  };

  try {
    // Database check
    const { createSupabaseServer } = await import('@/lib/supabaseServer');
    const supabase = await createSupabaseServer();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    checks.checks.database = error ? 'unhealthy' : 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'degraded';
  }

  return checks;
}