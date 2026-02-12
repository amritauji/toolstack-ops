import { createSupabaseServer } from '@/lib/supabaseServer';
import { validateApiKey, logApiKeyUsage } from '@/lib/apiKeys';
import { NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

export async function apiAuth(request) {
  const startTime = Date.now();
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key required. Include x-api-key header.' },
      { status: 401 }
    );
  }

  // Validate API key with bcrypt
  const keyData = await validateApiKey(apiKey);
  
  if (!keyData) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  const supabase = await createSupabaseServer();
  
  // Get user profile and plan
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, plan')
    .eq('id', keyData.user_id)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 401 }
    );
  }

  // Check if plan allows API access
  if (profile.plan !== 'professional' && profile.plan !== 'enterprise') {
    return NextResponse.json(
      { error: 'API access requires Professional or Enterprise plan' },
      { status: 403 }
    );
  }

  // Log API key usage (async, don't wait)
  const endpoint = new URL(request.url).pathname;
  const method = request.method;
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  logApiKeyUsage(
    keyData.id,
    endpoint,
    method,
    null, // status code will be set later
    ipAddress,
    userAgent,
    Date.now() - startTime
  ).catch(console.error);

  return { profile, supabase, apiKeyId: keyData.id };
}

export async function checkRateLimit(userId, limit = 100) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  
  const userKey = `api_${userId}`;
  const userData = rateLimitStore.get(userKey) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window expired
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + windowMs;
  }
  
  userData.count++;
  rateLimitStore.set(userKey, userData);
  
  if (userData.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userData.resetTime
    };
  }
  
  return {
    allowed: true,
    remaining: limit - userData.count,
    resetTime: userData.resetTime
  };
}

export function rateLimitHeaders(rateLimit) {
  return {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString()
  };
}
