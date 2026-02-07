-- MINIMAL DEVELOPER ROLE SETUP
-- Run this script in Supabase SQL Editor

-- Step 1: Add developer role
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'developer'));

-- Step 2: Developer policies for profiles
CREATE POLICY "Developers can view all profiles" ON profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers can update any profile" ON profiles
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers can delete any profile" ON profiles
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

-- Step 3: Developer policies for tasks
CREATE POLICY "Developers can view all tasks" ON tasks
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

CREATE POLICY "Developers can delete any task" ON tasks
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'developer'
    )
  );

-- Step 4: Cascade deletes for tasks
ALTER TABLE tasks 
  DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;

ALTER TABLE tasks 
  ADD CONSTRAINT tasks_created_by_fkey 
  FOREIGN KEY (created_by) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE tasks 
  DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;

ALTER TABLE tasks 
  ADD CONSTRAINT tasks_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- Step 5: Promotion function
CREATE OR REPLACE FUNCTION promote_first_developer(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET role = 'developer' 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Now run: SELECT promote_first_developer('your-email@example.com');
