"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useScrollAnimation, fadeInUp } from '@/hooks/useScrollAnimation';

export default function ProblemStatement() {
  const { isDark } = useTheme();
  const [headerRef, headerVisible] = useScrollAnimation();
  const [card1Ref, card1Visible] = useScrollAnimation();
  const [card2Ref, card2Visible] = useScrollAnimation();
  const [card3Ref, card3Visible] = useScrollAnimation();
  
  return (
    <section id="features" style={{ padding: '80px 20px', background: isDark ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)', borderBottom: isDark ? '1px solid #334155' : '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            ...fadeInUp(headerVisible, 0),
            display: 'inline-block',
            padding: '6px 16px',
            background: isDark ? '#1e293b' : '#fef2f2',
            color: isDark ? '#fca5a5' : '#dc2626',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '20px'
          }}>
            The Problem
          </span>
          <h2 style={{ ...fadeInUp(headerVisible, 0.1), fontSize: '40px', fontWeight: '700', marginBottom: '20px', color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: '1.2', maxWidth: '800px', margin: '0 auto' }}>
            Traditional task management costs teams <span style={{ color: isDark ? '#fca5a5' : '#dc2626', position: 'relative' }}>40% of their productivity</span>
          </h2>
          <p style={{ ...fadeInUp(headerVisible, 0.2), fontSize: '18px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '20px auto 0', lineHeight: '1.6' }}>
            Research shows that inefficient workflows drain time, energy, and focus from what actually matters: shipping great work.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div ref={card1Ref} style={{
            ...fadeInUp(card1Visible, 0),
            background: isDark ? '#0f172a' : 'white',
            padding: '32px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: '600', marginBottom: '12px' }}>
              Fragmented Tools
            </h3>
            <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Teams juggle 5-8 different tools daily, losing critical context with every switch.
            </p>
            <div style={{ fontSize: '13px', color: isDark ? '#64748b' : '#94a3b8', fontWeight: '500' }}>
              Average: 2.5 hours lost per day
            </div>
          </div>
          
          <div ref={card2Ref} style={{
            ...fadeInUp(card2Visible, 0.1),
            background: isDark ? '#0f172a' : 'white',
            padding: '32px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: '600', marginBottom: '12px' }}>
              Manual Overhead
            </h3>
            <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Status updates, progress reports, and sync meetings consume valuable execution time.
            </p>
            <div style={{ fontSize: '13px', color: isDark ? '#64748b' : '#94a3b8', fontWeight: '500' }}>
              Average: 8 hours per week
            </div>
          </div>
          
          <div ref={card3Ref} style={{
            ...fadeInUp(card3Visible, 0.2),
            background: isDark ? '#0f172a' : 'white',
            padding: '32px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{ fontSize: '18px', color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: '600', marginBottom: '12px' }}>
              Information Silos
            </h3>
            <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
              Critical decisions and context get buried in email threads and chat messages.
            </p>
            <div style={{ fontSize: '13px', color: isDark ? '#64748b' : '#94a3b8', fontWeight: '500' }}>
              Average: 30% of knowledge lost
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
