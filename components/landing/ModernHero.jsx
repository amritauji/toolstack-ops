"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function ModernHero() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section style={{
      position: 'relative',
      paddingTop: '140px',
      paddingBottom: '80px',
      overflow: 'hidden'
    }}>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center'
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '8px 16px',
          borderRadius: '9999px',
          background: isDark ? '#1e293b' : '#eef2ff',
          border: isDark ? '1px solid #475569' : '1px solid #c7d2fe',
          marginBottom: '32px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'all 0.7s ease'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            background: '#6366f1',
            borderRadius: '50%',
            marginRight: '10px',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#a5b4fc' : '#4338ca' }}>
            Trusted by 10,000+ teams worldwide
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 700,
          marginBottom: '24px',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.1s'
        }}>
          <span style={{ color: isDark ? '#f1f5f9' : '#0f172a', display: 'block' }}>Your workflow,</span>
          <span style={{
            backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>amplified by AI</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: isDark ? '#94a3b8' : '#475569',
          marginBottom: '40px',
          maxWidth: '640px',
          margin: '0 auto 40px',
          lineHeight: 1.6,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.2s'
        }}>
          Plan smarter. Execute faster. Ship with confidence. The most intuitive project management platform built for modern teams.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '64px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.3s'
        }}>
          <Link href="/signup" style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.2s'
          }}>
            Start Free Trial
          </Link>
          <a href="#demo" style={{
            background: isDark ? '#1e293b' : 'white',
            color: isDark ? '#cbd5e1' : '#374151',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
            border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s',
            display: 'inline-block'
          }}>
            Watch Demo
          </a>
        </div>

        {/* Trust Indicators */}
        <div style={{
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.4s'
        }}>
          <p style={{
            fontSize: '12px',
            color: isDark ? '#94a3b8' : '#64748b',
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 500
          }}>
            Trusted by industry leaders
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            opacity: 0.5,
            overflow: 'hidden'
          }}>
            {['TechFlow', 'BuildSpace', 'DevCorp', 'StartupLab', 'CodeBase', 'FlowTech', 'NextGen', 'ProTeam', 'AgileWorks', 'TaskForce'].map((company, index) => (
              <span key={company} style={{
                fontSize: '18px',
                fontWeight: 600,
                color: isDark ? '#64748b' : '#94a3b8',
                animation: 'fadeInUp 0.8s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'backwards',
                whiteSpace: 'nowrap'
              }}>{company}</span>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div style={{
          position: 'relative',
          maxWidth: '1024px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 1s ease 0.5s'
        }}>
          {/* Decorative blur behind */}
          <div style={{
            position: 'absolute',
            inset: '-16px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2))',
            borderRadius: '32px',
            filter: 'blur(48px)',
            opacity: 0.5
          }} />
          
          <div style={{
            position: 'relative',
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            border: isDark ? '1px solid #334155' : '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            {/* Window chrome */}
            <div style={{
              background: isDark ? '#0f172a' : '#f8fafc',
              padding: '12px 16px',
              borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: '#f87171', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#fbbf24', borderRadius: '50%' }} />
                <div style={{ width: '12px', height: '12px', background: '#34d399', borderRadius: '50%' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  background: isDark ? '#1e293b' : 'white',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  color: '#94a3b8',
                  border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
                }}>
                  app.toolstack.io/dashboard
                </div>
              </div>
            </div>
            
            {/* Dashboard content */}
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px'
              }}>
                {[
                  { title: 'Active Projects', value: '24', change: '+12% from last month', color: '#4f46e5', bg: '#eef2ff' },
                  { title: 'Team Members', value: '156', change: 'Across 8 departments', color: '#10b981', bg: '#ecfdf5' },
                  { title: 'Completion Rate', value: '94%', change: 'Above industry average', color: '#f59e0b', bg: '#fffbeb' }
                ].map((stat) => (
                  <div key={stat.title} style={{
                    background: isDark 
                      ? `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)` 
                      : `linear-gradient(135deg, ${stat.bg}, ${stat.bg}80)`,
                    padding: '24px',
                    borderRadius: '16px',
                    border: isDark 
                      ? `1px solid ${stat.color}40` 
                      : `1px solid ${stat.color}20`,
                    boxShadow: isDark 
                      ? `0 8px 32px ${stat.color}15` 
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: isDark ? '#94a3b8' : '#475569' }}>{stat.title}</span>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: stat.color,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: '4px' }}>{stat.value}</div>
                    <div style={{ fontSize: '13px', color: stat.title === 'Active Projects' ? '#10b981' : (isDark ? '#94a3b8' : '#64748b'), fontWeight: 500 }}>{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
