-- Multi-Tenancy Schema for NexBoard
-- Organizations, Members, and Invites

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'enterprise')),
  
  -- Billing fields (for future Stripe/Paddle integration)
  billing_email TEXT,
  billing_customer_id TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  trial_ends_at TIMESTAMP,
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. ORGANIZATION MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- ============================================
-- 3. ORGANIZATION INVITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS org_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  expires_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. UPDATE EXISTING TABLES
-- ============================================

-- Add org_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_org_id UUID REFERENCES organizations(id);

-- Add org_id to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- Add org_id to projects (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
  END IF;
END $$;

-- Add org_id to task_comments
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- Add org_id to attachments
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- Add org_id to api_keys
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- ============================================
-- 5. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_invites_token ON org_invites(token);
CREATE INDEX IF NOT EXISTS idx_org_invites_email ON org_invites(email);
CREATE INDEX IF NOT EXISTS idx_tasks_org_id ON tasks(org_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_org_id ON task_comments(org_id);
CREATE INDEX IF NOT EXISTS idx_attachments_org_id ON attachments(org_id);

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_invites ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can view orgs they're members of
CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (
    id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Organizations: Owners can update their org
CREATE POLICY "Owners can update organization" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Org Members: Users can view members of their orgs
CREATE POLICY "Users can view org members" ON org_members
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Org Members: Admins and owners can manage members
CREATE POLICY "Admins can manage members" ON org_members
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Org Invites: Admins can manage invites
CREATE POLICY "Admins can manage invites" ON org_invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM org_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- 7. UPDATE EXISTING RLS POLICIES
-- ============================================

-- Tasks: Scope to organization
DROP POLICY IF EXISTS "Users can view tasks" ON tasks;
CREATE POLICY "Users can view org tasks" ON tasks
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
CREATE POLICY "Users can create org tasks" ON tasks
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update tasks" ON tasks;
CREATE POLICY "Users can update org tasks" ON tasks
  FOR UPDATE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete tasks" ON tasks;
CREATE POLICY "Users can delete org tasks" ON tasks
  FOR DELETE USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Task Comments: Scope to organization
DROP POLICY IF EXISTS "Users can view comments on tasks they can see" ON task_comments;
CREATE POLICY "Users can view org task comments" ON task_comments
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can create comments" ON task_comments;
CREATE POLICY "Users can create org task comments" ON task_comments
  FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
  );

-- Attachments: Scope to organization (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attachments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view attachments" ON attachments';
    EXECUTE 'CREATE POLICY "Users can view org attachments" ON attachments
      FOR SELECT USING (
        org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
      )';
  END IF;
END $$;

-- ============================================
-- 8. FUNCTIONS
-- ============================================

-- Function to create default organization for new users
CREATE OR REPLACE FUNCTION create_default_organization()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
  org_slug TEXT;
BEGIN
  -- Generate unique slug from username or email
  org_slug := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  ) || '-' || substring(NEW.id::text from 1 for 8);
  
  -- Create organization
  INSERT INTO organizations (name, slug, plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Organization'),
    org_slug,
    'free'
  )
  RETURNING id INTO new_org_id;
  
  -- Add user as owner
  INSERT INTO org_members (org_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'owner');
  
  -- Set as current org in profile
  UPDATE profiles 
  SET current_org_id = new_org_id 
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create org on user signup
DROP TRIGGER IF EXISTS on_user_create_org ON auth.users;
CREATE TRIGGER on_user_create_org
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_organization();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for organizations
DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
SELECT 'Multi-tenancy schema created successfully!' as status;
