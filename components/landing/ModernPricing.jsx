"use client";

import { useState } from 'react';

export default function ModernPricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started",
      monthlyPrice: 12,
      annualPrice: 10,
      features: [
        "Up to 5 team members",
        "10 projects",
        "Basic task management",
        "Email support",
        "Mobile apps",
        "1GB storage"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "Best for growing teams and businesses",
      monthlyPrice: 24,
      annualPrice: 20,
      features: [
        "Up to 25 team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        "10GB storage",
        "Time tracking",
        "API access"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      description: "Advanced features for large organizations",
      monthlyPrice: 48,
      annualPrice: 40,
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced security",
        "24/7 phone support",
        "Custom integrations",
        "Unlimited storage",
        "Advanced reporting",
        "SSO & SAML",
        "Dedicated success manager"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" style={{
      padding: '100px 0',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
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
            background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#7e22ce' }}>
              Simple Pricing
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
              Choose the perfect plan
            </span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              for your team
            </span>
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#475569',
            maxWidth: '640px',
            margin: '0 auto 32px',
            lineHeight: 1.7
          }}>
            Start with a free trial. No credit card required. 
            Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f1f5f9',
            borderRadius: '12px',
            padding: '4px'
          }}>
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: !isAnnual ? 'white' : 'transparent',
                color: !isAnnual ? '#0f172a' : '#64748b',
                boxShadow: !isAnnual ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                background: isAnnual ? 'white' : 'transparent',
                color: isAnnual ? '#0f172a' : '#64748b',
                boxShadow: isAnnual ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              Annual
              <span style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'linear-gradient(135deg, #10b981, #0d9488)',
                color: 'white',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontWeight: 600
              }}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          marginBottom: '64px',
          alignItems: 'start'
        }}>
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                background: 'white',
                borderRadius: '24px',
                border: plan.popular ? '2px solid #a855f7' : '2px solid #e2e8f0',
                padding: '40px 32px',
                boxShadow: plan.popular 
                  ? '0 25px 50px -12px rgba(168, 85, 247, 0.25)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transform: plan.popular ? 'scale(1.02)' : 'none'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                  }}>
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: plan.popular ? '8px' : 0 }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{plan.name}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>{plan.description}</p>
                
                {/* Price */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
                    <span style={{ fontSize: '48px', fontWeight: 700, color: '#0f172a' }}>
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span style={{ color: '#64748b', marginLeft: '8px' }}>/month</span>
                  </div>
                  {isAnnual && (
                    <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 500, marginTop: '4px' }}>
                      Billed annually (${plan.annualPrice * 12}/year)
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                      : '#0f172a',
                    color: 'white',
                    boxShadow: plan.popular 
                      ? '0 8px 24px rgba(168, 85, 247, 0.3)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {plan.cta}
                </button>
              </div>

              {/* Features List */}
              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '16px'
                }}>
                  What's included:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        background: plan.popular 
                          ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                          : '#10b981'
                      }}>
                        <svg style={{ width: '12px', height: '12px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span style={{ color: '#475569', fontSize: '14px' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          borderRadius: '24px',
          padding: '48px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          marginBottom: '64px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Frequently Asked Questions
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'All plans come with a 14-day free trial. No credit card required to get started.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
              { q: 'Do you offer discounts for nonprofits?', a: 'Yes, we offer 50% discounts for qualified nonprofit organizations and educational institutions.' }
            ].map((faq, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.5)'
              }}>
                <h4 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px', fontSize: '15px' }}>{faq.q}</h4>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Ready to get started?
          </h3>
          <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '512px', margin: '0 auto 32px' }}>
            Join thousands of teams who trust ToolStack to manage their projects efficiently.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <a 
              href="/signup" 
              style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)'
              }}
            >
              Start Free Trial
            </a>
            <a 
              href="/contact" 
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
              <span>Contact sales</span>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
