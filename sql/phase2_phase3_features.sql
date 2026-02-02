-- Phase 2: Projects/Workspaces
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#7c6df2',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add project_id to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Phase 3: Time Tracking
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 3: Automations
CREATE TABLE IF NOT EXISTS automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL, -- status_change, priority_change, due_date_approaching, etc.
  condition TEXT, -- JSON or simple condition string
  action TEXT NOT NULL, -- assign_user, change_priority, send_notification, etc.
  value TEXT, -- action parameter
  enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Fields (Phase 2)
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- text, number, date, select, multi_select
  options JSONB, -- for select/multi_select fields
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_custom_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  field_id UUID REFERENCES custom_fields(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, field_id)
);

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_custom_values ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view all projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their projects" ON projects FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their projects" ON projects FOR DELETE USING (auth.uid() = created_by);

-- Time entries policies
CREATE POLICY "Users can view all time entries" ON time_entries FOR SELECT USING (true);
CREATE POLICY "Users can create their time entries" ON time_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their time entries" ON time_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their time entries" ON time_entries FOR DELETE USING (auth.uid() = user_id);

-- Automations policies
CREATE POLICY "Users can view all automations" ON automations FOR SELECT USING (true);
CREATE POLICY "Users can create automations" ON automations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their automations" ON automations FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their automations" ON automations FOR DELETE USING (auth.uid() = created_by);

-- Custom fields policies
CREATE POLICY "Users can view all custom fields" ON custom_fields FOR SELECT USING (true);
CREATE POLICY "Users can create custom fields" ON custom_fields FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update custom fields" ON custom_fields FOR UPDATE USING (true);
CREATE POLICY "Users can delete custom fields" ON custom_fields FOR DELETE USING (true);

-- Task custom values policies
CREATE POLICY "Users can view all task custom values" ON task_custom_values FOR SELECT USING (true);
CREATE POLICY "Users can create task custom values" ON task_custom_values FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update task custom values" ON task_custom_values FOR UPDATE USING (true);
CREATE POLICY "Users can delete task custom values" ON task_custom_values FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_enabled ON automations(enabled);
CREATE INDEX IF NOT EXISTS idx_custom_fields_project_id ON custom_fields(project_id);
CREATE INDEX IF NOT EXISTS idx_task_custom_values_task_id ON task_custom_values(task_id);