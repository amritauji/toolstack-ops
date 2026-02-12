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

  await logApiKeyUsage(validation.keyId, '/api/v1/orgs', 'GET');

  const supabase = await createSupabaseServer();
  
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, plan, created_at')
    .eq('id', validation.orgId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organization: data });
}
