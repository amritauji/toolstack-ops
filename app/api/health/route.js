import { healthCheck } from '@/lib/monitoring';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const health = await healthCheck();
    
    const status = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, { status });
  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error.message
      },
      { status: 503 }
    );
  }
}