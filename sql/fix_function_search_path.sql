-- Fix Function Search Path Mutable Security Warnings
-- This sets search_path to prevent SQL injection attacks via search_path manipulation

-- 1. Fix generate_api_key function
CREATE OR REPLACE FUNCTION public.generate_api_key()
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

-- 2. Fix create_default_organization function
CREATE OR REPLACE FUNCTION public.create_default_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
BEGIN
  INSERT INTO public.organizations (name, plan, created_by)
  VALUES (NEW.full_name || '''s Organization', 'free', NEW.id)
  RETURNING id INTO new_org_id;
  
  UPDATE public.profiles
  SET current_org_id = new_org_id
  WHERE id = NEW.id;
  
  INSERT INTO public.org_members (org_id, user_id, role)
  VALUES (new_org_id, NEW.id, 'admin');
  
  RETURN NEW;
END;
$$;

-- 3. Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. Fix is_org_member function
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_members.org_id = is_org_member.org_id
    AND org_members.user_id = auth.uid()
  );
END;
$$;

-- 5. Fix is_org_admin function
CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.org_members
    WHERE org_members.org_id = is_org_admin.org_id
    AND org_members.user_id = auth.uid()
    AND org_members.role = 'admin'
  );
END;
$$;

-- 6. Fix create_notification function
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.assigned_to IS NOT NULL AND NEW.assigned_to != OLD.assigned_to THEN
    INSERT INTO public.notifications (user_id, type, title, message, related_task_id, org_id)
    VALUES (
      NEW.assigned_to,
      'task_assigned',
      'New Task Assigned',
      'You have been assigned to: ' || NEW.title,
      NEW.id,
      NEW.org_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- 7. Fix process_automation_triggers function
CREATE OR REPLACE FUNCTION public.process_automation_triggers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  automation RECORD;
  trigger_config JSONB;
  action_config JSONB;
BEGIN
  FOR automation IN
    SELECT * FROM public.automations
    WHERE org_id = NEW.org_id
    AND is_active = true
  LOOP
    trigger_config := automation.trigger_config;
    action_config := automation.action_config;
    
    IF automation.trigger_type = 'status_change' THEN
      IF trigger_config->>'from_status' = OLD.status 
         AND trigger_config->>'to_status' = NEW.status THEN
        
        IF automation.action_type = 'send_notification' THEN
          INSERT INTO public.notifications (user_id, type, title, message, related_task_id, org_id)
          VALUES (
            NEW.assigned_to,
            'automation',
            action_config->>'title',
            action_config->>'message',
            NEW.id,
            NEW.org_id
          );
        ELSIF automation.action_type = 'update_field' THEN
          EXECUTE format('UPDATE public.tasks SET %I = %L WHERE id = %L',
            action_config->>'field',
            action_config->>'value',
            NEW.id
          );
        END IF;
      END IF;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- 8. Fix get_user_current_org function
CREATE OR REPLACE FUNCTION public.get_user_current_org()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT current_org_id INTO org_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN org_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.generate_api_key() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_org_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_current_org() TO authenticated;
