'use server';

import Razorpay from 'razorpay';
import { createSupabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

// Inline PLANS to avoid server action export issues
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'INR',
    features: ['3 projects', '50 tasks', '3 members']
  },
  professional: {
    name: 'Professional',
    price: 49900,
    priceDisplay: 'INR 499',
    currency: 'INR',
    interval: 'monthly',
    features: ['50 projects', '1000 tasks', '10 members', 'API access', 'Priority support']
  },
  enterprise: {
    name: 'Enterprise',
    price: 149900,
    priceDisplay: 'INR 1499',
    currency: 'INR',
    interval: 'monthly',
    features: ['Unlimited projects', 'Unlimited tasks', 'Unlimited members', 'API access', 'SSO', 'Dedicated support']
  }
};

function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Billing is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  return { keyId, keySecret };
}

function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayConfig();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

export async function createSubscriptionOrder(orgId, planId) {
  const razorpay = getRazorpayClient();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const plan = PLANS[planId];
  if (!plan || plan.price === 0) throw new Error('Invalid plan');

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (!org) throw new Error('Organization not found');

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
    keyId: getRazorpayConfig().keyId
  };
}

export async function verifyPayment(orderId, paymentId, signature, orgId, planId) {
  const { keySecret } = getRazorpayConfig();
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    throw new Error('Invalid payment signature');
  }

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

  if (error) throw new Error(`Failed to update subscription: ${error.message}`);

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

export async function cancelSubscription(orgId) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (membership?.role !== 'owner') {
    throw new Error('Only owners can cancel subscription');
  }

  const { error } = await supabase
    .from('organizations')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      subscription_id: null
    })
    .eq('id', orgId);

  if (error) throw new Error(`Failed to cancel subscription: ${error.message}`);

  return { success: true };
}

export async function getPaymentHistory(orgId) {
  const supabase = await createSupabaseServer();

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  return payments || [];
}
