-- Fix Function Search Path Mutable Security Warnings
-- This sets search_path to prevent SQL injection attacks via search_path manipulation

-- 1. Fix is_org_member function
CREATE OR REPLACE FUNCTION is_org_member(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id = org_uuid 
    AND user_id = user_uuid
  );
END;
$$;

-- 2. Fix is_org_admin function
CREATE OR REPLACE FUNCTION is_org_admin(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id = org_uuid 
    AND user_id = user_uuid 
    AND role IN ('owner', 'admin')
  );
END;
$$;

-- 3. Fix create_notification function
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_org_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, org_id, type, title, message, resource_type, resource_id)
  VALUES (p_user_id, p_org_id, p_type, p_title, p_message, p_resource_type, p_resource_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 4. Fix process_automation_triggers function
CREATE OR REPLACE FUNCTION process_automation_triggers(
  p_trigger_type TEXT,
  p_task_id UUID,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  automation RECORD;
BEGIN
  FOR automation IN 
    SELECT * FROM automations 
    WHERE trigger_type = p_trigger_type AND is_active = true
  LOOP
    RAISE NOTICE 'Automation % triggered for task %', automation.name, p_task_id;
  END LOOP;
END;
$$;

-- 5. Fix get_user_current_org function (if exists)
CREATE OR REPLACE FUNCTION get_user_current_org()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT current_org_id INTO org_id
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN org_id;
END;
$$;

-- 6. Fix generate_api_key function (if exists)
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  api_key TEXT;
BEGIN
  api_key := encode(gen_random_bytes(32), 'base64');
  api_key := replace(api_key, '/', '_');
  api_key := replace(api_key, '+', '-');
  RETURN api_key;
END;
$$;

SELECT 'Function search_path security warnings fixed!' as status;
