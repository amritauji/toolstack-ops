-- Complete fix for org_members RLS recursion
-- This uses a security definer function to break the recursion

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view org members" ON org_members;
DROP POLICY IF EXISTS "Admins can manage members" ON org_members;
DROP POLICY IF EXISTS "Admins can insert members" ON org_members;
DROP POLICY IF EXISTS "Admins can update members" ON org_members;
DROP POLICY IF EXISTS "Admins can delete members" ON org_members;

-- Create helper function to check org membership (security definer to bypass RLS)
CREATE OR REPLACE FUNCTION is_org_member(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id = org_uuid 
    AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user is admin/owner
CREATE OR REPLACE FUNCTION is_org_admin(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members 
    WHERE org_id = org_uuid 
    AND user_id = user_uuid 
    AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create simple policies using these functions
CREATE POLICY "Users can view org members" ON org_members
  FOR SELECT USING (
    is_org_member(org_id, auth.uid())
  );

CREATE POLICY "Admins can insert members" ON org_members
  FOR INSERT WITH CHECK (
    is_org_admin(org_id, auth.uid())
  );

CREATE POLICY "Admins can update members" ON org_members
  FOR UPDATE USING (
    is_org_admin(org_id, auth.uid())
  );

CREATE POLICY "Admins can delete members" ON org_members
  FOR DELETE USING (
    is_org_admin(org_id, auth.uid())
  );

SELECT 'RLS policies fixed with security definer functions!' as status;
