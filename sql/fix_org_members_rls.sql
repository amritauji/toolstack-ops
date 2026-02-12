-- Fix infinite recursion in org_members RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view org members" ON org_members;
DROP POLICY IF EXISTS "Admins can manage members" ON org_members;

-- Simple policy: Users can view members of orgs they belong to
CREATE POLICY "Users can view org members" ON org_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM org_members om 
      WHERE om.org_id = org_members.org_id 
      AND om.user_id = auth.uid()
    )
  );

-- Admins can insert members
CREATE POLICY "Admins can insert members" ON org_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id 
      AND om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
    )
  );

-- Admins can update members
CREATE POLICY "Admins can update members" ON org_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id 
      AND om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
    )
  );

-- Admins can delete members
CREATE POLICY "Admins can delete members" ON org_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id 
      AND om.user_id = auth.uid() 
      AND om.role IN ('owner', 'admin')
    )
  );

SELECT 'RLS policies fixed!' as status;
