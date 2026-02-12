-- Add status column to org_invites table

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='org_invites' AND column_name='status'
  ) THEN
    ALTER TABLE org_invites 
    ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked'));
    
    CREATE INDEX idx_org_invites_status ON org_invites(status);
    
    -- Update existing records based on accepted_at
    UPDATE org_invites 
    SET status = 'accepted' 
    WHERE accepted_at IS NOT NULL;
    
    UPDATE org_invites 
    SET status = 'expired' 
    WHERE accepted_at IS NULL AND expires_at < NOW();
  END IF;
END $$;

SELECT 'org_invites status column added!' as status;
