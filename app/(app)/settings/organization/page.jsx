import { getOrganizationMembers } from '@/lib/organizations';
import { createSupabaseServer } from '@/lib/supabaseServer';
import OrganizationClient from './OrganizationClient';

export const metadata = {
  title: 'Organization Settings | NexBoard',
  description: 'Manage your organization'
};

export default async function OrganizationPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_org_id')
    .eq('id', user.id)
    .single();
  
  if (!profile?.current_org_id) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No organization selected</div>;
  }
  
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.current_org_id)
    .single();
  
  const members = await getOrganizationMembers(profile.current_org_id);
  
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', profile.current_org_id)
    .eq('user_id', user.id)
    .single();
  
  return <OrganizationClient org={org} members={members} userRole={membership?.role} />;
}
