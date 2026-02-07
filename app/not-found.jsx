'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.text}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/dashboard" style={styles.button}>
          Go to Dashboard
        </Link>
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px'
  },
  content: {
    textAlign: 'center',
    background: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '96px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '32px',
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
  button: {
    display: 'inline-block',
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  }
};
