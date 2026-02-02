'use client'

export default function Error({ error, reset }) {
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
        padding: 32,
        maxWidth: 500,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16
        }}>
          ⚠️
        </div>
        
        <h2 style={{
          fontSize: 20,
          fontWeight: 600,
          color: '#dc2626',
          marginBottom: 12
        }}>
          Something went wrong
        </h2>
        
        <p style={{
          color: '#6b7280',
          fontSize: 14,
          marginBottom: 24,
          lineHeight: 1.5
        }}>
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details style={{
            background: '#f3f4f6',
            padding: 12,
            borderRadius: 4,
            marginBottom: 24,
            textAlign: 'left'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
              Error Details
            </summary>
            <pre style={{
              fontSize: 12,
              color: '#dc2626',
              marginTop: 8,
              whiteSpace: 'pre-wrap'
            }}>
              {error.message}
            </pre>
          </details>
        )}
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}