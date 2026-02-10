"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function ThreePillars() {
  const { isDark } = useTheme();
  const [headerRef, headerVisible] = useScrollAnimation();
  const [pillar1Ref, pillar1Visible] = useScrollAnimation();
  const [pillar2Ref, pillar2Visible] = useScrollAnimation();
  const [pillar3Ref, pillar3Visible] = useScrollAnimation();
  
  return (
    <section style={{ padding: '100px 20px', background: isDark ? '#0f172a' : 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{
            ...fadeInUp(headerVisible, 0),
            display: 'inline-block',
            padding: '6px 16px',
            background: isDark ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
            color: isDark ? '#818cf8' : '#4f46e5',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '20px'
          }}>
            The Solution
          </span>
          <h2 style={{ ...fadeInUp(headerVisible, 0.1), fontSize: '42px', fontWeight: '700', marginBottom: '20px', color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: '1.2' }}>
            One unified platform. Three core capabilities.
          </h2>
          <p style={{ ...fadeInUp(headerVisible, 0.2), fontSize: '18px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Everything your team needs to move from planning to execution — without the complexity
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {/* Plan */}
          <div ref={pillar1Ref} style={{
            ...scaleIn(pillar1Visible, 0),
            background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '40px',
            borderRadius: '16px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              opacity: isDark ? 0.15 : 0.1
            }} />
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Plan</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', lineHeight: '1.7', fontSize: '15px', marginBottom: '20px' }}>
              Transform ideas into structured, actionable tasks with AI-powered creation, intelligent prioritization, and automatic breakdown of complex work.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Natural language task creation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Smart priority suggestions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Automatic task breakdown
              </li>
            </ul>
          </div>
          
          {/* Execute */}
          <div ref={pillar2Ref} style={{
            ...scaleIn(pillar2Visible, 0.15),
            background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '40px',
            borderRadius: '16px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '50%',
              opacity: isDark ? 0.15 : 0.1
            }} />
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Execute</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', lineHeight: '1.7', fontSize: '15px', marginBottom: '20px' }}>
              Keep teams aligned and productive with real-time collaboration, visual workflows, and seamless progress tracking across all projects.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Real-time collaboration
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Kanban & list views
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Live progress updates
              </li>
            </ul>
          </div>
          
          {/* Analyze */}
          <div ref={pillar3Ref} style={{
            ...scaleIn(pillar3Visible, 0.3),
            background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '40px',
            borderRadius: '16px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '50%',
              opacity: isDark ? 0.15 : 0.1
            }} />
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 17V9" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 17V5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 17v-3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Analyze</h3>
            <p style={{ color: isDark ? '#94a3b8' : '#475569', lineHeight: '1.7', fontSize: '15px', marginBottom: '20px' }}>
              Gain actionable insights with automated summaries, team performance metrics, and data-driven recommendations to optimize workflows.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Automated progress reports
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Team performance insights
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Bottleneck detection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
