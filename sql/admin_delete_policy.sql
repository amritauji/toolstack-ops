-- Allow admins to delete all tasks
CREATE POLICY "Admins can delete all tasks" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );