-- Cleanup script for laluvan_logs table
-- Run this periodically to manage storage and performance

-- 1. Delete logs older than 90 days (keep 3 months of data)
DELETE FROM laluvan_logs 
WHERE timestamp < NOW() - INTERVAL '90 days';

-- 2. Delete duplicate entries (same IP, same page, within 1 minute)
DELETE FROM laluvan_logs 
WHERE id NOT IN (
    SELECT MIN(id)
    FROM laluvan_logs
    GROUP BY ip, page, DATE_TRUNC('minute', timestamp)
);

-- 3. Create a function for automatic cleanup
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    -- Delete logs older than 90 days
    DELETE FROM laluvan_logs 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete duplicate entries
    DELETE FROM laluvan_logs 
    WHERE id NOT IN (
        SELECT MIN(id)
        FROM laluvan_logs
        GROUP BY ip, page, DATE_TRUNC('minute', timestamp)
    );
    
    RAISE NOTICE 'Cleaned up old logs successfully';
END;
$$ LANGUAGE plpgsql;

-- 4. Optional: Set up automatic cleanup (run this once)
-- You can set up a cron job in Supabase dashboard to run this daily
-- SELECT cleanup_old_logs();

-- 5. Create indexes for better performance (run this once)
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON laluvan_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_ip ON laluvan_logs(ip);
CREATE INDEX IF NOT EXISTS idx_logs_session ON laluvan_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_logs_event_type ON laluvan_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_logs_country ON laluvan_logs(country);
CREATE INDEX IF NOT EXISTS idx_logs_city ON laluvan_logs(city);

-- 6. View table size and row count
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'laluvan_logs';
