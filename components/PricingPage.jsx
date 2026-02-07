"use client";

import { useState, useEffect } from 'react';
import { REGIONS, BASE_PRICES, PLAN_FEATURES, calculatePrice } from '@/lib/pricing';

export default function PricingPage() {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    // Get saved region
    const savedRegion = localStorage.getItem('selectedRegion') || 'US';
    setSelectedRegion(savedRegion);

    // Listen for region changes
    const handleRegionChange = (event) => {
      setSelectedRegion(event.detail);
    };
    window.addEventListener('regionChanged', handleRegionChange);
    return () => window.removeEventListener('regionChanged', handleRegionChange);
  }, []);

  const plans = ['free', 'starter', 'professional', 'enterprise'];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Simple, Transparent Pricing</h1>
        <p style={styles.subtitle}>
          Choose the perfect plan for your team. All plans include 14-day free trial.
        </p>

        {/* Billing Toggle */}
        <div style={styles.billingToggle}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              ...styles.toggleButton,
              ...(billingCycle === 'monthly' ? styles.toggleButtonActive : {})
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            style={{
              ...styles.toggleButton,
              ...(billingCycle === 'annual' ? styles.toggleButtonActive : {})
            }}
          >
            Annual
            <span style={styles.badge}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={styles.grid}>
        {plans.map((plan) => {
          const features = PLAN_FEATURES[plan];
          const pricing = calculatePrice(plan, billingCycle, selectedRegion);
          const isPopular = plan === 'professional';

          return (
            <div
              key={plan}
              style={{
                ...styles.card,
                ...(isPopular ? styles.cardPopular : {})
              }}
            >
              {isPopular && <div style={styles.popularBadge}>Most Popular</div>}
              
              <div style={styles.cardHeader}>
                <h3 style={styles.planName}>{features.name}</h3>
                <div style={styles.priceContainer}>
                  <span style={styles.price}>{pricing.formatted}</span>
                  {plan !== 'free' && (
                    <span style={styles.period}>
                      /user/{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {plan === 'enterprise' && (
                  <p style={styles.customPricing}>Starting price - Contact for quote</p>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.limits}>
                  <div style={styles.limitItem}>
                    <span style={styles.limitLabel}>Users:</span>
                    <span style={styles.limitValue}>{features.users}</span>
                  </div>
                  <div style={styles.limitItem}>
                    <span style={styles.limitLabel}>Tasks:</span>
                    <span style={styles.limitValue}>{features.tasks}</span>
                  </div>
                  <div style={styles.limitItem}>
                    <span style={styles.limitLabel}>Storage:</span>
                    <span style={styles.limitValue}>{features.storage}</span>
                  </div>
                  <div style={styles.limitItem}>
                    <span style={styles.limitLabel}>Support:</span>
                    <span style={styles.limitValue}>{features.support}</span>
                  </div>
                </div>

                <ul style={styles.featureList}>
                  {features.features.map((feature, index) => (
                    <li key={index} style={styles.featureItem}>
                      <svg style={styles.checkIcon} width="20" height="20" viewBox="0 0 20 20">
                        <path
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fill="#3b82f6"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.cardFooter}>
                <button
                  style={{
                    ...styles.ctaButton,
                    ...(isPopular ? styles.ctaButtonPrimary : styles.ctaButtonSecondary)
                  }}
                >
                  {plan === 'free' ? 'Get Started' : plan === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div style={styles.faq}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>Can I change plans later?</h3>
            <p style={styles.faqAnswer}>
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>What payment methods do you accept?</h3>
            <p style={styles.faqAnswer}>
              We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>Is there a free trial?</h3>
            <p style={styles.faqAnswer}>
              Yes, all paid plans include a 14-day free trial. No credit card required.
            </p>
          </div>
          <div style={styles.faqItem}>
            <h3 style={styles.faqQuestion}>What happens after the trial?</h3>
            <p style={styles.faqAnswer}>
              You'll be automatically downgraded to the Free plan. No charges unless you upgrade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '60px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 32,
  },
  billingToggle: {
    display: 'inline-flex',
    gap: 8,
    padding: 4,
    background: '#f3f4f6',
    borderRadius: 12,
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toggleButtonActive: {
    background: 'white',
    color: '#111827',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  badge: {
    padding: '2px 8px',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
    marginBottom: 80,
  },
  card: {
    position: 'relative',
    background: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: 16,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s',
  },
  cardPopular: {
    border: '2px solid #3b82f6',
    boxShadow: '0 10px 40px rgba(59, 130, 246, 0.2)',
    transform: 'scale(1.05)',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 16px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  cardHeader: {
    marginBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 12,
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: 700,
    color: '#111827',
  },
  period: {
    fontSize: 16,
    color: '#6b7280',
  },
  customPricing: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  cardBody: {
    flex: 1,
    marginBottom: 24,
  },
  limits: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    background: '#f9fafb',
    borderRadius: 8,
    marginBottom: 24,
  },
  limitItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  limitLabel: {
    color: '#6b7280',
  },
  limitValue: {
    fontWeight: 600,
    color: '#111827',
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    fontSize: 14,
    color: '#374151',
  },
  checkIcon: {
    flexShrink: 0,
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  ctaButton: {
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  ctaButtonPrimary: {
    background: '#3b82f6',
    color: 'white',
  },
  ctaButtonSecondary: {
    background: '#f3f4f6',
    color: '#111827',
  },
  faq: {
    marginTop: 80,
  },
  faqTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 48,
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 32,
  },
  faqItem: {
    padding: 24,
    background: '#f9fafb',
    borderRadius: 12,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
    marginBottom: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.6,
  },
};
