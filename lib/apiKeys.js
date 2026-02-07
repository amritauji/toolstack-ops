'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';
import { randomBytes } from 'crypto';

export async function generateApiKey() {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();
  
  // Check if plan allows API access
  if (profile?.plan !== 'professional' && profile?.plan !== 'enterprise') {
    throw new Error('API access requires Professional or Enterprise plan');
  }
  
  // Generate API key: user_id:random_token
  const token = randomBytes(24).toString('base64')
    .replace(/\//g, '_')
    .replace(/\+/g, '-');
  
  const apiKey = `${user.id}:${token}`;
  
  // Save API key
  const { error } = await supabase
    .from('profiles')
    .update({ api_key: apiKey })
    .eq('id', user.id);
  
  if (error) throw new Error('Failed to generate API key');
  
  return apiKey;
}

export async function revokeApiKey() {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('profiles')
    .update({ api_key: null })
    .eq('id', user.id);
  
  if (error) throw new Error('Failed to revoke API key');
  
  return true;
}

export async function getApiKey() {
  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('api_key, plan')
    .eq('id', user.id)
    .single();
  
  return profile;
}
