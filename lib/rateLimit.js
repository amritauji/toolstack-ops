import { Redis } from '@upstash/redis';

// Initialize Redis client (falls back to in-memory if not configured)
let redis = null;

if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN
  });
}

// Fallback in-memory store for development
const memoryStore = new Map();

export async function rateLimit(identifier, options = {}) {
  const {
    limit = 100,
    window = 900 // 15 minutes in seconds
  } = options;

  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = window * 1000;

  if (redis) {
    // Use Redis for production
    try {
      const windowStart = now - windowMs;
      
      // Remove old entries
      await redis.zremrangebyscore(key, 0, windowStart);
      
      // Count requests in window
      const count = await redis.zcard(key);
      
      if (count >= limit) {
        const oldestEntry = await redis.zrange(key, 0, 0, { withScores: true });
        const resetTime = oldestEntry[0]?.score ? oldestEntry[0].score + windowMs : now + windowMs;
        
        return {
          success: false,
          limit,
          remaining: 0,
          resetTime: new Date(resetTime)
        };
      }
      
      // Add current request
      await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
      await redis.expire(key, window);
      
      return {
        success: true,
        limit,
        remaining: limit - count - 1,
        resetTime: new Date(now + windowMs)
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Fall through to memory store
    }
  }

  // Fallback to in-memory (development only)
  const userData = memoryStore.get(key) || { requests: [], resetTime: now + windowMs };
  
  // Remove old requests
  userData.requests = userData.requests.filter(time => time > now - windowMs);
  
  if (userData.requests.length >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: new Date(userData.resetTime)
    };
  }
  
  userData.requests.push(now);
  memoryStore.set(key, userData);
  
  return {
    success: true,
    limit,
    remaining: limit - userData.requests.length,
    resetTime: new Date(now + windowMs)
  };
}

// Cleanup old entries periodically (memory store only)
if (!redis) {
  setInterval(() => {
    const now = Date.now();
    const cutoff = now - (60 * 60 * 1000);
    
    for (const [key, data] of memoryStore.entries()) {
      data.requests = data.requests.filter(time => time > cutoff);
      if (data.requests.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export const apiRateLimit = (req) => rateLimit(
  req.headers?.get?.('x-forwarded-for')?.split(',')[0] || 
  req.headers?.get?.('x-real-ip') || 
  'anonymous',
  { limit: 100, window: 900 }
);

export const authRateLimit = (req) => rateLimit(
  req.headers?.get?.('x-forwarded-for')?.split(',')[0] || 
  req.headers?.get?.('x-real-ip') || 
  'anonymous',
  { limit: 5, window: 900 }
);