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

  await logApiKeyUsage(validation.keyId, '/api/v1/users', 'GET');

  const supabase = await createSupabaseServer();
  
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
    .eq('org_id', validation.orgId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = data.map(m => ({
    id: m.profiles.id,
    full_name: m.profiles.full_name,
    email: m.profiles.email,
    avatar_url: m.profiles.avatar_url,
    role: m.role
  }));

  return NextResponse.json({ users });
}
