import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { apiRateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  try {
    const rateLimitResult = apiRateLimit(request);
    if (!rateLimitResult.success) {
      return Response.json({ error: 'Too many requests' }, { status: 429 });
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
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, username, email, avatar_url, role, last_login")
      .eq("id", user.id)
      .single();

    return Response.json(data);
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}