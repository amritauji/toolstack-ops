-- Complete SaaS Features Migration
-- Time tracking, automations, saved filters, notifications

-- 1. Time Entries Table
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_time_entries_task ON time_entries(task_id);
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_time_entries_org ON time_entries(org_id);

ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org time entries" ON time_entries
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can create own time entries" ON time_entries
  FOR INSERT WITH CHECK (user_id = auth.uid() AND is_org_member(org_id, auth.uid()));

CREATE POLICY "Users can update own time entries" ON time_entries
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own time entries" ON time_entries
  FOR DELETE USING (user_id = auth.uid());

-- 2. Automations Table
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- status_change, priority_change, due_date_approaching, task_created, overdue
  trigger_config JSONB NOT NULL DEFAULT '{}',
  action_type TEXT NOT NULL, -- assign_user, change_status, change_priority, send_notification
  action_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automations_org ON automations(org_id);
CREATE INDEX idx_automations_trigger ON automations(trigger_type) WHERE is_active = true;

ALTER TABLE automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view automations" ON automations
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Org admins can manage automations" ON automations
  FOR ALL USING (is_org_admin(org_id, auth.uid()));

-- 3. Saved Filters Table
CREATE TABLE IF NOT EXISTS saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filter_config JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_filters_user ON saved_filters(user_id);
CREATE INDEX idx_saved_filters_org ON saved_filters(org_id);

ALTER TABLE saved_filters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own filters" ON saved_filters
  FOR ALL USING (user_id = auth.uid());

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- task_assigned, comment_added, status_changed, mention
  title TEXT NOT NULL,
  message TEXT,
  resource_type TEXT, -- task, project, comment
  resource_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_org ON notifications(org_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- 5. Projects Table (if not exists)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_org ON projects(org_id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view projects" ON projects
  FOR SELECT USING (is_org_member(org_id, auth.uid()));

CREATE POLICY "Org admins can manage projects" ON projects
  FOR ALL USING (is_org_admin(org_id, auth.uid()));

-- 6. Add project_id to tasks if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='tasks' AND column_name='project_id') THEN
    ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    CREATE INDEX idx_tasks_project ON tasks(project_id);
  END IF;
END $$;

-- 7. Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_org_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, org_id, type, title, message, resource_type, resource_id)
  VALUES (p_user_id, p_org_id, p_type, p_title, p_message, p_resource_type, p_resource_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function to process automations
CREATE OR REPLACE FUNCTION process_automation_triggers(
  p_trigger_type TEXT,
  p_task_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
) RETURNS void AS $$
DECLARE
  automation RECORD;
BEGIN
  FOR automation IN 
    SELECT * FROM automations 
    WHERE trigger_type = p_trigger_type AND is_active = true
  LOOP
    -- Log automation execution (simplified - would need actual action execution)
    RAISE NOTICE 'Automation % triggered for task %', automation.name, p_task_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Complete SaaS features migration completed!' as status;
