"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollProgress, MagneticButton, RevealAnimation, FloatingElements, GradientText } from '@/components/ui/AdvancedUI';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollProgress />
      <section style={{
        paddingTop: '120px',
        paddingBottom: '80px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f3f0ff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FloatingElements />
        
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <RevealAnimation delay={0.2}>
              <h1 style={{
                fontSize: '64px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '24px',
                lineHeight: '1.1'
              }}>
                One workspace to plan,<br />
                track, and ship work{' '}
                <GradientText>faster</GradientText>
              </h1>
            </RevealAnimation>

            <RevealAnimation delay={0.4}>
              <p style={{
                fontSize: '22px',
                color: '#6b7280',
                marginBottom: '40px',
                maxWidth: '768px',
                margin: '0 auto 40px auto',
                lineHeight: '1.6'
              }}>
                ToolStack Ops helps teams manage tasks, roles, and workflows with clarity and control.
                Built for modern teams who ship fast.
              </p>
            </RevealAnimation>

            <RevealAnimation delay={0.6}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '80px'
              }}>
                <Link href="/signup">
                  <MagneticButton>
                    Start Free
                  </MagneticButton>
                </Link>
                <motion.button 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#374151',
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, color: '#4f46e5' }}
                  onClick={() => {
                    document.getElementById('product-demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Watch Demo</span>
                </motion.button>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.8}>
              <div style={{
                position: 'relative',
                maxWidth: '1024px',
                margin: '0 auto'
              }}>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: '22px',
                    zIndex: -1
                  }} />
                  
                  <div style={{
                    background: '#f9fafb',
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }}></div>
                    <div style={{ marginLeft: '16px', fontSize: '14px', color: '#6b7280' }}>ToolStack Ops Dashboard</div>
                  </div>
                  <div style={{
                    padding: '40px',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px'
                    }}>
                      {[
                        { title: 'To Do (3)', color: '#9ca3af', tasks: ['Setup authentication', 'Design landing page'] },
                        { title: 'In Progress (2)', color: '#3b82f6', tasks: ['Build dashboard'] },
                        { title: 'Done (5)', color: '#10b981', tasks: ['Project setup'] }
                      ].map((column, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                          style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <h3 style={{
                            fontWeight: '600',
                            color: '#374151',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <div style={{ 
                              width: '12px', 
                              height: '12px', 
                              background: column.color, 
                              borderRadius: '50%', 
                              marginRight: '8px' 
                            }}></div>
                            {column.title}
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {column.tasks.map((task, taskIndex) => (
                              <motion.div 
                                key={taskIndex}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 1.6 + index * 0.2 + taskIndex * 0.1 }}
                                style={{
                                  background: 'white',
                                  border: `1px solid ${column.color}20`,
                                  borderRadius: '8px',
                                  padding: '12px',
                                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                  borderLeft: `4px solid ${column.color}`
                                }}
                              >
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{task}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>High priority</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </section>
    </>
  );
}