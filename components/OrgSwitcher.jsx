"use client";

import { useState, useEffect, useRef } from 'react';
import { getUserOrganizations, switchOrganization, createOrganization } from '@/lib/organizations';
import toast from 'react-hot-toast';

export default function OrgSwitcher({ currentOrgId }) {
  const [orgs, setOrgs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadOrgs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOrgs = async () => {
    const data = await getUserOrganizations();
    setOrgs(data);
  };

  const handleSwitch = async (orgId) => {
    try {
      await switchOrganization(orgId);
      toast.success('Switched organization');
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    
    setLoading(true);
    try {
      await createOrganization(newOrgName);
      toast.success('Organization created');
      setNewOrgName('');
      setShowCreate(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentOrg = orgs.find(o => o.id === currentOrgId);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: '#f3f4f6',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <span>{currentOrg?.name || 'Select Organization'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '8px',
          minWidth: '250px',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '8px' }}>
            {orgs.map(org => (
              <button
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: org.id === currentOrgId ? '#f3f4f6' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600' }}>{org.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{org.role}</div>
                </div>
                {org.id === currentOrgId && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', padding: '8px' }}>
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4f46e5',
                  textAlign: 'left'
                }}
              >
                + Create Organization
              </button>
            ) : (
              <form onSubmit={handleCreate} style={{ padding: '4px' }}>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Organization name"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    style={{
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
