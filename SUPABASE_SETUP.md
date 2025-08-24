# Supabase Integration Setup for Laluvan Mailing List

This guide will help you set up Supabase to collect fan information from the signup form and store it securely in your `laluvan_mailing` table.

## Prerequisites

1. A Supabase account and project
2. Your Supabase project URL and anon key
3. A `laluvan_mailing` table in your Supabase database

## Step 1: Create the Database Table

In your Supabase dashboard, create a new table called `laluvan_mailing` with the following structure:

```sql
CREATE TABLE laluvan_mailing (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_laluvan_mailing_email ON laluvan_mailing(email);

-- Enable Row Level Security (RLS)
ALTER TABLE laluvan_mailing ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts from authenticated and anonymous users
CREATE POLICY "Allow inserts for mailing list signups" ON laluvan_mailing
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows users to view only their own data (if needed)
CREATE POLICY "Users can view own data" ON laluvan_mailing
    FOR SELECT USING (auth.uid()::text = email);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_laluvan_mailing_updated_at 
    BEFORE UPDATE ON laluvan_mailing 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 2: Configure Environment Variables

### Option A: Using config.js (Development)
Update `config.js` with your actual Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'your-anon-key-here'
};
```

### Option B: Using Environment Variables (Production - Recommended)
For production, use environment variables instead of hardcoded values:

1. Create a `.env` file in your project root:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. Update `config.js` to use environment variables:
```javascript
const SUPABASE_CONFIG = {
    url: process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};
```

## Step 3: Security Configuration

### Row Level Security (RLS)
The table is configured with RLS enabled. The policies allow:
- Anyone to insert new records (for signups)
- Users to view only their own data (if authenticated)

### API Key Security
- Use the **anon key** (public key) for client-side operations
- The anon key is safe to expose in frontend code
- Never use the service_role key in frontend code

## Step 4: Testing the Integration

1. Fill out the signup form on your website
2. Check the browser console for success/error messages
3. Verify the data appears in your Supabase `laluvan_mailing` table
4. Test form validation and error handling

## Step 5: Production Deployment

### Environment Variables
Set these environment variables in your hosting platform:

- **Vercel**: Add to Project Settings > Environment Variables
- **Netlify**: Add to Site Settings > Environment Variables
- **Heroku**: Use `heroku config:set` command
- **Custom Server**: Add to your server's environment configuration

### Security Checklist
- [ ] RLS policies are properly configured
- [ ] Only anon key is exposed in frontend
- [ ] Environment variables are set in production
- [ ] HTTPS is enabled
- [ ] Form validation is working
- [ ] Error handling is implemented

## Step 6: Monitoring and Analytics

### Supabase Dashboard
Monitor your table in the Supabase dashboard:
- Table size and growth
- Query performance
- Error logs

### Custom Analytics
Add tracking to monitor signup success rates:
```javascript
// In your form submission handler
console.log('Signup attempt:', {
    timestamp: new Date().toISOString(),
    success: true,
    email: formData.email
});
```

## Troubleshooting

### Common Issues

1. **"supabase is not defined"**
   - Ensure Supabase library is loaded before config.js
   - Check script loading order in HTML

2. **"Invalid API key"**
   - Verify your anon key is correct
   - Ensure you're using the anon key, not the service role key

3. **"Table does not exist"**
   - Verify table name is exactly `laluvan_mailing`
   - Check table exists in your Supabase project

4. **"RLS policy violation"**
   - Ensure RLS policies are properly configured
   - Check policy syntax and permissions

### Debug Mode
Enable debug logging in development:
```javascript
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
```

## API Reference

### Insert Record
```javascript
const { data, error } = await supabase
    .from('laluvan_mailing')
    .insert([{
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
    }]);
```

### Query Records
```javascript
const { data, error } = await supabase
    .from('laluvan_mailing')
    .select('*')
    .order('created_at', { ascending: false });
```

### Update Record
```javascript
const { data, error } = await supabase
    .from('laluvan_mailing')
    .update({ phone: '0987654321' })
    .eq('email', 'john@example.com');
```

## Support

For additional help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com/)

---

**Important**: Never commit your actual Supabase credentials to version control. Use environment variables or secure configuration management in production.
