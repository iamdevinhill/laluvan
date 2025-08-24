-- Cleanup script for rate_limits table
-- Run this periodically (daily/weekly) to keep the table size manageable

-- Delete rate limit entries older than 24 hours
DELETE FROM rate_limits 
WHERE created_at < NOW() - INTERVAL '24 hours';

-- Optional: Create a function to auto-cleanup (run this once)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Optional: Set up a cron job to run this automatically
-- You can do this in Supabase dashboard under Database > Functions > Scheduled Functions
