-- Enable Realtime for Tables
-- This allows Supabase Realtime subscriptions for live updates

-- Enable realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable realtime for task_comments table
ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;

-- Enable realtime for notifications table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Enable realtime for time_entries table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'time_entries') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE time_entries;
  END IF;
END $$;

SELECT 'Realtime enabled for tables!' as status;
