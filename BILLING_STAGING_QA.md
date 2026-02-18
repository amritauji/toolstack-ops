# Billing Staging QA (E2E + Failover)

Run these tests in staging with a dedicated owner test account.

## Prerequisites
- Staging env vars set:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- SQL applied:
  - `sql/payments_table.sql`
  - `sql/webhook_events.sql`
- One org owner account available for billing actions.

## Test Data
- Org: `qa-billing-org`
- Plans: `professional`, `enterprise`
- Keep one failed payment record available for retry test.

## Test 1: Successful Upgrade (UI + DB)
1. Login as org owner.
2. Go to `/settings/billing`.
3. Upgrade Free -> Professional using Razorpay test payment.
4. Confirm success toast and page reload.

Expected:
- UI shows Professional as current plan.
- `organizations.plan = 'professional'`
- `organizations.subscription_status = 'active'`
- New `payments` row with:
  - `status = 'success'`
  - non-empty `payment_id`, `order_id`
  - matching `plan = 'professional'`

## Test 2: Failed Payment Path
1. Start upgrade flow and force a failed payment in Razorpay test mode.
2. Return to billing page.

Expected:
- User sees failure message (not generic crash).
- `payments` row exists with `status = 'failed'`.
- Retry button appears for failed payment row.

## Test 3: Retry Behavior
1. Click Retry on a failed payment.
2. Verify one of two outcomes:
   - Requires new payment flow (expected for signature/verification failures).
   - Auto recovers from `processing/org_update_failed` state.

Expected:
- No duplicate overlapping actions (buttons disabled during action).
- Final state becomes either:
  - successful upgraded plan, or
  - clear actionable error.

## Test 4: Cancel Subscription
1. From paid plan, click Cancel Subscription.
2. Confirm action.

Expected:
- Plan downgrades to Free.
- Org `subscription_status = 'cancelled'`.
- Cancellation row added to `payments` with `status = 'cancelled'`.

## Test 5: Webhook Idempotency Replay
1. Send same webhook event twice (same `event_id`).
2. Confirm endpoint returns already processed on second call.

Expected:
- First call processes.
- Second call does not duplicate DB changes.
- `webhook_events` has a single row for that `event_id`.

## Test 6: Payment Captured Webhook Sync
1. Send `payment.captured` webhook payload with valid signature.
2. Ensure org is updated even if UI callback was not relied upon.

Expected:
- Org is active with correct plan.
- Payment row exists/updated with `success`.

## Test 7: Payment Failed Webhook Sync
1. Send `payment.failed` webhook payload.
2. Refresh billing page.

Expected:
- Org `subscription_status = 'payment_failed'`.
- Failed payment row exists/updated.

## Pass/Fail Exit Criteria
- PASS only if all 7 tests pass.
- FAIL if any of these happen:
  - duplicate successful charges for same `payment_id`
  - plan/status mismatch between UI and DB
  - webhook replay causes duplicate state transitions
  - retry path leaves ambiguous UI without actionable state

## Webhook Replay Helper (PowerShell)
Use this from project root after setting env vars and replacing placeholder values in payload files.

```powershell
# Captured webhook
.\scripts\replay-razorpay-webhook.ps1 `
  -Url "https://<staging-domain>/api/webhooks/razorpay" `
  -PayloadPath ".\scripts\webhook-samples\payment-captured.json"

# Failed webhook
.\scripts\replay-razorpay-webhook.ps1 `
  -Url "https://<staging-domain>/api/webhooks/razorpay" `
  -PayloadPath ".\scripts\webhook-samples\payment-failed.json"

# Idempotency check: run same payload again; response should indicate already processed
.\scripts\replay-razorpay-webhook.ps1 `
  -Url "https://<staging-domain>/api/webhooks/razorpay" `
  -PayloadPath ".\scripts\webhook-samples\payment-captured.json"
```

## DB Verification
Run `sql/billing_qa_checks.sql` after each scenario.
