"use client";

import Link from 'next/link';

export default function ComingSoon() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '72px', margin: '0 0 20px 0' }}>🚧</h1>
        <h2 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 16px 0' }}>Coming Soon</h2>
        <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px' }}>
          We're working hard to bring you this page. Check back soon!
        </p>
        <Link href="/" style={{
          display: 'inline-block',
          background: 'white',
          color: '#667eea',
          padding: '12px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
