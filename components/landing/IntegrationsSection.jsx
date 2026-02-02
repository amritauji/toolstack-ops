"use client";

import Link from 'next/link';

export default function IntegrationsSection() {
  const integrations = [
    { name: 'Slack', logo: '💬', category: 'Communication' },
    { name: 'GitHub', logo: '🐙', category: 'Development' },
    { name: 'Google Drive', logo: '📁', category: 'Storage' },
    { name: 'Figma', logo: '🎨', category: 'Design' },
    { name: 'Zoom', logo: '📹', category: 'Video' },
    { name: 'Salesforce', logo: '☁️', category: 'CRM' },
    { name: 'Jira', logo: '🔧', category: 'Development' },
    { name: 'Dropbox', logo: '📦', category: 'Storage' }
  ];

  const categories = ['All', 'Communication', 'Development', 'Storage', 'Design', 'Video', 'CRM'];

  return (
    <section style={{
      padding: '120px 0',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            Connect your entire
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              tech stack
            </span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Seamlessly integrate with 200+ tools your team already uses. No more context switching, no more data silos.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                style={{
                  padding: '8px 20px',
                  borderRadius: '24px',
                  border: '1px solid #e5e7eb',
                  background: category === 'All' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                  color: category === 'All' ? 'white' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (category !== 'All') {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (category !== 'All') {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          {integrations.map((integration, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                e.target.style.borderColor = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea20, #764ba220)',
                borderRadius: '0 16px 0 60px'
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f8faff 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {integration.logo}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    {integration.name}
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {integration.category}
                  </span>
                </div>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Sync data and automate workflows with {integration.name} integration.
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          padding: '60px 40px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(60px)'
          }} />
          
          <h3 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            Don't see your tool?
          </h3>
          <p style={{
            fontSize: '18px',
            marginBottom: '32px',
            opacity: 0.9,
            position: 'relative',
            zIndex: 1
          }}>
            We're constantly adding new integrations. Request yours or build custom connections with our API.
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}>
            <Link href="/integrations" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
            >
              Browse All Integrations
            </Link>
            
            <Link href="/api-docs" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'white',
              color: '#667eea',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              API Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}