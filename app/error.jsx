'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.icon}>⚠️</div>
        <h1 style={styles.title}>Something went wrong</h1>
        <p style={styles.text}>
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <div style={styles.buttons}>
          <button onClick={reset} style={styles.primaryButton}>
            Try Again
          </button>
          <button onClick={() => window.location.href = '/dashboard'} style={styles.secondaryButton}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '24px'
  },
  content: {
    textAlign: 'center',
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '16px'
  },
  text: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    lineHeight: '1.6'
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  primaryButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  secondaryButton: {
    padding: '12px 24px',
    background: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};
