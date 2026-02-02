import Link from 'next/link'
import { ROUTES } from '@/lib/routes'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#fafbfc',
      padding: 20
    }}>
      <div style={{
        background: 'white',
        borderRadius: 8,
        padding: 48,
        maxWidth: 500,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#dc2626',
          marginBottom: 16
        }}>
          404
        </div>
        
        <h1 style={{
          fontSize: 24,
          fontWeight: 600,
          color: '#374151',
          marginBottom: 12
        }}>
          Page Not Found
        </h1>
        
        <p style={{
          color: '#6b7280',
          fontSize: 16,
          marginBottom: 32,
          lineHeight: 1.5
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link
            href={ROUTES.DASHBOARD}
            style={{
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 6,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 500,
              display: 'inline-block'
            }}
          >
            Go to Dashboard
          </Link>
          
          <Link
            href={ROUTES.HOME}
            style={{
              background: 'white',
              color: '#374151',
              textDecoration: 'none',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              padding: '12px 24px',
              fontSize: 14,
              display: 'inline-block'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}