import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Database check
    const dbStart = Date.now();
    const supabase = await createSupabaseServer();
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
    checks.checks.database = {
      status: dbError ? 'unhealthy' : 'healthy',
      responseTime: Date.now() - dbStart,
      error: dbError?.message
    };

    // Redis check (if configured)
    if (process.env.UPSTASH_REDIS_URL) {
      const redisStart = Date.now();
      try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_URL,
          token: process.env.UPSTASH_REDIS_TOKEN
        });
        await redis.ping();
        checks.checks.redis = {
          status: 'healthy',
          responseTime: Date.now() - redisStart
        };
      } catch (redisError) {
        checks.checks.redis = {
          status: 'unhealthy',
          responseTime: Date.now() - redisStart,
          error: redisError.message
        };
      }
    }

    // Memory check
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const mem = process.memoryUsage();
      checks.checks.memory = {
        status: 'healthy',
        heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(mem.rss / 1024 / 1024)}MB`
      };
    }

    // Overall status
    const hasUnhealthy = Object.values(checks.checks).some(c => c.status === 'unhealthy');
    checks.status = hasUnhealthy ? 'degraded' : 'healthy';
    checks.responseTime = Date.now() - startTime;

    return NextResponse.json(checks, { 
      status: hasUnhealthy ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      responseTime: Date.now() - startTime
    }, { status: 503 });
  }
}
