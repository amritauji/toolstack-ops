import { NextResponse } from 'next/server';
import { validateApiKey, logApiKeyUsage } from '@/lib/apiAuth';
import { createSupabaseServer } from '@/lib/supabaseServer';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!await rateLimit(ip, 60, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const apiKey = request.headers.get('x-api-key');
  const validation = await validateApiKey(apiKey);
  
  if (!validation.valid) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  await logApiKeyUsage(validation.keyId, '/api/v1/projects', 'GET');

  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('org_id', validation.orgId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!await rateLimit(ip, 30, 60000)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const apiKey = request.headers.get('x-api-key');
  const validation = await validateApiKey(apiKey);
  
  if (!validation.valid) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  await logApiKeyUsage(validation.keyId, '/api/v1/projects', 'POST');

  const body = await request.json();
  const { name, description, status } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      org_id: validation.orgId,
      name,
      description,
      status: status || 'active',
      created_by: validation.userId
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
