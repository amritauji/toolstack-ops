// Performance monitoring system
class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.thresholds = {
      responseTime: 1000, // 1 second
      memoryUsage: 512 * 1024 * 1024, // 512MB
      errorRate: 0.05 // 5%
    };
  }

  // Track response time
  trackResponseTime(endpoint, duration) {
    const key = `response_time:${endpoint}`;
    this.addMetric(key, duration);
    
    if (duration > this.thresholds.responseTime) {
      this.addAlert('high_response_time', {
        endpoint,
        duration,
        threshold: this.thresholds.responseTime
      });
    }
  }

  // Track error
  trackError(endpoint, error) {
    const key = `errors:${endpoint}`;
    this.addMetric(key, 1);
    
    // Calculate error rate
    const totalRequests = this.getMetricCount(`requests:${endpoint}`);
    const errorCount = this.getMetricCount(key);
    const errorRate = totalRequests > 0 ? errorCount / totalRequests : 0;
    
    if (errorRate > this.thresholds.errorRate) {
      this.addAlert('high_error_rate', {
        endpoint,
        errorRate,
        threshold: this.thresholds.errorRate,
        error: error.message
      });
    }
  }

  // Track request
  trackRequest(endpoint) {
    const key = `requests:${endpoint}`;
    this.addMetric(key, 1);
  }

  // Track memory usage
  trackMemoryUsage() {
    const usage = process.memoryUsage();
    this.addMetric('memory:heap_used', usage.heapUsed);
    this.addMetric('memory:heap_total', usage.heapTotal);
    this.addMetric('memory:rss', usage.rss);
    
    if (usage.heapUsed > this.thresholds.memoryUsage) {
      this.addAlert('high_memory_usage', {
        current: usage.heapUsed,
        threshold: this.thresholds.memoryUsage
      });
    }
  }

  // Add metric
  addMetric(key, value) {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key);
    metrics.push({
      value,
      timestamp: Date.now()
    });
    
    // Keep only last 1000 entries
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }
  }

  // Get metric statistics
  getMetricStats(key) {
    const metrics = this.metrics.get(key) || [];
    if (metrics.length === 0) return null;
    
    const values = metrics.map(m => m.value);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1]
    };
  }

  // Get metric count
  getMetricCount(key) {
    const metrics = this.metrics.get(key) || [];
    return metrics.length;
  }

  // Add alert
  addAlert(type, data) {
    this.alerts.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.splice(0, this.alerts.length - 100);
    }
    
    console.warn(`Performance Alert [${type}]:`, data);
  }

  // Get dashboard data
  getDashboard() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    return {
      timestamp: now,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(
        Array.from(this.metrics.entries()).map(([key, values]) => [
          key,
          this.getMetricStats(key)
        ])
      ),
      recentAlerts: this.alerts.filter(alert => alert.timestamp > oneHourAgo),
      cache: {
        size: global.cache?.size() || 0
      }
    };
  }

  // Clear old data
  cleanup() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [key, metrics] of this.metrics.entries()) {
      const filtered = metrics.filter(m => m.timestamp > cutoff);
      if (filtered.length === 0) {
        this.metrics.delete(key);
      } else {
        this.metrics.set(key, filtered);
      }
    }
    
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoff);
  }
}

// Global tracker instance
export const performanceTracker = new PerformanceTracker();

// Middleware wrapper for tracking
export function withPerformanceTracking(endpoint, fn) {
  return async (...args) => {
    const startTime = Date.now();
    performanceTracker.trackRequest(endpoint);
    
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      performanceTracker.trackResponseTime(endpoint, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      performanceTracker.trackResponseTime(endpoint, duration);
      performanceTracker.trackError(endpoint, error);
      throw error;
    }
  };
}

// Periodic monitoring
setInterval(() => {
  performanceTracker.trackMemoryUsage();
  performanceTracker.cleanup();
}, 60 * 1000); // Every minute