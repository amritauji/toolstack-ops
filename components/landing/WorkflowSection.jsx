"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function WorkflowSection() {
  const [activeTab, setActiveTab] = useState('planning');

  const workflows = {
    planning: {
      title: "Strategic Planning",
      description: "Transform ideas into actionable plans with visual roadmaps and goal tracking.",
      features: [
        "Visual project roadmaps",
        "Goal setting & tracking",
        "Resource allocation",
        "Timeline management"
      ]
    },
    execution: {
      title: "Seamless Execution",
      description: "Keep teams aligned and projects on track with real-time collaboration tools.",
      features: [
        "Real-time collaboration",
        "Task automation",
        "Progress tracking",
        "Team communication"
      ]
    },
    reporting: {
      title: "Intelligent Reporting",
      description: "Make data-driven decisions with comprehensive analytics and insights.",
      features: [
        "Custom dashboards",
        "Performance metrics",
        "Team productivity insights",
        "Automated reports"
      ]
    }
  };

  return (
    <section style={{
      padding: '120px 0',
      background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)'
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
            Work flows better when
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              everyone's connected
            </span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            From planning to execution to reporting, ToolStack Ops connects your entire workflow in one powerful platform.
          </p>
        </div>

        {/* Workflow Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '60px',
          background: 'white',
          borderRadius: '16px',
          padding: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb'
        }}>
          {Object.entries(workflows).map(([key, workflow]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === key ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === key ? 'white' : '#6b7280',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 4px'
              }}
            >
              {workflow.title}
            </button>
          ))}
        </div>

        {/* Active Workflow Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}>
          {/* Content */}
          <div>
            <h3 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              {workflows[activeTab].title}
            </h3>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.7'
            }}>
              {workflows[activeTab].description}
            </p>
            
            <div style={{
              display: 'grid',
              gap: '16px',
              marginBottom: '40px'
            }}>
              {workflows[activeTab].features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ✓
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/signup" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
            }}
            >
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
              </svg>
            </Link>
          </div>

          {/* Visual */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <div style={{
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: 'white',
                  fontSize: '32px'
                }}>
                  {activeTab === 'planning' && '📋'}
                  {activeTab === 'execution' && '⚡'}
                  {activeTab === 'reporting' && '📊'}
                </div>
                <h4 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>
                  {workflows[activeTab].title}
                </h4>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280'
                }}>
                  Experience the power of {workflows[activeTab].title.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}