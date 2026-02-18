import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(url, serviceRole);
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured');
  if (!signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

async function resolveOrgId(supabase, entity, notes) {
  if (notes?.org_id) return notes.org_id;

  const orderId = entity?.order_id || entity?.id || null;
  if (!orderId) return null;

  const { data: orgBySubscription } = await supabase
    .from('organizations')
    .select('id')
    .eq('subscription_id', orderId)
    .maybeSingle();

  if (orgBySubscription?.id) return orgBySubscription.id;

  const { data: paymentByOrder } = await supabase
    .from('payments')
    .select('org_id')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return paymentByOrder?.org_id || null;
}

async function ensureWebhookEventNotProcessed(supabase, eventId, eventType, payload) {
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle();

  if (existing?.id) return false;

  const { error } = await supabase.from('webhook_events').insert({
    event_id: eventId,
    event_type: eventType,
    payload
  });

  if (error?.code === '23505') return false;
  if (error) throw new Error(`Failed to store webhook event: ${error.message}`);
  return true;
}

async function upsertPayment(supabase, paymentRow) {
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('org_id', paymentRow.org_id)
    .eq('payment_id', paymentRow.payment_id)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from('payments').update(paymentRow).eq('id', existing.id);
    if (error) throw new Error(`Failed to update payment row: ${error.message}`);
    return;
  }

  const { error } = await supabase.from('payments').insert(paymentRow);
  if (error) throw new Error(`Failed to insert payment row: ${error.message}`);
}

async function handlePaymentCaptured(supabase, entity) {
  const notes = entity?.notes || {};
  const orgId = await resolveOrgId(supabase, entity, notes);
  if (!orgId) return;

  const plan = notes.plan || 'professional';
  const userId = notes.user_id || null;

  await supabase
    .from('organizations')
    .update({
      plan,
      subscription_status: 'active',
      billing_customer_id: entity.id,
      subscription_id: entity.order_id || null,
      trial_ends_at: null
    })
    .eq('id', orgId);

  if (userId) {
    await upsertPayment(supabase, {
      org_id: orgId,
      user_id: userId,
      payment_id: entity.id,
      order_id: entity.order_id || entity.id,
      amount: entity.amount || 0,
      currency: entity.currency || 'INR',
      plan,
      status: 'success',
      metadata: {
        source: 'webhook',
        event: 'payment.captured',
        captured_at: new Date().toISOString()
      }
    });
  }
}

async function handlePaymentFailed(supabase, entity) {
  const notes = entity?.notes || {};
  const orgId = await resolveOrgId(supabase, entity, notes);
  if (!orgId) return;

  const plan = notes.plan || 'professional';
  const userId = notes.user_id || null;

  await supabase
    .from('organizations')
    .update({
      subscription_status: 'payment_failed'
    })
    .eq('id', orgId);

  if (userId) {
    await upsertPayment(supabase, {
      org_id: orgId,
      user_id: userId,
      payment_id: entity.id,
      order_id: entity.order_id || entity.id,
      amount: entity.amount || 0,
      currency: entity.currency || 'INR',
      plan,
      status: 'failed',
      metadata: {
        source: 'webhook',
        event: 'payment.failed',
        reason: entity.error_description || entity.error_reason || 'Unknown'
      }
    });
  }
}

async function handleSubscriptionActivated(supabase, entity) {
  const notes = entity?.notes || {};
  const orgId = await resolveOrgId(supabase, entity, notes);
  if (!orgId) return;

  await supabase
    .from('organizations')
    .update({
      plan: notes.plan || 'professional',
      subscription_status: 'active',
      subscription_id: entity.id || null
    })
    .eq('id', orgId);
}

async function handleSubscriptionCancelled(supabase, entity) {
  const notes = entity?.notes || {};
  const orgId = await resolveOrgId(supabase, entity, notes);
  if (!orgId) return;

  await supabase
    .from('organizations')
    .update({
      subscription_status: 'cancelled'
    })
    .eq('id', orgId);
}

async function handleSubscriptionCharged(supabase, entity) {
  const notes = entity?.notes || {};
  const orgId = await resolveOrgId(supabase, entity, notes);
  if (!orgId) return;

  await supabase
    .from('organizations')
    .update({
      subscription_status: 'active'
    })
    .eq('id', orgId);
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    const eventId = event?.event_id;

    if (!eventType || !eventId) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const shouldProcess = await ensureWebhookEventNotProcessed(supabase, eventId, eventType, event);
    if (!shouldProcess) {
      return NextResponse.json({ message: 'Event already processed' });
    }

    const paymentEntity = event?.payload?.payment?.entity;
    const subscriptionEntity = event?.payload?.subscription?.entity;

    switch (eventType) {
      case 'payment.captured':
        if (paymentEntity) await handlePaymentCaptured(supabase, paymentEntity);
        break;
      case 'payment.failed':
        if (paymentEntity) await handlePaymentFailed(supabase, paymentEntity);
        break;
      case 'subscription.activated':
        if (subscriptionEntity) await handleSubscriptionActivated(supabase, subscriptionEntity);
        break;
      case 'subscription.cancelled':
        if (subscriptionEntity) await handleSubscriptionCancelled(supabase, subscriptionEntity);
        break;
      case 'subscription.charged':
        if (paymentEntity) await handleSubscriptionCharged(supabase, paymentEntity);
        break;
      default:
        break;
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
