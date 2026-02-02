"use client";

import { useState, useEffect, useRef } from 'react';

export default function ModernFeatures() {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleFeatures(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = sectionRef.current?.querySelectorAll('[data-index]');
    featureElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Advanced Analytics",
      description: "Get deep insights into your team's performance with real-time analytics and customizable dashboards.",
      gradient: "linear-gradient(135deg, #3b82f6, #4f46e5)"
    },
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Seamless collaboration tools that keep your team connected and productive, no matter where they work.",
      gradient: "linear-gradient(135deg, #10b981, #0d9488)"
    },
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Automation Engine",
      description: "Automate repetitive tasks and workflows to focus on what matters most. Save hours every week.",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)"
    },
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance, end-to-end encryption, and advanced access controls.",
      gradient: "linear-gradient(135deg, #f59e0b, #ea580c)"
    },
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Custom Workflows",
      description: "Build workflows that match your unique processes. Flexible and powerful enough for any team.",
      gradient: "linear-gradient(135deg, #f43f5e, #dc2626)"
    },
    {
      icon: (
        <svg style={{ width: '32px', height: '32px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "API Integration",
      description: "Connect with 200+ tools and services. Build custom integrations with our powerful REST API.",
      gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)"
    }
  ];

  return (
    <section id="features" ref={sectionRef} style={{
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
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #eef2ff, #faf5ff)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#4338ca' }}>
              Powerful Features
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
              Everything you need to
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              manage projects better
            </span>
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#475569',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Comprehensive project management tools designed for modern teams. 
            From planning to execution, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              style={{
                position: 'relative',
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.5s ease',
                opacity: visibleFeatures.has(index) ? 1 : 0,
                transform: visibleFeatures.has(index) ? 'translateY(0)' : 'translateY(32px)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Icon */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: feature.gradient,
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: 1.6
              }}>
                {feature.description}
              </p>

              {/* Learn more link */}
              <div style={{ marginTop: '24px' }}>
                <a href="#" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#4f46e5',
                  textDecoration: 'none'
                }}>
                  <span>Learn more</span>
                  <svg style={{ width: '16px', height: '16px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#475569', fontSize: '16px' }}>Ready to get started?</span>
            <a 
              href="/signup" 
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
