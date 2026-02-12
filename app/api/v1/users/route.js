import { NextResponse } from 'next/server';
import { apiAuth, checkRateLimit, rateLimitHeaders } from '@/lib/apiAuth';

export async function GET(request) {
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { supabase, profile, orgId } = authResult;
  const rateLimit = await checkRateLimit(profile.id);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }
  
  const { data, error } = await supabase
    .from('org_members')
    .select(`
      user_id,
      role,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('org_id', orgId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }

  const users = data.map(m => ({
    id: m.profiles.id,
    full_name: m.profiles.full_name,
    email: m.profiles.email,
    avatar_url: m.profiles.avatar_url,
    role: m.role
  }));

  return NextResponse.json(
    { users },
    { headers: rateLimitHeaders(rateLimit) }
  );
}
