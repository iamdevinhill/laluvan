-- Laluvan Website Analytics Queries
-- Use these queries in your Supabase SQL Editor to analyze visitor data

-- 1. Basic Visitor Statistics
SELECT 
    COUNT(*) as total_visitors,
    COUNT(DISTINCT ip) as unique_ips,
    COUNT(DISTINCT session_id) as unique_sessions,
    MIN(timestamp) as first_visit,
    MAX(timestamp) as last_visit
FROM laluvan_logs;

-- 2. Visitors by Country (Top 10)
SELECT 
    country,
    COUNT(*) as visitor_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM laluvan_logs), 2) as percentage
FROM laluvan_logs 
WHERE country != 'unknown'
GROUP BY country 
ORDER BY visitor_count DESC 
LIMIT 10;

-- 3. Visitors by City (Top 10)
SELECT 
    city,
    country,
    COUNT(*) as visitor_count
FROM laluvan_logs 
WHERE city != 'unknown'
GROUP BY city, country 
ORDER BY visitor_count DESC 
LIMIT 10;

-- 4. Daily Visitor Trends (Last 30 days)
SELECT 
    DATE(timestamp) as visit_date,
    COUNT(*) as daily_visitors,
    COUNT(DISTINCT ip) as unique_daily_visitors
FROM laluvan_logs 
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY visit_date DESC;

-- 5. Hourly Visitor Patterns
SELECT 
    EXTRACT(HOUR FROM timestamp) as hour_of_day,
    COUNT(*) as visitor_count
FROM laluvan_logs 
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY hour_of_day;

-- 6. Most Popular Pages
SELECT 
    page,
    COUNT(*) as page_views,
    COUNT(DISTINCT ip) as unique_visitors
FROM laluvan_logs 
GROUP BY page 
ORDER BY page_views DESC;

-- 7. User Agent Analysis (Top Browsers/Devices)
SELECT 
    CASE 
        WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
        WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
        WHEN user_agent LIKE '%Safari%' THEN 'Safari'
        WHEN user_agent LIKE '%Edge%' THEN 'Edge'
        ELSE 'Other'
    END as browser,
    COUNT(*) as user_count
FROM laluvan_logs 
GROUP BY browser 
ORDER BY user_count DESC;

-- 8. Mobile vs Desktop Usage
SELECT 
    CASE 
        WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%Android%' OR user_agent LIKE '%iPhone%' THEN 'Mobile'
        ELSE 'Desktop'
    END as device_type,
    COUNT(*) as user_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM laluvan_logs), 2) as percentage
FROM laluvan_logs 
GROUP BY device_type;

-- 9. Form Submission Analytics
SELECT 
    COUNT(*) as total_form_submissions,
    COUNT(DISTINCT ip) as unique_submitters,
    COUNT(DISTINCT session_id) as unique_sessions_with_submissions
FROM laluvan_logs 
WHERE event_type = 'form_submission';

-- 10. Social Media Click Analytics
SELECT 
    platform,
    COUNT(*) as click_count
FROM laluvan_logs 
WHERE event_type = 'social_click'
GROUP BY platform 
ORDER BY click_count DESC;

-- 11. Session Duration Analysis
SELECT 
    session_id,
    MIN(timestamp) as session_start,
    MAX(timestamp) as session_end,
    EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) as session_duration_seconds,
    COUNT(*) as page_views_in_session
FROM laluvan_logs 
WHERE session_id IS NOT NULL
GROUP BY session_id
ORDER BY session_duration_seconds DESC;

-- 12. Referrer Analysis
SELECT 
    referrer,
    COUNT(*) as visitor_count
FROM laluvan_logs 
WHERE referrer != 'direct'
GROUP BY referrer 
ORDER BY visitor_count DESC;

-- 13. Screen Resolution Analysis
SELECT 
    screen_resolution,
    COUNT(*) as user_count
FROM laluvan_logs 
WHERE screen_resolution IS NOT NULL
GROUP BY screen_resolution 
ORDER BY user_count DESC;

-- 14. Recent Activity (Last 24 hours)
SELECT 
    timestamp,
    ip,
    country,
    city,
    page,
    event_type
FROM laluvan_logs 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

-- 15. Peak Traffic Hours
SELECT 
    EXTRACT(HOUR FROM timestamp) as hour,
    COUNT(*) as visitor_count,
    ROUND(AVG(COUNT(*)) OVER (), 2) as average_visitors_per_hour
FROM laluvan_logs 
GROUP BY EXTRACT(HOUR FROM timestamp)
ORDER BY visitor_count DESC;

-- 16. Geographic Heat Map Data
SELECT 
    country,
    city,
    region,
    COUNT(*) as visitor_count
FROM laluvan_logs 
WHERE country != 'unknown' AND city != 'unknown'
GROUP BY country, city, region
ORDER BY visitor_count DESC;

-- 17. Engagement Metrics
SELECT 
    AVG(page_views) as avg_page_views_per_session,
    AVG(EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp)))) as avg_session_duration_seconds
FROM (
    SELECT 
        session_id,
        COUNT(*) as page_views,
        MIN(timestamp) as min_time,
        MAX(timestamp) as max_time
    FROM laluvan_logs 
    WHERE session_id IS NOT NULL
    GROUP BY session_id
) session_stats;

-- 18. Content Performance (Music/Merch Interactions)
SELECT 
    event_type,
    action,
    COUNT(*) as interaction_count
FROM laluvan_logs 
WHERE event_type IN ('music_interaction', 'merch_interaction')
GROUP BY event_type, action
ORDER BY interaction_count DESC;
