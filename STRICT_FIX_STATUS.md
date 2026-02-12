# Strict Fix Order - Completion Status

## ✅ COMPLETED (High Impact)

### 1. Fix API Breakages ✅
**Status**: COMPLETE
- Updated `lib/apiAuth.js` to use organizations.plan instead of profiles.plan
- Returns `orgId` and `orgPlan` in auth result
- All API routes now use unified `apiAuth()` function
- Updated `app/api/v1/projects/route.js` - uses apiAuth, rate limiting, org scope
- Updated `app/api/v1/users/route.js` - uses apiAuth, rate limiting, org scope  
- Updated `app/api/v1/orgs/route.js` - uses apiAuth, rate limiting, org scope
- All routes include proper error handling and rate-limit headers

### 2. Enforce Org Scope on API Routes ✅
**Status**: COMPLETE
- All API routes filter by `orgId` from auth context
- Projects API: `.eq('org_id', orgId)`
- Users API: `.eq('org_id', orgId)` on org_members
- Orgs API: `.eq('id', orgId)`
- Tasks API: Already has org scope via RLS policies

### 5. Fix Invite Schema/Flow Mismatch ✅
**Status**: COMPLETE
- Created `sql/add_invite_status.sql` migration
- Adds `status` column with CHECK constraint ('pending', 'accepted', 'expired', 'revoked')
- Migrates existing data based on `accepted_at`
- Code already uses `status` field in `lib/organizations.js` and `app/invite/page.jsx`

### 10. Resolve Repo Hygiene Blockers ✅
**Status**: COMPLETE
- Created `sql/README.md` with exact migration order
- Documents all migrations with dependencies
- Includes verification steps and common issues
- Migration tracking table template included

## 🔄 IN PROGRESS / NEEDS COMPLETION

### 3. Enforce Org Scope in Server Data Layer
**Status**: PARTIAL - Needs Review
**What's Done**:
- `lib/tasks.js` - createTask() gets current_org_id and adds to insert
- `lib/comments.js` - createComment() gets current_org_id and adds to insert
- `lib/attachments.js` - uploadTaskAttachment() gets current_org_id and adds to insert

**What's Needed**:
- Review `lib/tasks.js` getTasks() - currently relies on RLS, should explicitly filter by org_id
- Review `lib/users.js` getAssignableUsers() - should filter by current org members
- Review `lib/activityFeed.js` - should filter by org_id
- Add org_id filter to all SELECT queries

### 4. Unify Plan Enforcement to Organization Plan
**Status**: PARTIAL - Needs Completion
**What's Done**:
- `lib/apiAuth.js` now checks organizations.plan
- `lib/planEnforcement.js` uses organizations.plan

**What's Needed**:
- Update `lib/usage.js` to use organizations.plan + org-scoped counts
- Remove profiles.plan checks from `lib/apiKeys.js`
- Update UI components that check plan (UsageDashboard, UpgradeModal, etc.)
- Ensure all gating uses `lib/planEnforcement.js` as single source

### 6. Wire Saved Filters to DB
**Status**: NOT STARTED
**What's Needed**:
- Refactor `components/AdvancedFilters.jsx` to use `lib/savedFilters.js`
- Replace localStorage with DB calls
- Add save/load/delete filter UI
- Keep optimistic UI for better UX

### 7. Wire Time Tracking to DB
**Status**: NOT STARTED
**What's Needed**:
- Refactor `components/TimeTracker.jsx` to use `lib/timeTracking.js`
- Replace mock/local state with server actions
- Add start/stop timer UI
- Display active timer and history
- Confirm `sql/complete_saas_features.sql` is applied

### 8. Wire Automations UI to Server Model
**Status**: NOT STARTED
**What's Needed**:
- Refactor `components/AutomationManager.jsx` to use `lib/automations.js`
- Map UI fields to trigger_type, action_type, configs
- Add create/edit/delete/toggle automation UI
- Create scheduled processor endpoint (`/api/cron/automations`)
- Set up Vercel Cron or Supabase pg_cron for due-date/overdue triggers

### 9. Complete Notifications and Activity Feed Integration
**Status**: PARTIAL
**What's Done**:
- `components/NotificationsPanel.jsx` created with full UI
- `lib/notifications.js` has all server actions

**What's Needed**:
- Add NotificationsPanel to `components/Navbar.jsx`
- Render ActivityFeed in `app/(app)/dashboard/DashboardClient.jsx`
- Wire up realtime updates for notifications

### 11. Regression Pass
**Status**: NOT STARTED
**What's Needed**:
- Run `npm run lint`
- Run `npm run build`
- Run `npm run typecheck` (add to package.json if missing)
- Test all 6 flows listed in requirements

## 📋 Quick Action Items (Priority Order)

### Immediate (Do Now)
1. Run SQL migrations in order from `sql/README.md`
2. Update `lib/tasks.js` getTasks() to explicitly filter by org_id
3. Update `lib/users.js` getAssignableUsers() to filter by org members
4. Add NotificationsPanel to Navbar

### Short Term (This Week)
5. Wire TimeTracker component to DB
6. Wire AdvancedFilters to savedFilters.js
7. Wire AutomationManager to automations.js
8. Add ActivityFeed to dashboard
9. Run regression tests

### Medium Term (Next Week)
10. Unify all plan enforcement to organizations.plan
11. Create automation cron endpoint
12. Add typecheck to CI pipeline
13. Full end-to-end testing

## 🎯 Critical Path to Production

**Must Fix Before Deploy**:
1. ✅ API routes working with org scope
2. ⚠️ getTasks() explicitly filters by org_id
3. ⚠️ getAssignableUsers() filters by org members
4. ⚠️ All plan checks use organizations.plan
5. ⚠️ Run all SQL migrations
6. ⚠️ Test org switching changes data scope
7. ⚠️ Test invite flow end-to-end

**Nice to Have**:
- Time tracking UI wired
- Saved filters UI wired
- Automations UI wired
- Activity feed visible
- Notifications panel in navbar

## 📊 Completion Percentage

- **API Layer**: 100% ✅
- **Data Layer Org Scope**: 60% ⚠️
- **Plan Enforcement**: 50% ⚠️
- **UI Wiring**: 20% ⚠️
- **Testing**: 0% ❌

**Overall**: ~55% Complete

## Next Steps

1. Fix data layer org scoping (getTasks, getAssignableUsers, activityFeed)
2. Unify plan enforcement
3. Wire UI components to DB
4. Run regression tests
5. Deploy to production

---

**Last Updated**: After completing API fixes and migration documentation
