import { createSupabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import InviteAcceptClient from './InviteAcceptClient';

export default async function InvitePage({ searchParams }) {
  const { token } = searchParams;

  if (!token) {
    redirect('/login');
  }

  const supabase = await createSupabaseServer();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=/invite?token=${token}`);
  }

  const { data: invite, error } = await supabase
    .from('org_invites')
    .select(`
      id,
      email,
      role,
      organizations:org_id (
        id,
        name
      )
    `)
    .eq('token', token)
    .eq('status', 'pending')
    .single();

  if (error || !invite) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Invalid Invite</h1>
        <p style={{ color: '#64748b' }}>This invitation link is invalid or has expired.</p>
      </div>
    );
  }

  return <InviteAcceptClient invite={invite} token={token} />;
}
