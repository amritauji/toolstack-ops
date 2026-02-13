"use client";

import { useState } from 'react';
import { useAuth } from '@/app/providers';
import { createSubscriptionOrder, verifyPayment } from '@/lib/razorpay';
import { PLANS } from '@/lib/clientPlans';
import RazorpayScript from '@/components/RazorpayScript';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ModernPricingPage() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleSelectPlan = async (planId) => {
    if (!user) {
      toast.error('Please login to select a plan');
      router.push('/login');
      return;
    }

    if (planId === 'free') {
      toast.success('You are already on the free plan!');
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);

    try {
      // Get user's current organization
      const response = await fetch('/api/profile');
      const { profile } = await response.json();
      
      if (!profile?.current_org_id) {
        toast.error('Please create an organization first');
        router.push('/dashboard');
        return;
      }

      const { orderId, amount, currency, keyId } = await createSubscriptionOrder(profile.current_org_id, planId);

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'NexBoard',
        description: `${PLANS[planId].name} Plan Subscription`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              profile.current_org_id,
              planId
            );
            toast.success(`Successfully upgraded to ${PLANS[planId].name} plan!`);
            router.push('/dashboard');
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || ''
        },
        theme: {
          color: '#a855f7'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setSelectedPlan(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <section style={styles.section}>
      <RazorpayScript />
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <span style={styles.badgeText}>Simple Pricing</span>
          </div>
          <h2 style={styles.mainTitle}>
            <span style={styles.titlePrimary}>Choose the Perfect Plan</span>
            <br />
            <span style={styles.titleGradient}>for Your Team</span>
          </h2>
          <p style={styles.description}>
            Start free and scale as you grow. All plans include our core features with different usage limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div style={styles.grid}>
          {Object.entries(PLANS).map(([planId, plan]) => {
            const isPopular = planId === 'professional';
            const isLoading = loading && selectedPlan === planId;

            return (
              <div
                key={planId}
                style={{
                  ...styles.card,
                  ...(isPopular ? styles.cardPopular : {})
                }}
              >
                {isPopular && (
                  <div style={styles.popularBadge}>
                    <div style={styles.popularBadgeInner}>Most Popular</div>
                  </div>
                )}

                <div style={{ ...styles.cardHeader, marginTop: isPopular ? '8px' : 0 }}>
                  <h3 style={styles.planName}>{plan.name}</h3>
                  
                  <div style={styles.priceSection}>
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>
                        {plan.price === 0 ? 'Free' : `₹${(plan.price / 100).toFixed(0)}`}
                      </span>
                      {plan.price > 0 && <span style={styles.period}>/month</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(planId)}
                    disabled={isLoading}
                    style={{
                      ...styles.ctaButton,
                      ...(isPopular ? styles.ctaButtonPopular : styles.ctaButtonDefault),
                      ...(isLoading ? styles.ctaButtonLoading : {})
                    }}
                  >
                    {isLoading ? 'Processing...' : 
                     planId === 'enterprise' ? 'Contact Sales' : 
                     planId === 'free' ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.featuresHeader}>What&apos;s included:</div>
                  <div style={styles.featuresList}>
                    {plan.features.map((feature, index) => (
                      <div key={index} style={styles.featureItem}>
                        <div style={{
                          ...styles.checkIcon,
                          background: isPopular ? 'linear-gradient(135deg, #a855f7, #ec4899)' : '#10b981'
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

        {/* Bottom CTA */}
        <div style={styles.bottomCta}>
          <h3 style={styles.ctaTitle}>Ready to get started?</h3>
          <p style={styles.ctaDescription}>
            Join thousands of teams already using NexBoard to manage their projects efficiently.
          </p>
          <div style={styles.ctaButtons}>
            <button 
              onClick={() => handleSelectPlan('professional')}
              style={styles.ctaButtonPrimary}
              disabled={loading}
            >
              {loading && selectedPlan === 'professional' ? 'Processing...' : 'Start Free Trial'}
            </button>
            <a href="/contact" style={styles.ctaButtonSecondary}>
              <span>Contact Sales</span>
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
    backgroundImage: 'linear-gradient(135deg, #0f172a, #334155)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  titleGradient: {
    backgroundImage: 'linear-gradient(135deg, #a855f7, #ec4899)',
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
  ctaButtonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed'
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
    border: 'none',
    cursor: 'pointer',
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
