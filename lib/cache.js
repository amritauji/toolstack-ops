// Simple in-memory cache with TTL and memory limits
class MemoryCache {
  constructor(maxSize = 100, maxMemoryMB = 50) {
    this.cache = new Map();
    this.timers = new Map();
    this.maxSize = maxSize;
    this.maxMemoryBytes = maxMemoryMB * 1024 * 1024;
  }

  set(key, value, ttlMs = 2 * 60 * 1000) {
    this._enforceMemoryLimits();
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    this.cache.set(key, {
      value,
      createdAt: Date.now()
    });

    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.delete(firstKey);
    }

    const timer = setTimeout(() => {
      this.delete(key);
    }, ttlMs);

    this.timers.set(key, timer);
  }

  _enforceMemoryLimits() {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      if (memUsage.heapUsed > this.maxMemoryBytes) {
        const keysToDelete = Array.from(this.cache.keys()).slice(0, Math.floor(this.cache.size / 2));
        keysToDelete.forEach(key => this.delete(key));
      }
    }
  }

  get(key) {
    const item = this.cache.get(key);
    return item ? item.value : null;
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      memory: typeof process !== 'undefined' && process.memoryUsage 
        ? Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        : 0
    };
  }
}

// Create cache instance based on environment
let cache;
if (process.env.NODE_ENV === 'development') {
  // No-op cache for development
  cache = {
    set: () => {},
    get: () => null,
    has: () => false,
    delete: () => true,
    clear: () => {},
    size: () => 0,
    getStats: () => ({ size: 0, maxSize: 0, memory: 0 })
  };
} else {
  // Production cache with strict limits
  cache = new MemoryCache(20, 10);
}

export { cache };

// Cache utilities
export const cacheKeys = {
  tasks: (userId) => `tasks:${userId}`,
  users: () => 'users:all',
  userProfile: (userId) => `profile:${userId}`,
  analytics: (userId) => `analytics:${userId}`,
  activities: (userId) => `activities:${userId}`
};

// Cache wrapper for functions
export function withCache(key, fn, ttlMs = 1 * 60 * 1000) { // Reduced to 1 minute
  return async (...args) => {
    const cacheKey = typeof key === 'function' ? key(...args) : key;
    
    // Try cache first
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // Execute function and cache result
    const result = await fn(...args);
    
    // Only cache if result is not too large
    const resultSize = JSON.stringify(result).length;
    if (resultSize < 100000) { // Max 100KB per cache entry
      cache.set(cacheKey, result, ttlMs);
    }
    
    return result;
  };
}

// Cache invalidation helpers
export function invalidateCache(pattern) {
  if (!cache.cache || typeof cache.cache.keys !== 'function') {
    return 0;
  }
  const keys = Array.from(cache.cache.keys());
  const toDelete = keys.filter(key => 
    typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)
  );
  
  toDelete.forEach(key => cache.delete(key));
  return toDelete.length;
}

// Disable cache entirely in development to prevent memory issues
if (process.env.NODE_ENV === 'development') {
  cache.clear();
  
  // Override cache methods to be no-ops in development
  cache.set = () => {};
  cache.get = () => null;
  cache.has = () => false;
}