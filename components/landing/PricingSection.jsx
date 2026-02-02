"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        'Basic Kanban boards',
        'Task management',
        'Email support',
        '1GB storage'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 12, yearly: 120 },
      description: 'Best for growing teams and projects',
      features: [
        'Up to 25 team members',
        'Advanced Kanban boards',
        'Role-based permissions',
        'Activity logs',
        'Priority support',
        '10GB storage',
        'Custom fields',
        'Due date tracking'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Team',
      price: { monthly: 24, yearly: 240 },
      description: 'For large teams and enterprises',
      features: [
        'Unlimited team members',
        'All Pro features',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'Unlimited storage',
        'SSO authentication',
        'Custom branding'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <section id="pricing" style={{
      padding: '80px 0',
      background: 'white'
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
            Simple, transparent pricing
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '768px',
            margin: '0 auto 32px auto'
          }}>
            Choose the plan that fits your team size and needs. All plans include our core features.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: !isYearly ? '#111827' : '#6b7280'
            }}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                height: '24px',
                width: '44px',
                alignItems: 'center',
                borderRadius: '12px',
                transition: 'background-color 0.2s ease',
                background: isYearly ? '#4f46e5' : '#d1d5db',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{
                display: 'inline-block',
                height: '16px',
                width: '16px',
                transform: isYearly ? 'translateX(24px)' : 'translateX(4px)',
                borderRadius: '50%',
                background: 'white',
                transition: 'transform 0.2s ease'
              }} />
            </button>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isYearly ? '#111827' : '#6b7280'
            }}>
              Yearly
              <span style={{
                marginLeft: '4px',
                color: '#059669',
                fontWeight: '600'
              }}>(Save 17%)</span>
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: '16px',
                border: plan.popular ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                padding: '32px',
                boxShadow: plan.popular ? '0 10px 25px rgba(79, 70, 229, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}>
                  <span style={{
                    background: '#4f46e5',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '8px'
                }}>{plan.name}</h3>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '24px'
                }}>{plan.description}</p>
                
                <div style={{ marginBottom: '32px' }}>
                  <span style={{
                    fontSize: '64px',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span style={{ color: '#6b7280' }}>
                    /{isYearly ? 'year' : 'month'}
                  </span>
                  {isYearly && plan.price.monthly > 0 && (
                    <div style={{
                      fontSize: '14px',
                      color: '#059669',
                      fontWeight: '500',
                      marginTop: '4px'
                    }}>
                      Save ${(plan.price.monthly * 12) - plan.price.yearly}/year
                    </div>
                  )}
                </div>

                <Link
                  href="/signup"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '32px',
                    textDecoration: 'none',
                    background: plan.popular ? '#4f46e5' : '#f3f4f6',
                    color: plan.popular ? 'white' : '#111827',
                    textAlign: 'center'
                  }}
                >
                  {plan.cta}
                </Link>
              </div>

              <ul style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg style={{
                      width: '20px',
                      height: '20px',
                      color: '#10b981',
                      marginRight: '12px'
                    }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span style={{ color: '#374151' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{
          marginTop: '64px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280' }}>
            Questions about pricing?{' '}
            <a href="#" style={{
              color: '#4f46e5',
              fontWeight: '500',
              textDecoration: 'none'
            }}>
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}