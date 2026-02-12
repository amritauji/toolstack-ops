"use client";

import { useState } from 'react';
import { inviteToOrganization, removeOrganizationMember } from '@/lib/organizations';
import toast from 'react-hot-toast';

export default function OrganizationClient({ org, members, userRole }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const canManage = ['owner', 'admin'].includes(userRole);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setLoading(true);
    try {
      await inviteToOrganization(org.id, inviteEmail, inviteRole);
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!confirm('Remove this member?')) return;
    
    try {
      await removeOrganizationMember(org.id, memberId);
      toast.success('Member removed');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Organization Settings</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Manage your organization and team members</p>

      {/* Organization Info */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Organization Details</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Name</label>
            <div style={{ fontSize: '16px', fontWeight: '500' }}>{org.name}</div>
          </div>
          <div>
            <label style={{ fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Plan</label>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              background: org.plan === 'free' ? '#f3f4f6' : org.plan === 'professional' ? '#dbeafe' : '#fef3c7',
              color: org.plan === 'free' ? '#374151' : org.plan === 'professional' ? '#1e40af' : '#92400e'
            }}>
              {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Invite Members */}
      {canManage && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Invite Members</h2>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                background: loading ? '#9ca3af' : '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>
      )}

      {/* Members List */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Members ({members.length})</h2>
        </div>
        <div>
          {members.map(member => (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #f3f4f6'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {member.profiles?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{member.profiles?.full_name || 'User'}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{member.profiles?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: member.role === 'owner' ? '#fef3c7' : member.role === 'admin' ? '#dbeafe' : '#f3f4f6',
                  color: member.role === 'owner' ? '#92400e' : member.role === 'admin' ? '#1e40af' : '#374151'
                }}>
                  {member.role}
                </span>
                {canManage && member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(member.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
