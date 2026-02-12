"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvite } from '@/lib/organizations';
import toast from 'react-hot-toast';

export default function InviteAcceptClient({ invite, token }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptInvite(token);
      toast.success('Invitation accepted!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to accept invitation');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f7fa'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
          You&apos;re Invited!
        </h1>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          You&apos;ve been invited to join <strong>{invite.organizations.name}</strong> as a <strong>{invite.role}</strong>.
        </p>
        <div style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <p style={{ fontSize: '14px', color: '#475569' }}>
            <strong>Email:</strong> {invite.email}
          </p>
          <p style={{ fontSize: '14px', color: '#475569', marginTop: '8px' }}>
            <strong>Role:</strong> {invite.role}
          </p>
        </div>
        <button
          onClick={handleAccept}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Accepting...' : 'Accept Invitation'}
        </button>
      </div>
    </div>
  );
}
