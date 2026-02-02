"use client";

import { useState, useEffect } from 'react';

export default function ModernTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "ToolStack transformed how our team collaborates. The intuitive interface and powerful features helped us increase productivity by 40% in just three months.",
      author: "Sarah Chen",
      role: "VP of Engineering",
      company: "TechFlow Inc.",
      avatar: "SC",
      rating: 5,
      metrics: "40% productivity increase"
    },
    {
      quote: "The automation features alone saved us 15 hours per week. ToolStack isn't just a tool, it's a game-changer for project management.",
      author: "Michael Rodriguez",
      role: "Project Manager",
      company: "Digital Dynamics",
      avatar: "MR",
      rating: 5,
      metrics: "15 hours saved weekly"
    },
    {
      quote: "We've tried every project management tool out there. ToolStack is the first one that actually adapts to our workflow instead of forcing us to change.",
      author: "Emily Watson",
      role: "Creative Director",
      company: "Design Studio Pro",
      avatar: "EW",
      rating: 5,
      metrics: "100% team adoption"
    },
    {
      quote: "The analytics and reporting features give us insights we never had before. Data-driven decisions have never been easier.",
      author: "David Kim",
      role: "Operations Manager",
      company: "Growth Labs",
      avatar: "DK",
      rating: 5,
      metrics: "3x faster reporting"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      position: 'relative'
    }}>
      {/* Decorative top border */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)'
      }} />
      
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #fef3c7, #ffedd5)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#b45309' }}>
              Customer Stories
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            marginBottom: '24px',
            lineHeight: 1.2
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Trusted by teams
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              around the world
            </span>
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#475569',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            See how leading companies use ToolStack to streamline their workflows 
            and achieve remarkable results.
          </p>
        </div>

        {/* Main Testimonial */}
        <div style={{ position: 'relative', marginBottom: '64px' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '256px',
              height: '256px',
              background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.5), rgba(255, 237, 213, 0.5))',
              borderRadius: '50%',
              filter: 'blur(48px)',
              transform: 'translate(50%, -50%)'
            }} />
            
            <div style={{ position: 'relative' }}>
              {/* Quote Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)'
              }}>
                <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              {/* Testimonial Content */}
              <blockquote style={{
                fontSize: 'clamp(18px, 3vw, 28px)',
                fontWeight: 500,
                color: '#1e293b',
                lineHeight: 1.5,
                marginBottom: '32px'
              }}>
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              {/* Author Info */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #475569, #334155)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '16px'
                  }}>
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>

                {/* Metrics Badge */}
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  padding: '10px 16px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#047857' }}>
                    {testimonials[currentTestimonial].metrics}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} style={{ width: '20px', height: '20px', color: '#fbbf24' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', gap: '8px' }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  height: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: index === currentTestimonial ? '32px' : '12px',
                  background: index === currentTestimonial 
                    ? 'linear-gradient(135deg, #f59e0b, #ea580c)' 
                    : '#cbd5e1'
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '64px'
        }}>
          {[
            { value: '10,000+', label: 'Active Teams', gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
            { value: '99.9%', label: 'Uptime', gradient: 'linear-gradient(135deg, #10b981, #0d9488)' },
            { value: '4.9/5', label: 'Customer Rating', gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)' },
            { value: '50M+', label: 'Tasks Completed', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)' }
          ].map((stat) => (
            <div key={stat.label} style={{
              textAlign: 'center',
              padding: '32px 24px',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                marginBottom: '8px',
                background: stat.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#64748b', fontWeight: 500, fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            borderRadius: '24px',
            padding: '48px 32px',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '16px'
            }}>
              Join thousands of satisfied customers
            </h3>
            <p style={{
              color: '#64748b',
              marginBottom: '24px',
              maxWidth: '512px',
              margin: '0 auto 24px',
              fontSize: '16px'
            }}>
              Start your free trial today and see why teams choose ToolStack for their project management needs.
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <a 
                href="/signup" 
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)'
                }}
              >
                Start Free Trial
              </a>
              <a 
                href="#demo" 
                style={{
                  color: '#475569',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px'
                }}
              >
                <span>Watch demo first</span>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
