import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { apiRateLimit } from '@/lib/rateLimit';
import { withPerformanceTracking } from '@/lib/performance';

const trackedGetTasks = withPerformanceTracking('/api/tasks', async (supabase, userId) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("created_by", userId)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
});

export async function GET(request) {
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

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await trackedGetTasks(supabase, user.id);
    
    return Response.json(data, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'Cache-Control': 'private, max-age=60'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const rateLimitResult = apiRateLimit(request);
  if (!rateLimitResult.success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
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

  return Response.json({ success: true });
}