"use client";

import { useState } from 'react';
import { generateApiKey, revokeApiKey } from '@/lib/apiKeys';
import toast from 'react-hot-toast';

export default function ApiKeysClient({ initialKeys }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKey, setNewKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateApiKey();
      setNewKey(result.key);
      setKeys([...keys, { key_prefix: result.prefix, created_at: new Date(), revoked: false }]);
      toast.success('API key generated! Copy it now - you won\'t see it again.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (keyId) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    
    try {
      await revokeApiKey(keyId);
      setKeys(keys.map(k => k.id === keyId ? { ...k, revoked: true } : k));
      toast.success('API key revoked');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>API Keys</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Manage API keys for programmatic access. Requires Professional or Enterprise plan.
      </p>

      {newKey && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>⚠️ Save your API key</h3>
          <p style={{ fontSize: '14px', marginBottom: '12px', color: '#92400e' }}>
            Copy this key now. You won't be able to see it again!
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <code style={{
              flex: 1,
              background: 'white',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {newKey}
            </code>
            <button
              onClick={() => copyToClipboard(newKey)}
              style={{
                padding: '12px 20px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #d97706',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            I've saved it
          </button>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: '12px 24px',
          background: loading ? '#9ca3af' : '#4f46e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          marginBottom: '24px'
        }}
      >
        {loading ? 'Generating...' : '+ Generate New Key'}
      </button>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {keys.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No API keys yet. Generate one to get started.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Key</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Last Used</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Created</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px' }}>
                    {key.key_prefix}...
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: key.revoked ? '#fee2e2' : '#d1fae5',
                      color: key.revoked ? '#991b1b' : '#065f46'
                    }}>
                      {key.revoked ? 'Revoked' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {!key.revoked && (
                      <button
                        onClick={() => handleRevoke(key.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: '32px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>📖 API Documentation</h3>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          Include your API key in the <code>x-api-key</code> header:
        </p>
        <code style={{
          display: 'block',
          background: 'white',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontFamily: 'monospace'
        }}>
          curl -H "x-api-key: YOUR_API_KEY" https://nexboard.me/api/v1/tasks
        </code>
      </div>
    </div>
  );
}
