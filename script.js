// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Supabase configuration - Use global variables
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

console.log('🔧 Supabase config in script.js:', {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY ? '***' + SUPABASE_ANON_KEY.slice(-4) : 'undefined'
});

// Check if config values are available
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase configuration!');
    console.error('❌ SUPABASE_URL:', SUPABASE_URL);
    console.error('❌ SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '***' + SUPABASE_ANON_KEY.slice(-4) : 'undefined');
}

// Initialize Supabase client when library is available
let supabaseClient = null;

function initializeSupabase() {
    if (typeof supabase !== 'undefined') {
        console.log('🔧 Supabase library available:', true);
        console.log('🔧 Supabase library version:', supabase.version);
        console.log('🔧 Supabase createClient method:', typeof supabase.createClient);
        
        try {
            // Check if config values are available
            if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
                console.error('❌ Missing Supabase configuration!');
                console.error('❌ SUPABASE_URL:', window.SUPABASE_URL);
                console.error('❌ SUPABASE_ANON_KEY:', window.SUPABASE_ANON_KEY ? '***' + window.SUPABASE_ANON_KEY.slice(-4) : 'undefined');
                return;
            }
            
            supabaseClient = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized:', supabaseClient);
            console.log('🔧 Supabase client methods:', Object.keys(supabaseClient));
            console.log('🔧 Supabase client from method:', typeof supabaseClient.from);
            
            // Trigger a custom event when Supabase is ready
            window.dispatchEvent(new CustomEvent('supabaseReady'));
            
            // Test if the laluvan_logs table is accessible
            console.log('🔍 Testing table access...');
            testSupabaseConnection().then(success => {
                if (success) {
                    console.log('✅ Supabase fully initialized and ready');
                } else {
                    console.error('❌ Supabase initialization incomplete');
                }
            });
        } catch (error) {
            console.error('❌ Error initializing Supabase client:', error);
        }
    } else {
        console.log('🔧 Supabase library not yet available, retrying...');
        setTimeout(initializeSupabase, 100);
    }
}

// Enhanced visitor tracking
let sessionId = null;
let pageViews = 0;
let hasLoggedInitialVisit = false; // Prevent duplicate initial logs

// IP address caching system
const ipCache = new Map();
const IP_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const IP_CACHE_MAX_SIZE = 100; // Maximum number of cached IPs

// Database rate limiting to prevent duplicate logs
const dbRateLimit = new Map();
const DB_RATE_LIMIT_DURATION = 30 * 1000; // 30 seconds between logs for same IP

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Check if IP is rate limited (prevent duplicate logs)
function isIpRateLimited(ip) {
    if (!ip || ip === 'unknown') return false;
    
    const now = Date.now();
    const lastLogTime = dbRateLimit.get(ip);
    
    if (lastLogTime && (now - lastLogTime) < DB_RATE_LIMIT_DURATION) {
        const remainingTime = Math.ceil((DB_RATE_LIMIT_DURATION - (now - lastLogTime)) / 1000);
        console.log(`⏰ IP ${ip} is rate limited. Wait ${remainingTime}s before next log.`);
        return true;
    }
    
    return false;
}

// Mark IP as recently logged
function markIpAsLogged(ip) {
    if (!ip || ip === 'unknown') return;
    dbRateLimit.set(ip, Date.now());
    
    // Clean up old rate limit entries (keep only last 1000 entries)
    if (dbRateLimit.size > 1000) {
        const entries = Array.from(dbRateLimit.entries());
        entries.sort((a, b) => a[1] - b[1]);
        const toRemove = entries.slice(0, 500); // Remove oldest 500 entries
        toRemove.forEach(([key]) => dbRateLimit.delete(key));
        console.log(`🧹 Cleaned up ${toRemove.length} old rate limit entries`);
    }
}

// Get IP and location data with caching
async function getIpAndLocation() {
    try {
        // First, try to get the current IP without making an API call
        // This helps us check if we already have valid cached data
        let currentIp = 'unknown';
        
        // Check if we have a cached IP that's still valid
        const cachedData = ipCache.get('current_ip');
        if (cachedData && (Date.now() - cachedData.timestamp) < IP_CACHE_DURATION) {
            console.log('🌍 Using cached IP data:', cachedData.data);
            return cachedData.data;
        }
        
        // If no valid cache, fetch new data
        console.log('🌍 Fetching new IP and location data...');
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        currentIp = data.ip || 'unknown';
        
        const locationData = {
            ip: currentIp,
            country: data.country_name || 'unknown',
            city: data.city || 'unknown',
            region: data.region || 'unknown'
        };
        
        // Cache the new data with the IP as a key for better tracking
        ipCache.set('current_ip', {
            data: locationData,
            timestamp: Date.now()
        });
        
        // Also cache by IP address for potential future use
        if (currentIp !== 'unknown') {
            ipCache.set(currentIp, {
                data: locationData,
                timestamp: Date.now()
            });
        }
        
        // Clean up old cache entries if we exceed max size
        if (ipCache.size > IP_CACHE_MAX_SIZE) {
            const entries = Array.from(ipCache.entries());
            // Sort by timestamp and remove oldest entries
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const toRemove = entries.slice(0, Math.floor(IP_CACHE_MAX_SIZE / 2)); // Remove half
            toRemove.forEach(([key]) => ipCache.delete(key));
            console.log(`🧹 Cleaned up ${toRemove.length} old cache entries`);
        }
        
        console.log('🌍 New location data retrieved and cached:', locationData);
        return locationData;
        
    } catch (error) {
        console.log('⚠️ Could not retrieve location data:', error.message);
        
        // Return cached data even if expired, or fallback values
        const cachedData = ipCache.get('current_ip');
        if (cachedData) {
            console.log('🌍 Using expired cached data as fallback:', cachedData.data);
            return cachedData.data;
        }
        
        return {
            ip: 'unknown',
            country: 'unknown',
            city: 'unknown',
            region: 'unknown'
        };
    }
}

// Test Supabase connection and table access
// IMPORTANT: This function only tests read access, never deletes any logs
async function testSupabaseConnection() {
    if (!supabaseClient) {
        console.log('⚠️ Supabase client not available for testing');
        return false;
    }
    
    try {
        console.log('🔍 Testing Supabase connection...');
        
        // Test basic connection - ONLY READ ACCESS, NEVER DELETE
        const { data, error } = await supabaseClient
            .from('laluvan_logs')
            .select('count', { count: 'exact', head: true });
            
        if (error) {
            console.error('❌ Supabase connection test failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        console.log('✅ Table access confirmed');
        console.log('✅ Logs are safe - no delete operations performed');
        return true;
        
    } catch (error) {
        console.error('❌ Error testing Supabase connection:', error);
        return false;
    }
}

// Manual test function for visitor logging (can be called from console)
window.testVisitorLogging = async function() {
    console.log('🧪 Manual test of visitor logging...');
    console.log('🔧 Supabase client available:', !!supabaseClient);
    console.log('🔧 Session ID:', sessionId);
    console.log('🔧 Page views:', pageViews);
    
    if (supabaseClient) {
        await logVisitor({ event_type: 'manual_test' });
    } else {
        console.log('❌ Supabase client not available for testing');
    }
};

// Cache management functions (can be called from console)
window.clearIpCache = function() {
    const size = ipCache.size;
    ipCache.clear();
    console.log(`🧹 IP cache cleared (removed ${size} entries)`);
};

window.showIpCache = function() {
    console.log('📋 IP Cache Status:');
    console.log('🔧 Cache size:', ipCache.size);
    console.log('🔧 Max size:', IP_CACHE_MAX_SIZE);
    console.log('🔧 Cache duration:', IP_CACHE_DURATION / 1000, 'seconds');
    
    if (ipCache.size === 0) {
        console.log('  📭 Cache is empty');
        return;
    }
    
    for (const [key, value] of ipCache.entries()) {
        const age = Date.now() - value.timestamp;
        const ageSeconds = Math.floor(age / 1000);
        const isValid = age < IP_CACHE_DURATION;
        const status = isValid ? '✅' : '⏰';
        console.log(`  ${status} ${key}: ${ageSeconds}s old, valid: ${isValid}`, value.data);
    }
};

window.refreshIpData = async function() {
    console.log('🔄 Manually refreshing IP data...');
    ipCache.delete('current_ip'); // Force refresh
    const newData = await getIpAndLocation();
    console.log('✅ New IP data:', newData);
    return newData;
};

window.getCacheStats = function() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;
    let totalAge = 0;
    
    for (const [key, value] of ipCache.entries()) {
        const age = now - value.timestamp;
        if (age < IP_CACHE_DURATION) {
            validEntries++;
        } else {
            expiredEntries++;
        }
        totalAge += age;
    }
    
    const avgAge = ipCache.size > 0 ? Math.floor(totalAge / ipCache.size / 1000) : 0;
    
    console.log('📊 Cache Statistics:');
    console.log(`  📈 Total entries: ${ipCache.size}`);
    console.log(`  ✅ Valid entries: ${validEntries}`);
    console.log(`  ⏰ Expired entries: ${expiredEntries}`);
    console.log(`  ⏱️ Average age: ${avgAge}s`);
    console.log(`  🎯 Cache hit rate: ${validEntries > 0 ? Math.round((validEntries / ipCache.size) * 100) : 0}%`);
};

// Rate limiting management functions (can be called from console)
window.showRateLimits = function() {
    console.log('⏰ Rate Limit Status:');
    console.log(`🔧 Rate limit duration: ${DB_RATE_LIMIT_DURATION / 1000} seconds`);
    console.log(`📈 Total rate limited IPs: ${dbRateLimit.size}`);
    
    if (dbRateLimit.size === 0) {
        console.log('  📭 No rate limited IPs');
        return;
    }
    
    const now = Date.now();
    for (const [ip, timestamp] of dbRateLimit.entries()) {
        const age = now - timestamp;
        const remainingTime = Math.ceil((DB_RATE_LIMIT_DURATION - age) / 1000);
        const isActive = age < DB_RATE_LIMIT_DURATION;
        const status = isActive ? '⏰' : '✅';
        console.log(`  ${status} ${ip}: ${remainingTime > 0 ? remainingTime + 's remaining' : 'expired'}`);
    }
};

window.clearRateLimits = function() {
    const size = dbRateLimit.size;
    dbRateLimit.clear();
    console.log(`🧹 Rate limits cleared (removed ${size} entries)`);
};

window.setRateLimitDuration = function(seconds) {
    const oldDuration = DB_RATE_LIMIT_DURATION / 1000;
    DB_RATE_LIMIT_DURATION = seconds * 1000;
    console.log(`⚙️ Rate limit duration changed from ${oldDuration}s to ${seconds}s`);
};

// Enhanced visitor logging with session tracking
// NOTE: Current table schema only supports basic fields (ip, user_agent, timestamp, page, country, city, region)
// To enable full tracking, add these fields to your laluvan_logs table:
// ALTER TABLE public.laluvan_logs ADD COLUMN session_id text null, ADD COLUMN page_views integer null, ADD COLUMN screen_resolution text null, ADD COLUMN viewport text null, ADD COLUMN referrer text null;
async function logVisitor(additionalData = {}) {
    try {
        // Generate session ID if not exists
        if (!sessionId) {
            sessionId = generateSessionId();
            pageViews = 1;
        } else {
            pageViews++;
        }

        // Get current page info
        const page = window.location.pathname || '/';
        
        // Get user agent
        const userAgent = navigator.userAgent;
        
        // Get screen resolution and viewport
        const screenResolution = `${screen.width}x${screen.height}`;
        const viewport = `${window.innerWidth}x${window.innerHeight}`;
        
        // Get referrer
        const referrer = document.referrer || 'direct';
        
        // Get IP address and location data with caching
        const locationData = await getIpAndLocation();
        const { ip, country, city, region } = locationData;
        
        // Check if IP is rate limited
        if (isIpRateLimited(ip)) {
            console.log('⚠️ IP rate limited, skipping visitor log.');
            return;
        }

        // Mark IP as logged
        markIpAsLogged(ip);

        // Prepare log data - only include fields that exist in the table
        const logData = {
            ip: ip,
            user_agent: userAgent,
            timestamp: new Date().toISOString(),
            page: page,
            country: country,
            city: city,
            region: region
            // Note: session_id, page_views, screen_resolution, viewport, referrer 
            // are not included as they don't exist in the current table schema
        };
        
        console.log('📊 Logging visitor:', logData);
        
        // Check if Supabase client is available
        if (!supabaseClient) {
            console.log('⚠️ Supabase client not available, skipping visitor log');
            return;
        }
        
        // Test connection before attempting to log
        const connectionOk = await testSupabaseConnection();
        if (!connectionOk) {
            console.log('⚠️ Supabase connection test failed, skipping visitor log');
            return;
        }
        
        // Send to Supabase
        console.log('🚀 Attempting to insert into laluvan_logs table...');
        console.log('🔧 Table name: laluvan_logs');
        console.log('🔧 Data to insert:', logData);
        console.log('📝 Note: Only basic visitor data is logged due to table schema limitations');
        
        const { data, error } = await supabaseClient
            .from('laluvan_logs')
            .insert([logData]);
        
        if (error) {
            console.error('❌ Supabase insert error:', error);
            throw new Error(error.message);
        }
        
        console.log('✅ Visitor logged successfully:', data);
        
    } catch (error) {
        console.error('❌ Error in visitor logging:', error);
    }
}

// Log visitor when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing Supabase...');
    console.log('🔧 Config values available:', {
        url: !!window.SUPABASE_URL,
        key: !!window.SUPABASE_ANON_KEY
    });
    
    // Initialize Supabase first
    initializeSupabase();
    
    // Listen for Supabase ready event
    window.addEventListener('supabaseReady', () => {
        console.log('🎯 Supabase ready event received, logging visitor...');
        if (!hasLoggedInitialVisit) {
            console.log('📝 Logging initial visit...');
            logVisitor();
            hasLoggedInitialVisit = true;
        } else {
            console.log('⚠️ Initial visit already logged, skipping...');
        }
    });
    
    // Fallback: also try to log visitor after a delay
    setTimeout(() => {
        console.log('🕐 Fallback timeout reached...');
        console.log('🔧 Supabase client available:', !!supabaseClient);
        console.log('🔧 Has logged initial visit:', hasLoggedInitialVisit);
        
        if (supabaseClient && !hasLoggedInitialVisit) {
            console.log('🕐 Fallback: logging visitor after delay...');
            logVisitor();
            hasLoggedInitialVisit = true;
        } else if (hasLoggedInitialVisit) {
            console.log('✅ Initial visit already logged via Supabase ready event');
        } else {
            console.log('❌ Supabase client still not available after delay');
        }
    }, 2000);
});

// Only log on page visibility change if it's been more than 5 minutes
let lastVisibilityLog = 0;
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const now = Date.now();
        // Only log if it's been more than 5 minutes since last visibility log
        if (now - lastVisibilityLog > 300000) { // 5 minutes
            console.log('👁️ User returned to page, logging visit...');
            logVisitor({ event_type: 'visibility_change' });
            lastVisibilityLog = now;
        }
    }
});

// Log visitor on page unload (when user leaves) - but only if we haven't logged recently
window.addEventListener('beforeunload', () => {
    const now = Date.now();
    if (now - lastVisibilityLog > 60000) { // Only if it's been more than 1 minute
        console.log('👋 User leaving page, logging final visit...');
        logVisitor({ event_type: 'page_unload' });
    }
});


hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll
    if (hamburger.classList.contains('active')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
    
    // Add hamburger animation
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking on social icons
document.querySelectorAll('.mobile-social-container .social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking on desktop social icons (for smaller screens)
document.querySelectorAll('.desktop-social-icons .social-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        // Only close menu if it's open (mobile view)
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
                    // Track navigation click
        trackUserInteraction('navigation_click', {
            target_section: this.getAttribute('href'),
            link_text: this.textContent.trim()
        });
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Track social media clicks
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const platform = this.getAttribute('title') || 'unknown';
        trackUserInteraction('social_click', {
            platform: platform,
            url: this.href
        });
    });
});

// Track music player interactions
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Track play button click
        trackUserInteraction('music_interaction', {
            action: 'play_button_click',
            track_title: trackTitle
        });
        
        // Simulate playing music
        this.textContent = this.textContent === 'Play' ? 'Pause' : 'Play';
        
        // Add visual feedback
        if (this.textContent === 'Pause') {
            trackCard.style.borderColor = '#888';
            trackCard.style.boxShadow = '0 0 20px rgba(136, 136, 136, 0.3)';
        } else {
            trackCard.style.borderColor = '#444';
            trackCard.style.boxShadow = 'none';
        }
        
        console.log(`Playing: ${trackTitle}`);
    });
});

// Track download button interactions
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Track download button click
        trackUserInteraction('music_interaction', {
            action: 'download_button_click',
            track_title: trackTitle
        });
        
        // Simulate download
        this.textContent = 'Downloading...';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Downloaded';
            this.style.background = '#444';
            this.style.color = '#e0e0e0';
            
            setTimeout(() => {
                this.textContent = 'Download';
                this.style.background = 'transparent';
            }, 2000);
        }, 1500);
        
        console.log(`Downloading: ${trackTitle}`);
    });
});

// Track merch interactions
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Track buy button click
        trackUserInteraction('merch_interaction', {
            action: 'add_to_cart_click',
            product_title: productTitle
        });
        
        // Simulate adding to cart
        this.textContent = 'Added to Cart';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'transparent';
            this.style.color = '#e0e0e0';
        }, 2000);
        
        console.log(`Added to cart: ${productTitle}`);
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for fade-in effect
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Music player functionality
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Simulate playing music
        this.textContent = this.textContent === 'Play' ? 'Pause' : 'Play';
        
        // Add visual feedback
        if (this.textContent === 'Pause') {
            trackCard.style.borderColor = '#888';
            trackCard.style.boxShadow = '0 0 20px rgba(136, 136, 136, 0.3)';
        } else {
            trackCard.style.borderColor = '#444';
            trackCard.style.boxShadow = 'none';
        }
        
        console.log(`Playing: ${trackTitle}`);
    });
});

// Download button functionality
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const trackCard = this.closest('.track-card');
        const trackTitle = trackCard.querySelector('.track-title').textContent;
        
        // Simulate download
        this.textContent = 'Downloading...';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Downloaded';
            this.style.background = '#444';
            this.style.color = '#e0e0e0';
            
            setTimeout(() => {
                this.textContent = 'Download';
                this.style.background = 'transparent';
            }, 2000);
        }, 1500);
        
        console.log(`Downloading: ${trackTitle}`);
    });
});

// Merch add to cart functionality
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        
        // Simulate adding to cart
        this.textContent = 'Added to Cart';
        this.style.background = '#666';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'transparent';
            this.style.color = '#e0e0e0';
        }, 2000);
        
        console.log(`Added to cart: ${productTitle}`);
    });
});

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    console.log('🔍 Looking for form:', document.querySelector('.contact-form form'));
    console.log('🔍 Form element found:', contactForm);

    if (contactForm) {
        console.log('🔍 Form found, adding event listener...');
        
        // Add submission cooldown tracking
        let lastSubmissionTime = 0;
        const SUBMISSION_COOLDOWN = 5000; // 5 seconds between submissions
        
        contactForm.addEventListener('submit', async function(e) {
            console.log('🚀 Form submit event triggered!');
            console.log('🔍 Form element:', this);
            console.log('🔍 Submit button:', this.querySelector('.submit-btn'));
            console.log('🔍 Supabase client available:', !!supabaseClient);
            
            e.preventDefault();
            
            // Client-side rate limiting
            const now = Date.now();
            if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
                const remainingTime = Math.ceil((SUBMISSION_COOLDOWN - (now - lastSubmissionTime)) / 1000);
                alert(`Please wait ${remainingTime} seconds before submitting again.`);
                return;
            }
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Get form elements
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            
            console.log('🔍 Form elements found:', {
                firstName: !!firstName,
                lastName: !!lastName,
                email: !!email,
                phone: !!phone
            });
            
            // Validate all fields before submission
            console.log('🔍 Validating form fields...');
            const isFirstNameValid = validateFirstName(firstName);
            const isLastNameValid = validateLastName(lastName);
            const isEmailValid = validateEmail(email);
            const isPhoneValid = validatePhone(phone);
            
            console.log('✅ Validation results:', {
                firstName: isFirstNameValid,
                lastName: isLastNameValid,
                email: isEmailValid,
                phone: isPhoneValid
            });
            
            if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid) {
                console.log('❌ Validation failed, stopping submission');
                // Show first error message
                if (!isFirstNameValid) firstName.focus();
                else if (!isLastNameValid) lastName.focus();
                else if (!isEmailValid) email.focus();
                else if (!isPhoneValid) phone.focus();
                return;
            }
            
            console.log('✅ All validation passed, proceeding with submission');
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.background = '#666';
            submitBtn.style.color = '#000';
            
            try {
                // Check if Supabase client is available
                if (!supabaseClient) {
                    throw new Error('Supabase client not yet initialized. Please wait a moment and try again.');
                }
                
                // Get form data
                const formData = {
                    first_name: firstName.value.trim(),
                    last_name: lastName.value.trim(),
                    email: email.value.trim(),
                    phone_number: phone.value.replace(/\D/g, ''),
                    time_stamp: new Date().toISOString()
                };
                
                console.log('📝 Form data prepared:', formData);
                
                // Submit to Supabase
                console.log('🚀 Submitting to Supabase...');
                console.log('📝 Data being sent:', {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    phone_number: formData.phone_number,
                    time_stamp: formData.time_stamp
                });
                
                const { data, error } = await supabaseClient
                    .from('laluvan_mailing')
                    .insert([
                        {
                            first_name: formData.first_name,
                            last_name: formData.last_name,
                            email: formData.email,
                            phone_number: formData.phone_number,
                            time_stamp: formData.time_stamp
                        }
                    ]);
                
                if (error) {
                    throw new Error(error.message);
                }
                
                console.log('✅ Form submitted successfully:', data);
                
                // Success
                submitBtn.textContent = 'Thank You!';
                submitBtn.style.background = '#10b981';
                submitBtn.style.color = '#ffffff';
                
                // Record submission time for rate limiting
                lastSubmissionTime = Date.now();
                
                // Reset form and validation states
                this.reset();
                [firstName, lastName, email, phone].forEach(input => {
                    input.classList.remove('valid', 'error');
                });
                
                // Hide all error messages
                document.querySelectorAll('.error-message').forEach(error => {
                    error.classList.remove('show');
                });
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'transparent';
                    submitBtn.style.color = '#a1a1aa';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                console.error('Error adding fan to mailing list:', error);
                
                // Show error state
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#ef4444';
                submitBtn.style.color = '#ffffff';
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'transparent';
                    submitBtn.style.color = '#a1a1aa';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }
});

// Global validation functions
function validateFirstName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('firstName-error');
    
    if (value.length < 2) {
        showError(input, errorElement, 'First name must be at least 2 characters long');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validateLastName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('lastName-error');
    
    if (value.length < 2) {
        showError(input, errorElement, 'Last name must be at least 2 characters long');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validateEmail(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        showError(input, errorElement, 'Please enter a valid email address');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function validatePhone(input) {
    const value = input.value.replace(/\D/g, ''); // Remove non-digits
    const errorElement = document.getElementById('phone-error');
    
    if (value.length !== 10) {
        showError(input, errorElement, 'Phone number must be exactly 10 digits (including area code)');
        return false;
    } else {
        showSuccess(input, errorElement);
        return true;
    }
}

function showError(input, errorElement, message) {
    input.classList.remove('valid');
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('valid');
    errorElement.classList.remove('show');
}

// Form validation for signup form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signup-form');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    // Real-time validation
    firstName.addEventListener('blur', () => validateFirstName(firstName));
    lastName.addEventListener('blur', () => validateLastName(lastName));
    email.addEventListener('blur', () => validateEmail(email));
    phone.addEventListener('blur', () => validatePhone(phone));

    // Phone number formatting (only allow digits)
    phone.addEventListener('input', function(e) {
        // Remove any non-digit characters
        this.value = this.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (this.value.length > 10) {
            this.value = this.value.slice(0, 10);
        }
    });
});

// Track user interactions
function trackUserInteraction(eventType, details = {}) {
    console.log('📊 User interaction tracked:', eventType, details);
}

// Track scroll depth and time on page
let scrollDepth = 0;
let timeOnPage = 0;
let scrollTrackingInterval;

// Start tracking time on page
function startTimeTracking() {
    scrollTrackingInterval = setInterval(() => {
        timeOnPage += 1;
        
        // Log time on page every 30 seconds (temporarily disabled)
        if (timeOnPage % 30 === 0) {
            trackUserInteraction('time_on_page', {
                seconds: timeOnPage,
                scroll_depth: scrollDepth
            });
        }
    }, 1000);
}

// Track scroll depth
function trackScrollDepth() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > scrollDepth) {
        scrollDepth = scrollPercent;
        
        // Log significant scroll milestones
        if (scrollDepth % 25 === 0) {
            trackUserInteraction('scroll_depth', {
                depth_percentage: scrollDepth,
                time_on_page: timeOnPage
            });
        }
    }
}

// Enhanced scroll event listener with throttling
window.addEventListener('scroll', throttle(() => {
    trackScrollDepth();
}, 100));

// Start time tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
    startTimeTracking();
    
    // Track page load
    trackUserInteraction('page_load', {
        page_title: document.title,
        load_time: performance.now()
    });
});

// Track page unload with final stats
window.addEventListener('beforeunload', () => {
    clearInterval(scrollTrackingInterval);
    
    // Log final session stats
    trackUserInteraction('page_unload', {
        final_time_on_page: timeOnPage,
        final_scroll_depth: scrollDepth,
        total_page_views: pageViews
    });
});

// Glitch effect enhancement
function enhanceGlitchEffect() {
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 0, 0.5),
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 255, 0.5)
            `;
        }, 100);
        
        setTimeout(() => {
            glitchText.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.5)';
        }, 200);
    }
}

// Enhanced smoke effect
function enhanceSmokeEffect() {
    const smokeOverlay = document.querySelector('.smoke-overlay');
    if (smokeOverlay) {
        setInterval(() => {
            smokeOverlay.style.opacity = 0.2 + Math.random() * 0.2;
        }, 3000);
    }
}



// Initialize effects when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize effects
    enhanceGlitchEffect();
    enhanceSmokeEffect();
    
    // Add random glitch moments
    setInterval(() => {
        if (Math.random() < 0.1) {
            enhanceGlitchEffect();
        }
    }, 5000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            window.scrollBy({
                top: -window.innerHeight,
                behavior: 'smooth'
            });
            break;
        case 'Home':
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            break;
        case 'End':
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
            break;
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based effects here
}, 16)); // 60fps

// Add subtle hover effects to all interactive elements
document.querySelectorAll('a, button, .track-card, .product-card, .gallery-item').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = this.style.transform + ' scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = this.style.transform.replace(' scale(1.02)', '');
    });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Activate special mode
        document.body.style.filter = 'hue-rotate(180deg)';
        document.body.style.transition = 'filter 2s ease';
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 5000);
        
        console.log('Konami code activated!');
    }
});
