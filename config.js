// Supabase Configuration
// Set global variables for easy configuration management

// Production Supabase credentials
window.SUPABASE_URL = 'https://zfygibwmefjjzfqdpbkf.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeWdpYndtZWZqanpmcWRwYmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDAyNjAsImV4cCI6MjA2MDQ3NjI2MH0.VCbj7VumoLThJ66BzOj1dcMc2CorVnCidIA_ZAUeOcg';

// For development/testing, you can override these values:
// window.SUPABASE_URL = 'https://your-dev-project.supabase.co';
// window.SUPABASE_ANON_KEY = 'your-dev-anon-key';

console.log('🔧 Supabase configuration loaded:', {
    url: window.SUPABASE_URL,
    key: window.SUPABASE_ANON_KEY ? '***' + window.SUPABASE_ANON_KEY.slice(-4) : 'undefined'
});
