export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Engineering Manager',
      company: 'TechFlow',
      review: 'ToolStack Ops simplified how our team tracks work. It\'s fast, clean, and reliable. We shipped 3 major features ahead of schedule.',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager',
      company: 'StartupLab',
      review: 'The role-based permissions are perfect for our growing team. Everyone knows exactly what they need to work on.',
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Watson',
      role: 'CTO',
      company: 'DevCorp',
      review: 'Real-time updates keep our remote team synchronized. The activity logs provide great visibility into project progress.',
      avatar: '👩‍🔬'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      company: 'CodeBase',
      review: 'Finally, a project management tool that doesn\'t get in the way. The Kanban board is intuitive and the performance is excellent.',
      avatar: '👨‍💻'
    }
  ];

  return (
    <section id="reviews" style={{
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
            Loved by teams worldwide
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '768px',
            margin: '0 auto'
          }}>
            See what teams are saying about ToolStack Ops and how it's transformed their workflow.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '32px'
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'box-shadow 0.2s ease'
            }}>
              {/* Quote */}
              <div style={{ marginBottom: '24px' }}>
                <svg style={{
                  width: '32px',
                  height: '32px',
                  color: '#4f46e5',
                  marginBottom: '16px'
                }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{
                  color: '#374151',
                  fontSize: '18px',
                  lineHeight: '1.6'
                }}>"{testimonial.review}"</p>
              </div>

              {/* Author */}
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#f0f4ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  marginRight: '16px'
                }}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#111827'
                  }}>{testimonial.name}</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Summary */}
        <div style={{
          textAlign: 'center',
          marginTop: '64px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '16px'
          }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} style={{
                width: '24px',
                height: '24px',
                color: '#fbbf24'
              }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p style={{ color: '#6b7280' }}>
            <span style={{
              fontWeight: '600',
              color: '#111827'
            }}>4.9/5</span> from 200+ reviews
          </p>
        </div>
      </div>
    </section>
  );
}