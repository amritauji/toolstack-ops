-- Add org_id to all tables and update RLS policies

-- 1. Ensure tasks has org_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='tasks' AND column_name='org_id') THEN
    ALTER TABLE tasks ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_tasks_org ON tasks(org_id);
  END IF;
END $$;

-- Update tasks RLS policies
DROP POLICY IF EXISTS "Users can view org tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create org tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update org tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete org tasks" ON tasks;

CREATE POLICY "Users can view org tasks" ON tasks
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can create org tasks" ON tasks
  FOR INSERT WITH CHECK (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can update org tasks" ON tasks
  FOR UPDATE USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can delete org tasks" ON tasks
  FOR DELETE USING (is_org_member(org_id, auth.uid()));

-- 2. Ensure task_comments has org_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='task_comments' AND column_name='org_id') THEN
    ALTER TABLE task_comments ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_task_comments_org ON task_comments(org_id);
  END IF;
END $$;

-- Update task_comments RLS policies
DROP POLICY IF EXISTS "Users can view org comments" ON task_comments;
DROP POLICY IF EXISTS "Users can create org comments" ON task_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON task_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON task_comments;

CREATE POLICY "Users can view org comments" ON task_comments
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can create org comments" ON task_comments
  FOR INSERT WITH CHECK (user_id = auth.uid() AND is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can update own comments" ON task_comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments" ON task_comments
  FOR DELETE USING (user_id = auth.uid());

-- 3. Ensure task_attachments has org_id
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='task_attachments' AND column_name='org_id') THEN
    ALTER TABLE task_attachments ADD COLUMN org_id UUID REFERENCES organizations(id) ON DELETE CASCADE;
    CREATE INDEX idx_task_attachments_org ON task_attachments(org_id);
  END IF;
END $$;

-- Update task_attachments RLS policies
DROP POLICY IF EXISTS "Users can view org attachments" ON task_attachments;
DROP POLICY IF EXISTS "Users can create org attachments" ON task_attachments;
DROP POLICY IF EXISTS "Users can delete own attachments" ON task_attachments;

CREATE POLICY "Users can view org attachments" ON task_attachments
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can create org attachments" ON task_attachments
  FOR INSERT WITH CHECK (user_id = auth.uid() AND is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can delete own attachments" ON task_attachments
  FOR DELETE USING (user_id = auth.uid());

-- 4. Function to get user's current org
CREATE OR REPLACE FUNCTION get_user_current_org(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  current_org UUID;
BEGIN
  SELECT current_org_id INTO current_org
  FROM profiles
  WHERE id = p_user_id;
  
  RETURN current_org;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Org-scoped tables migration completed!' as status;
