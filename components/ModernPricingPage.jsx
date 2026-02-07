"use client";

import { useState, useEffect } from 'react';
import { REGIONS, BASE_PRICES, calculatePrice } from '@/lib/pricing';
import { getTranslation, getLocaleFromRegion } from '@/lib/translations';

export default function ModernPricingPage() {
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [billingCycle, setBillingCycle] = useState('annual');
  const [t, setT] = useState(getTranslation('en-US'));

  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion') || 'US';
    setSelectedRegion(savedRegion);
    updateTranslations(savedRegion);

    const handleRegionChange = (event) => {
      setSelectedRegion(event.detail);
      updateTranslations(event.detail);
    };
    window.addEventListener('regionChanged', handleRegionChange);
    return () => window.removeEventListener('regionChanged', handleRegionChange);
  }, []);

  const updateTranslations = (regionCode) => {
    const locale = getLocaleFromRegion(regionCode);
    setT(getTranslation(locale));
  };

  const plans = ['free', 'starter', 'professional', 'enterprise'];

  return (
    <section style={styles.section}>
      <div style={styles.decorativeBorder} />
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeText}>{t.pricing.title.split(' ')[0]} {t.pricing.title.split(' ')[1]}</span>
          </div>
          <h2 style={styles.mainTitle}>
            <span style={styles.titlePrimary}>{t.pricing.title}</span>
            <br />
            <span style={styles.titleGradient}>{t.pricing.subtitle}</span>
          </h2>
          <p style={styles.description}>{t.pricing.description}</p>

          {/* Billing Toggle */}
          <div style={styles.billingToggle}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                ...styles.toggleButton,
                ...(billingCycle === 'monthly' ? styles.toggleButtonActive : {})
              }}
            >
              {t.pricing.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              style={{
                ...styles.toggleButton,
                ...(billingCycle === 'annual' ? styles.toggleButtonActive : {})
              }}
            >
              {t.pricing.annual}
              <span style={styles.saveBadge}>{t.pricing.save}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={styles.grid}>
          {plans.map((plan) => {
            const planData = t.pricing.plans[plan];
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
                {isPopular && (
                  <div style={styles.popularBadge}>
                    <div style={styles.popularBadgeInner}>{t.pricing.mostPopular}</div>
                  </div>
                )}

                <div style={{ ...styles.cardHeader, marginTop: isPopular ? '8px' : 0 }}>
                  <h3 style={styles.planName}>{planData.name}</h3>
                  <p style={styles.planDescription}>{planData.description}</p>
                  
                  <div style={styles.priceSection}>
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>{pricing.formatted}</span>
                      {plan !== 'free' && <span style={styles.period}>{t.pricing.perMonth}</span>}
                    </div>
                    {billingCycle === 'annual' && plan !== 'free' && (
                      <div style={styles.annualNote}>
                        {t.pricing.billedAnnually} ({pricing.symbol}{Math.round(pricing.amount * 12)}{t.pricing.perYear})
                      </div>
                    )}
                  </div>

                  <button
                    style={{
                      ...styles.ctaButton,
                      ...(isPopular ? styles.ctaButtonPopular : styles.ctaButtonDefault)
                    }}
                  >
                    {plan === 'enterprise' ? t.pricing.contactSales : plan === 'free' ? t.pricing.getStarted : t.pricing.startTrial}
                  </button>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.featuresHeader}>{t.pricing.whatsIncluded}</div>
                  <div style={styles.featuresList}>
                    {planData.features.map((feature, index) => (
                      <div key={index} style={styles.featureItem}>
                        <div style={{
                          ...styles.checkIcon,
                          background: isPopular 
                            ? 'linear-gradient(135deg, #a855f7, #ec4899)' 
                            : '#10b981'
                        }}>
                          <svg style={styles.checkSvg} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span style={styles.featureText}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div style={styles.faqSection}>
          <h3 style={styles.faqTitle}>{t.pricing.faqTitle}</h3>
          <div style={styles.faqGrid}>
            {t.pricing.faqs.map((faq, i) => (
              <div key={i} style={styles.faqCard}>
                <h4 style={styles.faqQuestion}>{faq.q}</h4>
                <p style={styles.faqAnswer}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={styles.bottomCta}>
          <h3 style={styles.ctaTitle}>{t.pricing.readyTitle}</h3>
          <p style={styles.ctaDescription}>{t.pricing.readyDescription}</p>
          <div style={styles.ctaButtons}>
            <a href="/signup" style={styles.ctaButtonPrimary}>{t.pricing.startTrial}</a>
            <a href="/contact" style={styles.ctaButtonSecondary}>
              <span>{t.pricing.contactSales}</span>
              <svg style={styles.arrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '100px 0',
    background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    position: 'relative',
    minHeight: '100vh'
  },
  decorativeBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '64px'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 20px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    marginBottom: '24px'
  },
  badgeText: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#7e22ce'
  },
  mainTitle: {
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 700,
    marginBottom: '24px',
    lineHeight: 1.2
  },
  titlePrimary: {
    background: 'linear-gradient(135deg, #0f172a, #334155)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  description: {
    fontSize: '18px',
    color: '#475569',
    maxWidth: '640px',
    margin: '0 auto 32px',
    lineHeight: 1.7
  },
  billingToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#f1f5f9',
    borderRadius: '12px',
    padding: '4px'
  },
  toggleButton: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'transparent',
    color: '#64748b',
    position: 'relative'
  },
  toggleButtonActive: {
    background: 'white',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  saveBadge: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    background: 'linear-gradient(135deg, #10b981, #0d9488)',
    color: 'white',
    fontSize: '10px',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontWeight: 600
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
    marginBottom: '64px',
    alignItems: 'start'
  },
  card: {
    position: 'relative',
    background: 'white',
    borderRadius: '24px',
    border: '2px solid #e2e8f0',
    padding: '40px 32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s'
  },
  cardPopular: {
    border: '2px solid #a855f7',
    boxShadow: '0 25px 50px -12px rgba(168, 85, 247, 0.25)',
    transform: 'scale(1.02)'
  },
  popularBadge: {
    position: 'absolute',
    top: '-16px',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  popularBadgeInner: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  planName: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '8px'
  },
  planDescription: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '24px'
  },
  priceSection: {
    marginBottom: '24px'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  price: {
    fontSize: '48px',
    fontWeight: 700,
    color: '#0f172a'
  },
  period: {
    color: '#64748b',
    marginLeft: '8px'
  },
  annualNote: {
    fontSize: '13px',
    color: '#10b981',
    fontWeight: 500,
    marginTop: '4px'
  },
  ctaButton: {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  ctaButtonPopular: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)'
  },
  ctaButtonDefault: {
    background: '#0f172a',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  cardBody: {
    marginTop: '32px'
  },
  featuresHeader: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '16px'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px'
  },
  checkSvg: {
    width: '12px',
    height: '12px',
    color: 'white'
  },
  featureText: {
    color: '#475569',
    fontSize: '14px'
  },
  faqSection: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    marginBottom: '64px'
  },
  faqTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: '40px'
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  faqCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.5)'
  },
  faqQuestion: {
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '8px',
    fontSize: '15px'
  },
  faqAnswer: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: 1.6
  },
  bottomCta: {
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '16px'
  },
  ctaDescription: {
    color: '#64748b',
    marginBottom: '32px',
    maxWidth: '512px',
    margin: '0 auto 32px'
  },
  ctaButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px'
  },
  ctaButtonPrimary: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(168, 85, 247, 0.3)'
  },
  ctaButtonSecondary: {
    color: '#475569',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px'
  },
  arrow: {
    width: '16px',
    height: '16px'
  }
};
