# SQL Migration Order

Run these migrations in **exact order** in your Supabase SQL Editor:

## 1. Core Setup (Run First)
```sql
-- 1.1 Profiles and RLS
sql/complete_profiles_setup.sql

-- 1.2 Performance indexes
sql/performance_indexes.sql

-- 1.3 Comments system
sql/comments_system.sql

-- 1.4 Attachments system
sql/attachments_system.sql

-- 1.5 Enable realtime
sql/enable_realtime.sql
```

## 2. Security & API (Run Second)
```sql
-- 2.1 Secure API keys with hashing
sql/secure_api_keys.sql

-- 2.2 Fix security warnings
sql/fix_security_warnings.sql
```

## 3. Multi-Tenancy (Run Third)
```sql
-- 3.1 Multi-tenancy schema (organizations, org_members, org_invites)
sql/multi_tenancy.sql

-- 3.2 Add status column to invites
sql/add_invite_status.sql

-- 3.3 Fix org RLS recursion
sql/fix_org_rls_final.sql

-- 3.4 Add org_id to existing tables
sql/org_scoped_tables.sql
```

## 4. SaaS Features (Run Fourth)
```sql
-- 4.1 Complete SaaS features (time tracking, automations, saved filters, notifications, projects)
sql/complete_saas_features.sql
```

## 5. Optional/Legacy (Skip if already applied)
```sql
-- Developer setup (if needed)
sql/developer_setup_minimal.sql

-- Payments table (if using Razorpay)
sql/payments_table.sql

-- Phase 2/3 features (if needed)
sql/phase2_phase3_features.sql
```

## Verification

After running all migrations, verify with:
```sql
sql/verify_migrations.sql
```

## Notes

- **Always backup your database before running migrations**
- Run migrations one at a time and check for errors
- If a migration fails, fix the error before proceeding
- Some migrations use `IF NOT EXISTS` to be idempotent
- The order matters due to foreign key dependencies

## Common Issues

### Deadlock on complete_saas_features.sql
- Fixed in latest version by splitting project_id constraint
- If you still see deadlock, run the migration again

### RLS Recursion on org_members
- Fixed by `fix_org_rls_final.sql` using security definer functions
- Must run after `multi_tenancy.sql`

### Missing org_id columns
- Run `org_scoped_tables.sql` after `multi_tenancy.sql`
- This adds org_id to tasks, comments, attachments

## Migration Status Tracking

Create a simple tracking table:
```sql
CREATE TABLE IF NOT EXISTS migration_log (
  id SERIAL PRIMARY KEY,
  migration_name TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- After each migration, log it:
INSERT INTO migration_log (migration_name) VALUES ('complete_profiles_setup');
```
