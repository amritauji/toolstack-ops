import { createSupabaseServer } from '@/lib/supabaseServer';
import { getPaymentHistory } from '@/lib/razorpay';
import BillingClient from './BillingClient';

export const metadata = {
  title: 'Billing | NexBoard',
  description: 'Manage your subscription and billing'
};

export default async function BillingPage() {
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
  
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', profile.current_org_id)
    .eq('user_id', user.id)
    .single();
  
  const payments = await getPaymentHistory(profile.current_org_id);
  
  return <BillingClient org={org} userRole={membership?.role} payments={payments} />;
}
