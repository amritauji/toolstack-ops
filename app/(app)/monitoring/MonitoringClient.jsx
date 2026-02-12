"use client";

import { useState, useEffect } from 'react';

export default function MonitoringClient() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      setHealth({ status: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    if (autoRefresh) {
      const interval = setInterval(fetchHealth, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'unhealthy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>System Monitoring</h1>
          <p style={{ color: '#6b7280' }}>Real-time health and performance metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (30s)
          </label>
          <button
            onClick={fetchHealth}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {health && (
        <>
          {/* Overall Status */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: `2px solid ${getStatusColor(health.status)}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: getStatusColor(health.status),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                {health.status === 'healthy' ? '✓' : health.status === 'degraded' ? '⚠' : '✗'}
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', textTransform: 'capitalize', marginBottom: '4px' }}>
                  {health.status}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Last checked: {new Date(health.timestamp).toLocaleString()}
                </p>
                {health.responseTime && (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Response time: {health.responseTime}ms
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Individual Checks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {health.checks && Object.entries(health.checks).map(([name, check]) => (
              <div
                key={name}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>{name}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: check.status === 'healthy' ? '#d1fae5' : '#fee2e2',
                    color: check.status === 'healthy' ? '#065f46' : '#991b1b'
                  }}>
                    {check.status}
                  </span>
                </div>
                {check.responseTime && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Response: {check.responseTime}ms
                  </p>
                )}
                {check.heapUsed && (
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    <p>Heap: {check.heapUsed} / {check.heapTotal}</p>
                    <p>RSS: {check.rss}</p>
                  </div>
                )}
                {check.error && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '8px', fontFamily: 'monospace' }}>
                    {check.error}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {loading && !health && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
          Loading health status...
        </div>
      )}
    </div>
  );
}
