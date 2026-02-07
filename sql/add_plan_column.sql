-- Add plan column to profiles table for plan enforcement

-- Add plan column (default to 'free')
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise'));

-- Add index for faster plan queries
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);

-- Update existing users to free plan if null
UPDATE profiles SET plan = 'free' WHERE plan IS NULL;

-- Add comment
COMMENT ON COLUMN profiles.plan IS 'User subscription plan: free, starter, professional, or enterprise';
