"use client";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: '🔒',
      title: 'Enterprise-Grade Security',
      description: 'SOC 2 Type II certified with end-to-end encryption and advanced threat protection.'
    },
    {
      icon: '🛡️',
      title: 'Data Privacy',
      description: 'GDPR and CCPA compliant. Your data stays yours, always. We never sell or share your information.'
    },
    {
      icon: '🔐',
      title: 'Access Control',
      description: 'Granular permissions, SSO integration, and multi-factor authentication for complete control.'
    },
    {
      icon: '📊',
      title: 'Audit Trails',
      description: 'Complete activity logs and audit trails for compliance and security monitoring.'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', logo: '🏆' },
    { name: 'ISO 27001', logo: '🔒' },
    { name: 'GDPR Compliant', logo: '🇪🇺' },
    { name: 'CCPA Compliant', logo: '🇺🇸' }
  ];

  return (
    <section style={{
      padding: '120px 0',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Security you can
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              trust completely
            </span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#a1a1aa',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Built with enterprise-grade security from day one. Your data is protected by the same standards used by Fortune 500 companies.
          </p>
        </div>

        {/* Security Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '40px 32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '24px'
              }}>
                {feature.icon}
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
                color: 'white'
              }}>
                {feature.title}
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: '#a1a1aa',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '40px',
            color: '#d1d5db'
          }}>
            Trusted by enterprises worldwide
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            {certifications.map((cert, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span style={{ fontSize: '24px' }}>{cert.logo}</span>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#e5e7eb'
                }}>
                  {cert.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              99.9%
            </div>
            <div style={{
              fontSize: '16px',
              color: '#a1a1aa'
            }}>
              Uptime SLA
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              256-bit
            </div>
            <div style={{
              fontSize: '16px',
              color: '#a1a1aa'
            }}>
              AES Encryption
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              24/7
            </div>
            <div style={{
              fontSize: '16px',
              color: '#a1a1aa'
            }}>
              Security Monitoring
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              0
            </div>
            <div style={{
              fontSize: '16px',
              color: '#a1a1aa'
            }}>
              Data Breaches
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}