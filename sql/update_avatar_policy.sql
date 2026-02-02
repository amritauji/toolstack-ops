-- Drop existing policy and create new one that allows uploads during signup
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );