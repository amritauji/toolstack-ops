import { getUser } from "@/lib/getUser";
import { supabase } from "@/lib/supabaseClient";
import { apiRateLimit } from '@/lib/rateLimit';
import { withPerformanceTracking } from '@/lib/performance';
import { withCache, cacheKeys } from '@/lib/cache';

const cachedGetTasks = withCache(
  (userId) => `${cacheKeys.tasks(userId)}`,
  async (userId) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  },
  2 * 60 * 1000 // 2 minutes
);

const trackedGetTasks = withPerformanceTracking('/api/tasks', cachedGetTasks);

export async function GET(request) {
  // Rate limiting
  const rateLimitResult = apiRateLimit(request);
  if (!rateLimitResult.success) {
    return Response.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toISOString()
        }
      }
    );
  }

  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await trackedGetTasks(user.id);
    
    return Response.json(data, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'Cache-Control': 'public, max-age=120'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  // Rate limiting
  const rateLimitResult = apiRateLimit(request);
  if (!rateLimitResult.success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { error } = await supabase.from("tasks").insert({
    title: body.title,
    assigned_to: body.assigned_to || null,
    status: "todo",
    created_by: user.id,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Invalidate cache
  const { invalidateCache } = await import('@/lib/cache');
  invalidateCache('tasks:');

  return Response.json({ success: true });
}