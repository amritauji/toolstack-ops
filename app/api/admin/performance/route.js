import { performanceTracker } from '@/lib/performance';
import { cache } from '@/lib/cache';
import { jobQueue } from '@/lib/jobQueue';
import { getUser } from '@/lib/getUser';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const dashboard = performanceTracker.getDashboard();
  const cacheStats = cache.getStats();
  const queueStats = jobQueue.getStats();

  return NextResponse.json({
    performance: dashboard,
    cache: cacheStats,
    queue: queueStats,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid
    }
  });
}