export default function FeaturesSection() {
  const features = [
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
      title: 'Role-Based Access',
      description: 'Admin, Developer, and User roles with granular permissions for secure team collaboration.'
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>,
      title: 'Kanban Task Management',
      description: 'Visual workflow boards with drag-and-drop functionality to track work from start to finish.'
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
      title: 'Real-time Updates',
      description: 'Instant synchronization across all devices so your team stays aligned and informed.'
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security powered by Supabase with email verification and data protection.'
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.25l1.41-1.41L19.5 16.43 18.09 15l1.41-1.41 1.41 1.41L22.32 13.59 20.91 12.18l1.41-1.41L24 12.18V21c0 .55-.45 1-1 1h-8.82l1.41-1.41 1.41 1.41z"/></svg>,
      title: 'Activity Logs',
      description: 'Complete audit trail of all actions and changes for transparency and accountability.'
    },
    {
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="#4f46e5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      title: 'Priority & Due Dates',
      description: 'Smart task prioritization with deadline tracking to keep projects on schedule.'
    }
  ];

  return (
    <section id="features" style={{
      padding: '80px 0',
      background: '#f9fafb'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '64px'
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Everything you need to ship faster
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            Powerful features designed for modern teams who value clarity, control, and speed.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'box-shadow 0.2s ease'
            }}>
              <div style={{
                marginBottom: '16px'
              }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px'
              }}>{feature.title}</h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6'
              }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}