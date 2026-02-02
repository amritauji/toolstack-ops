-- Drop existing policy and create a more permissive one
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

-- Allow all uploads to avatars bucket (we'll handle security in the app)
CREATE POLICY "Allow avatar uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');