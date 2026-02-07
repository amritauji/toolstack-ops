-- Add API key column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS api_key TEXT;

-- Create index for faster API key lookups
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(api_key);

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  random_token TEXT;
BEGIN
  -- Generate random 32-character token
  random_token := encode(gen_random_bytes(24), 'base64');
  random_token := replace(random_token, '/', '_');
  random_token := replace(random_token, '+', '-');
  
  -- Return format: user_id:token
  RETURN user_id || ':' || random_token;
END;
$$ LANGUAGE plpgsql;
