# NexBoard SaaS Readiness Implementation Plan

**Status**: Pre-Launch | **Team Size**: 1-2 Full-Stack Devs | **Timeline**: 8-12 weeks

---

## 🚨 TOP 10 MUST-FIX BEFORE LAUNCH

1. **API Key Security** - Keys stored in plaintext, no hashing ⚠️ CRITICAL
2. **Rate Limiting** - In-memory Map won't work in serverless/multi-instance ⚠️ CRITICAL
3. **Multi-Tenancy** - No org/workspace model, all users share data ⚠️ BLOCKER
4. **Billing Integration** - No Stripe webhooks or subscription management ⚠️ BLOCKER
5. **RLS Policies** - Not scoped to organizations ⚠️ SECURITY
6. **API Completeness** - Only tasks endpoint exists, docs claim more ⚠️ BLOCKER
7. **Realtime Performance** - Full page reload on updates ⚠️ PERFORMANCE
8. **Time Tracking** - Mock UI with no data persistence ⚠️ INCOMPLETE
9. **Automations** - UI exists but no execution engine ⚠️ INCOMPLETE
10. **Error Handling** - No global error boundary for API failures ⚠️ RELIABILITY

---

## ⚡ QUICK WINS (1 Week)

### Day 1-2: Security Patches
- [ ] Hash API keys with bcrypt before storing
- [ ] Add API key rotation endpoint
- [ ] Add audit log for API key usage
- [ ] Fix merge conflict in README.md

### Day 3-4: Rate Limiting Fix
- [ ] Replace in-memory Map with Redis/Upstash
- [ ] Add rate limit headers to responses
- [ ] Implement per-user rate limits (not just IP)

### Day 5-7: Basic Monitoring
- [ ] Add error boundary components
- [ ] Set up Sentry error tracking (already configured)
- [ ] Add health check endpoint improvements
- [ ] Database query performance logging

**Effort**: S (1 week) | **Impact**: High

---

## 📋 PHASE 0: Repo Hygiene + Safety (1-3 days)

### Tasks
- [x] Resolve merge conflict in README.md ✅ (Already done)
- [ ] Add TypeScript strict mode checks
- [ ] Add pre-commit hooks (Husky + lint-staged)
- [ ] Verify all SQL migrations are idempotent
- [ ] Add database backup automation script
- [ ] Document environment variables in .env.example

**Effort**: S (2-3 days) | **Priority**: High

---

## 📋 PHASE 1: Multi-Tenancy + Billing (3-4 weeks)

### 1.1 Multi-Tenancy Foundation (L - 2 weeks)

#### Database Schema
```sql
-- New tables needed
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, member
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE TABLE org_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Update existing tables
ALTER TABLE tasks ADD COLUMN org_id UUID REFERENCES organizations(id);
ALTER TABLE projects ADD COLUMN org_id UUID REFERENCES organizations(id);
ALTER TABLE profiles ADD COLUMN current_org_id UUID REFERENCES organizations(id);
```

#### Implementation Checklist
- [ ] Create migration files for new tables
- [ ] Add org context provider in React
- [ ] Update all queries to filter by org_id
- [ ] Create org switcher UI component
- [ ] Add org settings page
- [ ] Implement invite system (email + accept/decline)
- [ ] Add role-based permissions middleware

**Files to Create/Modify**:
- `sql/multi_tenancy.sql`
- `lib/organizations.js`
- `lib/orgMiddleware.js`
- `contexts/OrganizationContext.jsx`
- `app/(app)/settings/organization/page.jsx`
- `components/OrgSwitcher.jsx`

**Effort**: L (10-12 days)

---

### 1.2 Stripe Billing Integration (L - 2 weeks)

#### Features Needed
- [ ] Stripe customer creation on org creation
- [ ] Checkout session for plan upgrades
- [ ] Webhook handler for subscription events
- [ ] Plan enforcement middleware
- [ ] Usage tracking per org
- [ ] Billing portal integration
- [ ] Invoice history page

#### Implementation
```javascript
// lib/stripe.js
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(orgId, priceId) {
  // Implementation
}

export async function handleWebhook(event) {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed':
      // Handle each event
  }
}
```

**Files to Create**:
- `lib/stripe.js`
- `lib/billing.js`
- `app/api/stripe/checkout/route.js`
- `app/api/stripe/webhook/route.js`
- `app/api/stripe/portal/route.js`
- `app/(app)/settings/billing/page.jsx`
- `components/PlanUpgradeModal.jsx`

**Effort**: L (10-12 days)

---

### 1.3 Plan Gating (M - 1 week)

#### Limits to Enforce
```javascript
// lib/planLimits.js (enhance existing)
export const PLAN_LIMITS = {
  free: {
    maxProjects: 3,
    maxTasks: 50,
    maxMembers: 3,
    apiAccess: false,
    automations: false,
    timeTracking: false,
    advancedReports: false
  },
  professional: {
    maxProjects: 50,
    maxTasks: 1000,
    maxMembers: 10,
    apiAccess: true,
    automations: true,
    timeTracking: true,
    advancedReports: true
  },
  enterprise: {
    maxProjects: -1, // unlimited
    maxTasks: -1,
    maxMembers: -1,
    apiAccess: true,
    automations: true,
    timeTracking: true,
    advancedReports: true,
    sso: true,
    customBranding: true
  }
};
```

**Tasks**:
- [ ] Add plan check middleware for all protected routes
- [ ] Show upgrade prompts when limits reached
- [ ] Add usage indicators in UI
- [ ] Block feature access based on plan
- [ ] Add "Upgrade" CTAs throughout app

**Effort**: M (5-7 days)

---

## 📋 PHASE 2: Reliability + Security (2-3 weeks)

### 2.1 API Key Security (M - 1 week)

**Current Issue**: Keys stored as plaintext in `profiles.api_key`

**Solution**:
```javascript
// lib/apiKeys.js (rewrite)
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function generateApiKey(userId, orgId) {
  const key = `nbk_${randomBytes(32).toString('hex')}`;
  const hash = await bcrypt.hash(key, 10);
  
  await supabase.from('api_keys').insert({
    user_id: userId,
    org_id: orgId,
    key_hash: hash,
    key_prefix: key.substring(0, 12), // For display
    last_used_at: null,
    created_at: new Date()
  });
  
  return key; // Only shown once
}

export async function validateApiKey(key) {
  const { data: keys } = await supabase
    .from('api_keys')
    .select('*')
    .eq('revoked', false);
  
  for (const apiKey of keys) {
    if (await bcrypt.compare(key, apiKey.key_hash)) {
      // Log usage
      await logApiKeyUsage(apiKey.id);
      return apiKey;
    }
  }
  return null;
}
```

**New Table**:
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT,
  last_used_at TIMESTAMP,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_key_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint TEXT,
  method TEXT,
  status_code INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tasks**:
- [ ] Create new api_keys table
- [ ] Migrate existing keys (hash them)
- [ ] Update API auth middleware
- [ ] Add key rotation UI
- [ ] Add usage dashboard
- [ ] Add audit log viewer

**Effort**: M (5-7 days)

---

### 2.2 Scalable Rate Limiting (M - 1 week)

**Current Issue**: In-memory Map doesn't work in serverless

**Solution**: Use Upstash Redis or Vercel KV

```javascript
// lib/rateLimit.js (rewrite)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

export async function rateLimit(identifier, limit = 100, window = 900) {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  
  // Use Redis sorted set for sliding window
  await redis.zremrangebyscore(key, 0, now - window * 1000);
  const count = await redis.zcard(key);
  
  if (count >= limit) {
    return { success: false, remaining: 0 };
  }
  
  await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
  await redis.expire(key, window);
  
  return { success: true, remaining: limit - count - 1 };
}
```

**Tasks**:
- [ ] Set up Upstash Redis account
- [ ] Rewrite rate limiting with Redis
- [ ] Add per-user rate limits (not just IP)
- [ ] Add rate limit headers to responses
- [ ] Add rate limit dashboard for admins
- [ ] Add plan-based rate limits

**Effort**: M (4-5 days)

---

### 2.3 RLS Policy Updates (M - 1 week)

**Update all RLS policies to scope by organization**:

```sql
-- Example: tasks table
DROP POLICY IF EXISTS "Users can view tasks" ON tasks;
CREATE POLICY "Users can view org tasks" ON tasks
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM org_members WHERE user_id = auth.uid()
    )
  );

-- Repeat for all tables: projects, comments, attachments, etc.
```

**Tasks**:
- [ ] Audit all existing RLS policies
- [ ] Update policies to include org_id checks
- [ ] Test with multiple orgs
- [ ] Add policy tests
- [ ] Document security model

**Effort**: M (5-6 days)

---

## 📋 PHASE 3: Product Completeness (4-6 weeks)

### 3.1 Time Tracking (L - 2 weeks)

**Current**: Mock UI only

**Implementation**:
```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  org_id UUID REFERENCES organizations(id),
  description TEXT,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration_seconds INTEGER,
  billable BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Features**:
- [ ] Start/stop timer UI
- [ ] Manual time entry
- [ ] Time reports by user/project/task
- [ ] Export timesheets
- [ ] Billable hours tracking
- [ ] Calendar integration

**Files**:
- `lib/timeTracking.js`
- `app/api/time-entries/route.js`
- `components/TimeTracker.jsx` (enhance existing)
- `app/(app)/reports/time/page.jsx`

**Effort**: L (10-12 days)

---

### 3.2 Automations Engine (L - 2 weeks)

**Current**: UI exists, no execution

**Implementation**:
```javascript
// lib/automations.js
export async function executeAutomation(automation, trigger) {
  const { conditions, actions } = automation;
  
  // Check conditions
  if (!evaluateConditions(conditions, trigger)) return;
  
  // Execute actions
  for (const action of actions) {
    switch (action.type) {
      case 'assign_user':
        await assignTask(trigger.taskId, action.userId);
        break;
      case 'change_status':
        await updateTaskStatus(trigger.taskId, action.status);
        break;
      case 'send_notification':
        await sendNotification(action.userId, action.message);
        break;
      case 'webhook':
        await fetch(action.url, { method: 'POST', body: JSON.stringify(trigger) });
        break;
    }
  }
}
```

**Tasks**:
- [ ] Create automations table
- [ ] Build rule engine
- [ ] Add trigger system (task created, status changed, etc.)
- [ ] Implement actions (assign, notify, webhook)
- [ ] Add automation logs
- [ ] Add automation testing UI

**Effort**: L (12-14 days)

---

### 3.3 Advanced Search + Filters (M - 1 week)

**Features**:
- [ ] Global search across tasks, projects, comments
- [ ] Saved filter presets
- [ ] Advanced filter UI (already exists, needs backend)
- [ ] Search indexing with Postgres full-text search
- [ ] Search analytics

**Implementation**:
```sql
-- Add search index
ALTER TABLE tasks ADD COLUMN search_vector tsvector;

CREATE INDEX tasks_search_idx ON tasks USING gin(search_vector);

CREATE FUNCTION tasks_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_search_update
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION tasks_search_trigger();
```

**Effort**: M (5-7 days)

---

### 3.4 Activity Feed + Notifications (M - 1 week)

**Current**: Basic UI exists

**Enhancements**:
- [ ] Real-time notifications via Supabase Realtime
- [ ] Email notifications (SendGrid/Resend)
- [ ] In-app notification center
- [ ] Notification preferences
- [ ] Digest emails (daily/weekly)
- [ ] Push notifications (PWA)

**Effort**: M (6-8 days)

---

### 3.5 API Expansion (M-L - 2 weeks)

**Current**: Only `/api/v1/tasks` exists

**Add**:
- [ ] `/api/v1/projects` - CRUD operations
- [ ] `/api/v1/users` - List org members
- [ ] `/api/v1/organizations` - Org management
- [ ] `/api/v1/comments` - Task comments
- [ ] `/api/v1/time-entries` - Time tracking
- [ ] `/api/v1/webhooks` - Webhook management
- [ ] API documentation (OpenAPI/Swagger)
- [ ] API versioning strategy
- [ ] SDK generation (optional)

**Effort**: M-L (10-12 days)

---

## 📋 PHASE 4: Differentiators + Compliance (6-8+ weeks)

### 4.1 Integrations (XL - 4-6 weeks)

**Priority Integrations**:
1. **Slack** (2 weeks)
   - Task notifications
   - Create tasks from Slack
   - Status updates

2. **GitHub** (2 weeks)
   - Link PRs to tasks
   - Auto-update task status on PR merge
   - Commit references

3. **Google Calendar** (1 week)
   - Sync due dates
   - Time blocking

4. **Zapier/Make** (1 week)
   - Webhook triggers
   - Actions

**Effort**: XL (6-8 weeks total)

---

### 4.2 SSO/SAML + SCIM (XL - 4-6 weeks)

**Enterprise Features**:
- [ ] SAML 2.0 authentication (Okta, Azure AD)
- [ ] SCIM user provisioning
- [ ] Just-in-time provisioning
- [ ] SSO configuration UI
- [ ] Audit logs for SSO events

**Recommended**: Use WorkOS or Auth0 for SSO

**Effort**: XL (4-6 weeks)

---

### 4.3 Compliance + Audit (M - 2 weeks)

**Features**:
- [ ] Audit log UI (view all actions)
- [ ] Data export (GDPR compliance)
- [ ] Data retention policies
- [ ] SOC 2 preparation checklist
- [ ] Privacy policy generator
- [ ] Cookie consent banner
- [ ] GDPR data deletion

**Effort**: M (8-10 days)

---

## 🔴 SECURITY RED FLAGS

### Critical Issues
1. **API Keys in Plaintext** ⚠️
   - Risk: Keys can be stolen from database
   - Fix: Hash with bcrypt (Phase 2.1)

2. **No Org Isolation** ⚠️
   - Risk: Users can access other orgs' data
   - Fix: Multi-tenancy + RLS (Phase 1.1 + 2.3)

3. **Rate Limiting Won't Scale** ⚠️
   - Risk: DDoS attacks, memory leaks
   - Fix: Redis-based rate limiting (Phase 2.2)

4. **No API Request Validation** ⚠️
   - Risk: SQL injection, XSS
   - Fix: Add Zod validation to all API routes

5. **Stripe Webhooks Missing** ⚠️
   - Risk: Subscription status out of sync
   - Fix: Implement webhook handler (Phase 1.2)

---

## 📊 EFFORT SUMMARY

| Phase | Tasks | Effort | Timeline |
|-------|-------|--------|----------|
| Phase 0 | Repo hygiene | S | 2-3 days |
| Quick Wins | Security patches | S | 1 week |
| Phase 1 | Multi-tenancy + Billing | L+L+M | 3-4 weeks |
| Phase 2 | Security + Reliability | M+M+M | 2-3 weeks |
| Phase 3 | Product completeness | L+L+M+M+M | 4-6 weeks |
| Phase 4 | Differentiators | XL+XL+M | 8-12 weeks |
| **TOTAL** | | | **18-28 weeks** |

---

## 🎯 RECOMMENDED LAUNCH STRATEGY

### MVP Launch (8 weeks)
- Phase 0 ✅
- Quick Wins ✅
- Phase 1 (Multi-tenancy + Billing) ✅
- Phase 2 (Security) ✅
- Phase 3.1 (Time Tracking) ✅
- Phase 3.5 (API Expansion) ✅

### Post-Launch (Weeks 9-16)
- Phase 3.2-3.4 (Automations, Search, Notifications)
- Phase 4.3 (Compliance)

### Enterprise Features (Weeks 17+)
- Phase 4.1 (Integrations)
- Phase 4.2 (SSO/SAML)

---

## 📝 NEXT STEPS

1. **Week 1**: Complete Quick Wins + Phase 0
2. **Week 2-5**: Phase 1 (Multi-tenancy + Billing)
3. **Week 6-8**: Phase 2 (Security hardening)
4. **Week 9**: Beta launch with limited users
5. **Week 10-12**: Phase 3 based on feedback
6. **Week 13**: Public launch

---

## 🛠️ TOOLS NEEDED

- **Redis**: Upstash (rate limiting)
- **Email**: Resend or SendGrid
- **Payments**: Stripe
- **Monitoring**: Sentry (already set up)
- **Analytics**: Vercel Analytics (already set up)
- **SSO** (later): WorkOS or Auth0
- **CI/CD**: GitHub Actions (already set up)

---

**Last Updated**: 2024
**Version**: 1.0
**Owner**: NexBoard Team
