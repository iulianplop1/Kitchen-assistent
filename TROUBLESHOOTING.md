# Troubleshooting Guide

## Authentication Issues

### Issue: Sign in doesn't redirect / Infinite reload loop

**Possible Causes:**

1. **Database tables not created**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `lib/supabase/schema.sql`
   - This creates all necessary tables and RLS policies

2. **Email confirmation required**
   - Go to Supabase Dashboard → Authentication → Settings
   - Check "Enable email confirmations"
   - If enabled, users must confirm email before signing in
   - For testing, you can disable this temporarily

3. **RLS (Row Level Security) policies not set**
   - The schema.sql includes RLS policies
   - Make sure you ran the entire script, not just table creation

4. **Environment variables not loaded**
   - Make sure `.env` file exists in the root directory
   - Restart your dev server after creating/updating `.env`
   - Check that variables start with `NEXT_PUBLIC_` for client-side access

### Testing Your Setup

1. **Test Supabase Connection:**
   - Visit `http://localhost:3000/test-supabase`
   - Click "Run Tests"
   - This will verify:
     - Environment variables are set
     - Supabase connection works
     - Database tables are accessible

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for any error messages
   - Check Network tab for failed requests

3. **Check Supabase Dashboard:**
   - Go to Authentication → Users
   - See if your user was created
   - Check if email is confirmed

### Quick Fixes

**Disable Email Confirmation (for testing):**
1. Go to Supabase Dashboard
2. Authentication → Settings
3. Disable "Enable email confirmations"
4. Save and try signing in again

**Clear Browser Data:**
1. Clear cookies for localhost:3000
2. Or use incognito/private window
3. Try signing in again

**Verify Database Setup:**
1. Go to Supabase Dashboard → Table Editor
2. Check if these tables exist:
   - `profiles`
   - `inventory`
   - `daily_logs`
   - `recipes_saved`
3. If missing, run `lib/supabase/schema.sql` in SQL Editor

### Common Error Messages

**"Missing Supabase environment variables"**
- Check `.env` file exists
- Verify variables are named correctly
- Restart dev server

**"relation does not exist"**
- Tables not created
- Run `lib/supabase/schema.sql` in Supabase SQL Editor

**"new row violates row-level security policy"**
- RLS policies not set up
- Make sure you ran the entire schema.sql script

**"Invalid login credentials"**
- Wrong email/password
- Or email not confirmed (if email confirmation is enabled)

