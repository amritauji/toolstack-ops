import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #7c3aed 100%)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1024px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Start managing work the right way
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#c7d2fe',
            marginBottom: '48px',
            maxWidth: '512px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Join thousands of teams who ship faster with ToolStack Ops. 
            Get started in minutes, no credit card required.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Link 
              href="/signup"
              style={{
                background: 'white',
                color: '#1e1b4b',
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '18px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease',
                minWidth: '200px',
                display: 'inline-block'
              }}
            >
              Get Started Free
            </Link>
            <button style={{
              border: '2px solid white',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '8px',
              background: 'transparent',
              fontWeight: '600',
              fontSize: '18px',
              minWidth: '200px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Contact Sales
            </button>
          </div>

          {/* Trust Indicators */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            color: '#c7d2fe'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg style={{
                width: '20px',
                height: '20px'
              }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free 14-day trial</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg style={{
                width: '20px',
                height: '20px'
              }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg style={{
                width: '20px',
                height: '20px'
              }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}