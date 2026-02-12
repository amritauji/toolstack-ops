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
    .from('projects')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }

  return NextResponse.json(
    { projects: data },
    { headers: rateLimitHeaders(rateLimit) }
  );
}

export async function POST(request) {
  const authResult = await apiAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const { supabase, profile, orgId } = authResult;
  const rateLimit = await checkRateLimit(profile.id, 50);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: rateLimitHeaders(rateLimit) }
    );
  }

  const body = await request.json();
  const { name, description, status } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400, headers: rateLimitHeaders(rateLimit) }
    );
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      org_id: orgId,
      name,
      description,
      status: status || 'active',
      created_by: profile.id
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: rateLimitHeaders(rateLimit) }
    );
  }

  return NextResponse.json(
    { project: data },
    { status: 201, headers: rateLimitHeaders(rateLimit) }
  );
}
