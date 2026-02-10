"use client";

import { useTheme } from '@/contexts/ThemeContext';

export default function AIFeaturesSection() {
  const { isDark } = useTheme();
  
  return (
    <section style={{
      padding: '100px 20px',
      background: isDark ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' : 'linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{
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
            AI-Powered Intelligence
          </span>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginTop: '16px',
            marginBottom: '20px',
            color: isDark ? '#f1f5f9' : '#0f172a',
            lineHeight: '1.2'
          }}>
            Work smarter with intelligent automation
          </h2>
          <p style={{ fontSize: '18px', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            AI that reduces friction, speeds execution, and helps your team focus on shipping great work — not managing tasks.
          </p>
        </div>

        {/* Main Features - 2 Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '32px',
          marginBottom: '50px'
        }}>
          {/* Smart Task Creation */}
          <div style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '40px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  Smart Task Creation
                </h3>
                <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6' }}>
                  Turn natural language into structured tasks instantly
                </p>
              </div>
            </div>
            
            <div style={{
              background: isDark ? '#0f172a' : '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#cbd5e1' : '#475569',
              fontFamily: 'monospace',
              marginBottom: '16px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
            }}>
              "Fix login bug before Friday, assign to frontend"
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Title extracted
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Due date detected
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Assignee suggested
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10b981' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Priority set
              </div>
            </div>
          </div>

          {/* Intelligent Prioritization */}
          <div style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '40px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  Intelligent Prioritization
                </h3>
                <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6' }}>
                  AI highlights what matters most — before it becomes urgent
                </p>
              </div>
            </div>
            
            <div style={{
              background: isDark ? '#7f1d1d' : '#fef2f2',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#fca5a5' : '#991b1b',
              marginBottom: '12px',
              border: isDark ? '1px solid #991b1b' : '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              This task is likely to become overdue
            </div>
            
            <div style={{
              background: isDark ? '#7c2d12' : '#fff7ed',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              color: isDark ? '#fdba74' : '#9a3412',
              border: isDark ? '1px solid #9a3412' : '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              High priority — similar tasks took 3+ days
            </div>
          </div>

          {/* Task Breakdown */}
          <div style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '40px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                  Task Breakdown Assistance
                </h3>
                <p style={{ fontSize: '15px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.6' }}>
                  Large tasks become actionable steps in seconds
                </p>
              </div>
            </div>
            
            <div style={{
              background: isDark ? '#0f172a' : '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '14px', color: isDark ? '#f1f5f9' : '#0f172a' }}>"Build onboarding flow"</div>
              <div style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Design screens
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  API integration
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Validation logic
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Testing
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div style={{
            background: isDark ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '40px',
            border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: isDark ? '#f1f5f9' : '#0f172a' }}>
              Additional AI Capabilities
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Automatic Progress Summaries</h4>
                  <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.5' }}>Daily and weekly insights without manual reporting</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Context-Aware Search</h4>
                  <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.5' }}>Find tasks, updates, and discussions instantly</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: isDark ? '#f1f5f9' : '#0f172a' }}>Team Insights</h4>
                  <p style={{ fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b', lineHeight: '1.5' }}>Bottleneck detection and workload balance for admins</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          borderRadius: '16px',
          padding: '48px 40px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Privacy-First AI</h3>
            </div>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '32px', lineHeight: '1.6' }}>
              Your data is never used to train public models. AI runs securely with strict access control and privacy safeguards.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>100%</div>
                <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data Privacy</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{'<'}200ms</div>
                <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Response Time</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>24/7</div>
                <div style={{ fontSize: '13px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Always Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
