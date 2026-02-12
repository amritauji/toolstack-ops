'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';

export async function generateApiKey(name = 'API Key') {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_org_id) throw new Error('No organization selected');

  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', profile.current_org_id)
    .single();
  
  if (org?.plan !== 'professional' && org?.plan !== 'enterprise') {
    throw new Error('API access requires Professional or Enterprise plan');
  }
  
  const key = `nbk_${randomBytes(32).toString('hex')}`;
  const keyHash = await bcrypt.hash(key, 10);
  const keyPrefix = key.substring(0, 12);
  
  const { error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      org_id: profile.current_org_id,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      name: name
    });
  
  if (error) throw new Error('Failed to generate API key: ' + error.message);
  
  return { key, prefix: keyPrefix };
}

export async function revokeApiKey(keyId) {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('api_keys')
    .update({ revoked: true })
    .eq('id', keyId)
    .eq('user_id', user.id);
  
  if (error) throw new Error('Failed to revoke API key');
  
  return true;
}

export async function getApiKeys() {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: keys, error } = await supabase
    .from('api_keys')
    .select('id, key_prefix, name, last_used_at, revoked, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw new Error('Failed to fetch API keys');
  
  return keys || [];
}

export async function validateApiKey(key) {
  const supabase = await createSupabaseServer();
  
  // Get all active API keys
  const { data: keys } = await supabase
    .from('api_keys')
    .select('id, user_id, key_hash')
    .eq('revoked', false);
  
  if (!keys) return null;
  
  // Check each key hash
  for (const apiKey of keys) {
    const isValid = await bcrypt.compare(key, apiKey.key_hash);
    if (isValid) {
      // Update last used timestamp
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', apiKey.id);
      
      return { id: apiKey.id, user_id: apiKey.user_id };
    }
  }
  
  return null;
}

export async function logApiKeyUsage(keyId, endpoint, method, statusCode, ipAddress, userAgent, responseTime) {
  const supabase = await createSupabaseServer();
  
  await supabase.from('api_key_usage').insert({
    api_key_id: keyId,
    endpoint,
    method,
    status_code: statusCode,
    ip_address: ipAddress,
    user_agent: userAgent,
    response_time_ms: responseTime
  });
}
