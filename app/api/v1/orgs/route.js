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
    .from('organizations')
    .select('id, name, plan, created_at')
    .eq('id', orgId)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }

  return NextResponse.json(
    { organization: data },
    { headers: rateLimitHeaders(rateLimit) }
  );
}
