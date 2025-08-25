// Supabase Configuration
// Set global variables for easy configuration management

// For static HTML sites, we need to set these values directly
// You can either:
// 1. Set them here (less secure but works immediately)
// 2. Set them in your HTML file before loading this script
// 3. Use a build tool to inject environment variables

// Option 1: Set values directly (replace with your actual values)
window.SUPABASE_URL = 'https://zfygibwmefjjzfqdpbkf.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeWdpYndtZWZqanpmcWRwYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDAyNjAsImV4cCI6MjA2MDQ3NjI2MH0.VCbj7VumoLThJ66BzOj1dcMc2CorVnCidIA_ZAUeOcg';

// Option 2: Check if values were set in HTML (more secure)
// If you set the variables in your HTML file, uncomment this section:
/*
if (typeof window.SUPABASE_URL === 'undefined' || typeof window.SUPABASE_ANON_KEY === 'undefined') {
    // Values not set in HTML, use defaults
    window.SUPABASE_URL = 'https://zfygibwmefjjzfqdpbkf.supabase.co';
    window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeWdpYndtZWZqanpmcWRwYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDAyNjAsImV4cCI6MjA2MDQ3NjI2MH0.VCbj7VumoLThJ66BzOj1dcMc2CorVnCidIA_ZAUeOcg';
}
*/

console.log('🔧 Supabase configuration loaded:', {
    url: window.SUPABASE_URL,
    key: window.SUPABASE_ANON_KEY ? '***' + window.SUPABASE_ANON_KEY.slice(-4) : 'undefined'
});

// Check if configuration is properly loaded
if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('❌ Supabase configuration not found!');
    console.error('❌ Please check your configuration setup.');
} else {
    console.log('✅ Supabase configuration loaded successfully');
}
