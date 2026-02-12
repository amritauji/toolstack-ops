"use client";

import { useState } from 'react';
import { createSubscriptionOrder, verifyPayment, cancelSubscription, PLANS } from '@/lib/razorpay';
import RazorpayScript from '@/components/RazorpayScript';
import toast from 'react-hot-toast';

export default function BillingClient({ org, userRole, payments }) {
  const [loading, setLoading] = useState(false);
  const isOwner = userRole === 'owner';

  const handleUpgrade = async (planId) => {
    if (!isOwner) {
      toast.error('Only owners can upgrade');
      return;
    }

    setLoading(true);
    try {
      const { orderId, amount, currency, keyId } = await createSubscriptionOrder(org.id, planId);

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'NexBoard',
        description: `${PLANS[planId].name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              org.id,
              planId
            );
            toast.success('Subscription activated!');
            window.location.reload();
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: org.name,
          email: org.billing_email || ''
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel subscription? You will be downgraded to Free plan.')) return;

    try {
      await cancelSubscription(org.id);
      toast.success('Subscription cancelled');
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <RazorpayScript />
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Billing & Subscription</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Manage your subscription and payment methods</p>

        {/* Current Plan */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Current Plan</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {PLANS[org.plan].name}
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                {org.plan === 'free' ? 'Free forever' : `${PLANS[org.plan].priceDisplay}/month`}
              </div>
            </div>
            {org.plan !== 'free' && isOwner && (
              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Available Plans</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: org.plan === key ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                position: 'relative'
              }}
            >
              {org.plan === key && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '4px 12px',
                  background: '#4f46e5',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  Current
                </div>
              )}
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
                {plan.price === 0 ? 'Free' : plan.priceDisplay}
                {plan.price > 0 && <span style={{ fontSize: '16px', color: '#6b7280', fontWeight: '400' }}>/month</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {org.plan !== key && plan.price > 0 && isOwner && (
                <button
                  onClick={() => handleUpgrade(key)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: loading ? '#9ca3af' : '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'Processing...' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Payment History</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Plan</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Amount</th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                        {new Date(payment.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', textTransform: 'capitalize' }}>
                        {payment.plan}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>
                        ₹{(payment.amount / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: '#d1fae5',
                          color: '#065f46'
                        }}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {!isOwner && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            ⚠️ Only organization owners can manage billing and subscriptions.
          </p>
        </div>
      )}
    </div>
  );
}