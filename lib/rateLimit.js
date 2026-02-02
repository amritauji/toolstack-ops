// Rate limiting utility
const rateLimitMap = new Map();

export function rateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    keyGenerator = (req) => req.ip || 'anonymous'
  } = options;

  return (req) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit data for this key
    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, []);
    }

    const requests = rateLimitMap.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => time > windowStart);
    rateLimitMap.set(key, validRequests);

    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        resetTime: new Date(validRequests[0] + windowMs)
      };
    }

    // Add current request
    validRequests.push(now);
    rateLimitMap.set(key, validRequests);

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - validRequests.length,
      resetTime: new Date(now + windowMs)
    };
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  const cutoff = now - (60 * 60 * 1000); // 1 hour ago
  
  for (const [key, requests] of rateLimitMap.entries()) {
    const validRequests = requests.filter(time => time > cutoff);
    if (validRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, validRequests);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  maxRequests: 5 // Stricter for auth endpoints
});