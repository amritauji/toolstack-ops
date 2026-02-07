import { createSupabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

export async function apiAuth(request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key required. Include x-api-key header.' },
      { status: 401 }
    );
  }

  // Verify API key format (should be: user_id:random_token)
  const [userId, token] = apiKey.split(':');
  
  if (!userId || !token) {
    return NextResponse.json(
      { error: 'Invalid API key format' },
      { status: 401 }
    );
  }

  const supabase = await createSupabaseServer();
  
  // Verify user exists and get their plan
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, plan, api_key')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  // Check if API key matches
  if (profile.api_key !== apiKey) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    );
  }

  // Check if plan allows API access (Professional or Enterprise only)
  if (profile.plan !== 'professional' && profile.plan !== 'enterprise') {
    return NextResponse.json(
      { error: 'API access requires Professional or Enterprise plan' },
      { status: 403 }
    );
  }

  return { profile, supabase };
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
