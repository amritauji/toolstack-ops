-- Billing QA verification queries
-- Supabase SQL editor does not support :named placeholders.
-- Replace the UUID literal in each params CTE before running.

-- 1) Organization billing state
with params as (
  select '00000000-0000-0000-0000-000000000000'::uuid as org_id
)
select
  id,
  name,
  plan,
  subscription_status,
  billing_customer_id,
  subscription_id,
  trial_ends_at,
  updated_at
from organizations
where id = (select org_id from params);

-- 2) Recent payment records (latest first)
with params as (
  select '00000000-0000-0000-0000-000000000000'::uuid as org_id
)
select
  id,
  org_id,
  user_id,
  payment_id,
  order_id,
  amount,
  currency,
  plan,
  status,
  metadata,
  created_at
from payments
where org_id = (select org_id from params)
order by created_at desc
limit 30;

-- 3) Duplicate payment guard (should be zero rows ideally)
with params as (
  select '00000000-0000-0000-0000-000000000000'::uuid as org_id
)
select
  org_id,
  payment_id,
  count(*) as row_count
from payments
where org_id = (select org_id from params)
group by org_id, payment_id
having count(*) > 1;

-- 4) Webhook idempotency guard (same event_id should appear once)
select
  event_id,
  event_type,
  count(*) as row_count,
  min(created_at) as first_seen,
  max(created_at) as last_seen
from webhook_events
group by event_id, event_type
having count(*) > 1
order by last_seen desc;

-- 5) Latest webhook events
select
  id,
  event_id,
  event_type,
  processed_at,
  created_at
from webhook_events
order by created_at desc
limit 30;

-- 6) Failed/processing payments that may need retry
with params as (
  select '00000000-0000-0000-0000-000000000000'::uuid as org_id
)
select
  id,
  payment_id,
  order_id,
  plan,
  status,
  metadata,
  created_at
from payments
where org_id = (select org_id from params)
  and status in ('failed', 'processing')
order by created_at desc;
