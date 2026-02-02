"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      title: 'Startups',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      problem: 'Moving fast with limited resources and tight deadlines',
      solution: 'Streamlined workflows that scale with your growing team',
      impact: '40% faster feature launches',
      features: ['Quick setup', 'Scalable workflows', 'Priority management', 'Team coordination']
    },
    {
      title: 'Engineering Teams',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>,
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      problem: 'Complex projects with multiple dependencies and handoffs',
      solution: 'Visual task tracking with role-based permissions and clear ownership',
      impact: '60% reduction in deployment bugs',
      features: ['Code reviews', 'Sprint planning', 'Bug tracking', 'Release management']
    },
    {
      title: 'Product Teams',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      problem: 'Coordinating across different stakeholders and departments',
      solution: 'Centralized workspace with real-time updates and activity logs',
      impact: '85% better stakeholder alignment',
      features: ['Roadmap planning', 'Stakeholder updates', 'Progress tracking', 'Analytics']
    },
    {
      title: 'Remote Teams',
      icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
      problem: 'Staying synchronized across multiple time zones and cultures',
      solution: 'Async-friendly collaboration with clear communication channels',
      impact: 'Works across 12+ time zones',
      features: ['Async updates', 'Time zone support', 'Clear communication', 'Status tracking']
    }
  ];

  return (
    <section id="use-cases" style={{
      padding: '120px 0',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
              borderRadius: '50px',
              marginBottom: '32px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#4f46e5',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '1px solid rgba(79, 70, 229, 0.2)'
            }}
          >
            Use Cases
          </motion.div>
          <h2 style={{
            fontSize: '64px',
            fontWeight: '800',
            color: '#111827',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Built for teams that{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>ship fast</span>
          </h2>
          <p style={{
            fontSize: '22px',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            From startups to enterprises, ToolStack Ops adapts to your workflow and scales with your ambitions.
          </p>
        </motion.div>

        {/* Modern Card-Based Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '80px'
        }}>
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              onClick={() => setActiveTab(index)}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: activeTab === index 
                  ? `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 2px ${useCase.color}` 
                  : '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: activeTab === index ? `2px solid ${useCase.color}` : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: useCase.bgGradient,
                borderRadius: '50%',
                transform: 'translate(40px, -40px)',
                opacity: 0.3
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: useCase.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '24px',
                  boxShadow: `0 8px 24px ${useCase.color}40`
                }}>
                  {useCase.icon}
                </div>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '16px'
                }}>{useCase.title}</h3>
                
                <p style={{
                  color: '#6b7280',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>{useCase.problem}</p>
                
                <div style={{
                  padding: '16px',
                  background: useCase.bgGradient,
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: useCase.color,
                    marginBottom: '4px'
                  }}>{useCase.impact}</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '600'
                  }}>Proven Results</div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {useCase.features.map((feature, featureIndex) => (
                    <span key={featureIndex} style={{
                      padding: '6px 12px',
                      background: '#f8fafc',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      border: '1px solid #e2e8f0'
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'white',
              borderRadius: '32px',
              padding: '60px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated Background */}
            <motion.div 
              animate={{ 
                background: [
                  useCases[activeTab].bgGradient,
                  `linear-gradient(135deg, ${useCases[activeTab].color}20 0%, ${useCases[activeTab].color}10 100%)`,
                  useCases[activeTab].bgGradient
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1
              }} 
            />
            
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: '80px',
                  height: '80px',
                  background: useCases[activeTab].color,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  margin: '0 auto 32px auto',
                  boxShadow: `0 12px 32px ${useCases[activeTab].color}40`
                }}
              >
                {useCases[activeTab].icon}
              </motion.div>
              
              <h3 style={{
                fontSize: '48px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '24px'
              }}>{useCases[activeTab].title}</h3>
              
              <p style={{
                fontSize: '20px',
                color: '#6b7280',
                maxWidth: '600px',
                margin: '0 auto 48px auto',
                lineHeight: '1.7'
              }}>{useCases[activeTab].solution}</p>
              
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                style={{
                  display: 'inline-block',
                  padding: '24px 48px',
                  background: `linear-gradient(135deg, ${useCases[activeTab].color} 0%, ${useCases[activeTab].color}dd 100%)`,
                  borderRadius: '16px',
                  color: 'white',
                  boxShadow: `0 12px 32px ${useCases[activeTab].color}40`
                }}
              >
                <div style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  marginBottom: '8px'
                }}>{useCases[activeTab].impact}</div>
                <div style={{
                  fontSize: '16px',
                  opacity: 0.9,
                  fontWeight: '600'
                }}>Real Impact</div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}