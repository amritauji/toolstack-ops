'use server';

import Razorpay from 'razorpay';
import { createSupabaseServer } from '@/lib/supabaseServer';
import crypto from 'crypto';

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

async function ensureOwner(supabase, orgId, userId) {
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();

  if (membership?.role !== 'owner') {
    throw new Error('Only owners can perform this billing action');
  }
}

async function upsertPaymentByPaymentId(supabase, orgId, paymentId, payload) {
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('org_id', orgId)
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from('payments').update(payload).eq('id', existing.id);
    return existing.id;
  }

  const { data: created, error } = await supabase
    .from('payments')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to record payment: ${error.message}`);
  }

  return created.id;
}

export async function createSubscriptionOrder(orgId, planId) {
  const razorpay = getRazorpayClient();
  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');
  await ensureOwner(supabase, orgId, user.id);

  const plan = PLANS[planId];
  if (!plan || plan.price === 0) throw new Error('Invalid plan');

  const { data: org } = await supabase
    .from('organizations')
    .select('id, plan, subscription_status')
    .eq('id', orgId)
    .single();

  if (!org) throw new Error('Organization not found');
  if (org.plan === planId && org.subscription_status === 'active') {
    throw new Error('Organization is already on this plan');
  }

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
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');
  await ensureOwner(supabase, orgId, user.id);

  const plan = PLANS[planId];
  if (!plan || plan.price === 0) throw new Error('Invalid plan');

  // Idempotency: successful payment already processed.
  const { data: existingSuccess } = await supabase
    .from('payments')
    .select('id')
    .eq('org_id', orgId)
    .eq('payment_id', paymentId)
    .eq('status', 'success')
    .maybeSingle();

  if (existingSuccess) {
    return { success: true, alreadyProcessed: true };
  }

  const expectedSignature = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');

  if (signature !== expectedSignature) {
    await upsertPaymentByPaymentId(supabase, orgId, paymentId, {
      org_id: orgId,
      user_id: user.id,
      amount: plan.price,
      currency: plan.currency,
      payment_id: paymentId,
      order_id: orderId,
      status: 'failed',
      plan: planId,
      metadata: {
        verification_failed: true,
        error: 'Invalid payment signature',
        updated_at: new Date().toISOString()
      }
    });
    throw new Error('Payment signature verification failed');
  }

  const razorpay = getRazorpayClient();
  let razorpayPayment;
  try {
    razorpayPayment = await razorpay.payments.fetch(paymentId);
  } catch (error) {
    await upsertPaymentByPaymentId(supabase, orgId, paymentId, {
      org_id: orgId,
      user_id: user.id,
      amount: plan.price,
      currency: plan.currency,
      payment_id: paymentId,
      order_id: orderId,
      status: 'failed',
      plan: planId,
      metadata: {
        razorpay_verification_failed: true,
        error: error.message,
        updated_at: new Date().toISOString()
      }
    });
    throw new Error(`Unable to verify payment with Razorpay: ${error.message}`);
  }

  if (razorpayPayment.status !== 'captured') {
    await upsertPaymentByPaymentId(supabase, orgId, paymentId, {
      org_id: orgId,
      user_id: user.id,
      amount: plan.price,
      currency: plan.currency,
      payment_id: paymentId,
      order_id: orderId,
      status: 'failed',
      plan: planId,
      metadata: {
        razorpay_status: razorpayPayment.status,
        error: `Payment not captured (${razorpayPayment.status})`,
        updated_at: new Date().toISOString()
      }
    });
    throw new Error(`Payment not captured (${razorpayPayment.status})`);
  }

  const { error: orgError } = await supabase
    .from('organizations')
    .update({
      plan: planId,
      subscription_status: 'active',
      billing_customer_id: paymentId,
      subscription_id: orderId,
      trial_ends_at: null
    })
    .eq('id', orgId);

  if (orgError) {
    await upsertPaymentByPaymentId(supabase, orgId, paymentId, {
      org_id: orgId,
      user_id: user.id,
      amount: plan.price,
      currency: plan.currency,
      payment_id: paymentId,
      order_id: orderId,
      status: 'processing',
      plan: planId,
      metadata: {
        org_update_failed: true,
        error: orgError.message,
        updated_at: new Date().toISOString()
      }
    });
    throw new Error(`Payment captured but subscription update failed: ${orgError.message}`);
  }

  await upsertPaymentByPaymentId(supabase, orgId, paymentId, {
    org_id: orgId,
    user_id: user.id,
    amount: plan.price,
    currency: plan.currency,
    payment_id: paymentId,
    order_id: orderId,
    status: 'success',
    plan: planId,
    metadata: {
      verified_at: new Date().toISOString(),
      razorpay_status: razorpayPayment.status
    }
  });

  return { success: true };
}

export async function cancelSubscription(orgId) {
  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');
  await ensureOwner(supabase, orgId, user.id);

  const { data: org } = await supabase
    .from('organizations')
    .select('plan, subscription_id')
    .eq('id', orgId)
    .single();

  if (!org) throw new Error('Organization not found');

  const { error } = await supabase
    .from('organizations')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      subscription_id: null
    })
    .eq('id', orgId);

  if (error) throw new Error(`Failed to cancel subscription: ${error.message}`);

  await supabase.from('payments').insert({
    org_id: orgId,
    user_id: user.id,
    amount: 0,
    currency: 'INR',
    payment_id: `cancel_${Date.now()}`,
    order_id: org.subscription_id || `cancel_${Date.now()}`,
    status: 'cancelled',
    plan: 'free',
    metadata: {
      cancelled_at: new Date().toISOString(),
      previous_plan: org.plan
    }
  });

  return { success: true };
}

export async function retryFailedPayment(orgId, paymentRecordId) {
  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');
  await ensureOwner(supabase, orgId, user.id);

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentRecordId)
    .eq('org_id', orgId)
    .single();

  if (!payment) throw new Error('Payment record not found');
  if (payment.status !== 'failed' && payment.status !== 'processing') {
    throw new Error('Only failed/processing payments can be retried');
  }

  const metadata = payment.metadata || {};
  if (metadata.verification_failed || metadata.razorpay_verification_failed) {
    return {
      requiresNewPayment: true,
      planId: payment.plan,
      message: 'Payment verification failed earlier. Please complete a new payment attempt.'
    };
  }

  if (metadata.org_update_failed || payment.status === 'processing') {
    const { error: orgError } = await supabase
      .from('organizations')
      .update({
        plan: payment.plan,
        subscription_status: 'active',
        billing_customer_id: payment.payment_id,
        subscription_id: payment.order_id,
        trial_ends_at: null
      })
      .eq('id', orgId);

    if (orgError) {
      throw new Error(`Retry failed: ${orgError.message}`);
    }

    await supabase
      .from('payments')
      .update({
        status: 'success',
        metadata: {
          ...metadata,
          retried_at: new Date().toISOString(),
          retry_successful: true
        }
      })
      .eq('id', paymentRecordId);

    return { success: true, message: 'Subscription state recovered successfully' };
  }

  return {
    requiresNewPayment: true,
    planId: payment.plan,
    message: 'Please retry with a new payment attempt'
  };
}

export async function getPaymentHistory(orgId) {
  const supabase = await createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: membership } = await supabase
    .from('org_members')
    .select('id')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership) throw new Error('Access denied');

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch payment history: ${error.message}`);
  return payments || [];
}
