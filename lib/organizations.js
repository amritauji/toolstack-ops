'use server';

import { createSupabaseServer } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function createOrganization(name) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Generate slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
  
  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name, slug, plan: 'free' })
    .select()
    .single();
  
  if (orgError) throw new Error(orgError.message);
  
  // Add user as owner
  const { error: memberError } = await supabase
    .from('org_members')
    .insert({ org_id: org.id, user_id: user.id, role: 'owner' });
  
  if (memberError) throw new Error(memberError.message);
  
  // Set as current org
  await supabase
    .from('profiles')
    .update({ current_org_id: org.id })
    .eq('id', user.id);
  
  revalidatePath('/');
  return org;
}

export async function getUserOrganizations() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data: memberships } = await supabase
    .from('org_members')
    .select('role, organizations(*)')
    .eq('user_id', user.id);
  
  return memberships?.map(m => ({ ...m.organizations, role: m.role })) || [];
}

export async function switchOrganization(orgId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Verify user is member
  const { data: membership } = await supabase
    .from('org_members')
    .select('id')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();
  
  if (!membership) throw new Error('Not a member of this organization');
  
  await supabase
    .from('profiles')
    .update({ current_org_id: orgId })
    .eq('id', user.id);
  
  revalidatePath('/');
  return true;
}

export async function inviteToOrganization(orgId, email, role = 'member') {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user is admin/owner
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();
  
  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Insufficient permissions');
  }
  
  // Create invite
  const { data: invite, error } = await supabase
    .from('org_invites')
    .insert({
      org_id: orgId,
      email,
      role,
      invited_by: user.id
    })
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  // Send invite email
  const { sendInviteEmail } = await import('./email');
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();
  
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', orgId)
    .single();
  
  await sendInviteEmail(
    email, 
    invite.token, 
    org?.name || 'Organization',
    profile?.full_name || 'Someone'
  );
  
  revalidatePath(`/settings/organization`);
  return invite;
}

export async function acceptInvite(token) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Get invite
  const { data: invite, error: inviteError } = await supabase
    .from('org_invites')
    .select('*, organizations(*)')
    .eq('token', token)
    .eq('status', 'pending')
    .single();
  
  if (inviteError || !invite) throw new Error('Invalid or expired invite');
  
  // Check expiration
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    throw new Error('Invite has expired');
  }
  
  // Add user to org
  const { error: memberError } = await supabase
    .from('org_members')
    .insert({
      org_id: invite.org_id,
      user_id: user.id,
      role: invite.role,
      invited_by: invite.invited_by
    });
  
  if (memberError) throw new Error(memberError.message);
  
  // Mark invite as accepted
  await supabase
    .from('org_invites')
    .update({ 
      status: 'accepted',
      accepted_at: new Date().toISOString() 
    })
    .eq('id', invite.id);
  
  // Switch to new org
  await switchOrganization(invite.org_id);
  
  // Send welcome notification
  const { createNotification } = await import('./notifications');
  await createNotification(
    user.id,
    invite.org_id,
    'org_joined',
    `Welcome to ${invite.organizations.name}!`,
    'You have successfully joined the organization.',
    null,
    null
  );
  
  return invite.organizations;
}

export async function getOrganizationMembers(orgId) {
  const supabase = await createSupabaseServer();
  
  const { data: members } = await supabase
    .from('org_members')
    .select('id, role, joined_at, profiles(id, full_name, email, avatar_url)')
    .eq('org_id', orgId)
    .order('joined_at', { ascending: false });
  
  return members || [];
}

export async function removeOrganizationMember(orgId, memberId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user is admin/owner
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();
  
  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    throw new Error('Insufficient permissions');
  }
  
  const { error } = await supabase
    .from('org_members')
    .delete()
    .eq('id', memberId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath(`/settings/organization`);
  return true;
}
