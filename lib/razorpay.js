'use server';

import Razorpay from 'razorpay';
import { createSupabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Plan pricing in INR (₹)
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: ['3 projects', '50 tasks', '3 members']
  },
  professional: {
    name: 'Professional',
    price: 49900, // ₹499/month in paise
    priceDisplay: '₹499',
    currency: 'INR',
    interval: 'monthly',
    features: ['50 projects', '1000 tasks', '10 members', 'API access', 'Priority support']
  },
  enterprise: {
    name: 'Enterprise',
    price: 149900, // ₹1499/month in paise
    priceDisplay: '₹1499',
    currency: 'INR',
    interval: 'monthly',
    features: ['Unlimited projects', 'Unlimited tasks', 'Unlimited members', 'API access', 'SSO', 'Dedicated support']
  }
};

// Create Razorpay order
export async function createSubscriptionOrder(orgId, planId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const plan = PLANS[planId];
  if (!plan || plan.price === 0) throw new Error('Invalid plan');
  
  // Get organization
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();
  
  if (!org) throw new Error('Organization not found');
  
  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: plan.price,
    currency: plan.currency,
    receipt: `order_${orgId}_${Date.now()}`,
    notes: {
      org_id: orgId,
      plan: planId,
      user_id: user.id
    }
  });
  
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID
  };
}

// Verify payment signature
export async function verifyPayment(orderId, paymentId, signature, orgId, planId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Verify signature
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    throw new Error('Invalid payment signature');
  }
  
  // Update organization plan
  const { error } = await supabase
    .from('organizations')
    .update({
      plan: planId,
      subscription_status: 'active',
      billing_customer_id: paymentId,
      subscription_id: orderId,
      trial_ends_at: null
    })
    .eq('id', orgId);
  
  if (error) throw new Error('Failed to update subscription');
  
  // Log payment
  await supabase.from('payments').insert({
    org_id: orgId,
    user_id: user.id,
    amount: PLANS[planId].price,
    currency: 'INR',
    payment_id: paymentId,
    order_id: orderId,
    status: 'success',
    plan: planId
  });
  
  return { success: true };
}

// Cancel subscription
export async function cancelSubscription(orgId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // Check if user is owner
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();
  
  if (membership?.role !== 'owner') {
    throw new Error('Only owners can cancel subscription');
  }
  
  // Downgrade to free
  const { error } = await supabase
    .from('organizations')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      subscription_id: null
    })
    .eq('id', orgId);
  
  if (error) throw new Error('Failed to cancel subscription');
  
  return { success: true };
}

// Get payment history
export async function getPaymentHistory(orgId) {
  const supabase = await createSupabaseServer();
  
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  
  return payments || [];
}
