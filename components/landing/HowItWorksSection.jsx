export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Create your workspace',
      description: 'Set up your team workspace in under 2 minutes with our guided onboarding.',
      icon: '🏗️'
    },
    {
      number: '02',
      title: 'Assign roles & tasks',
      description: 'Define team roles and create tasks with priorities, due dates, and assignments.',
      icon: '👥'
    },
    {
      number: '03',
      title: 'Track progress in real time',
      description: 'Monitor work flow through your Kanban board with live updates and notifications.',
      icon: '📊'
    }
  ];

  return (
    <section style={{
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
            Get started in 3 simple steps
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            From setup to shipping, ToolStack Ops makes project management effortless.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px'
          }}>
            {steps.map((step, index) => (
              <div key={index} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                {/* Step Number */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  background: '#4f46e5',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  position: 'relative',
                  zIndex: 10
                }}>
                  {step.number}
                </div>
                
                {/* Icon */}
                <div style={{
                  fontSize: '80px',
                  marginBottom: '24px'
                }}>{step.icon}</div>
                
                {/* Content */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px'
                }}>{step.title}</h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '320px',
                  margin: '0 auto'
                }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}