# 🔐 GitHub Secrets Setup Guide

## ⚠️ IMPORTANT: Fix the Supabase URL Error

If you're seeing errors like:
```
POST https://iulianplop1.github.io/Kitchen-assistent/auth/v1/token 405 (Method Not Allowed)
```

This means your **GitHub Secrets are not set correctly**. The Supabase client is trying to use the GitHub Pages URL instead of your Supabase URL.

## ✅ Step-by-Step Fix

### Step 1: Go to Your Repository Settings

1. Go to your GitHub repository: `https://github.com/iulianplop1/Kitchen-assistent`
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)

### Step 2: Add These 4 Secrets

Click **"New repository secret"** for each one:

#### Secret 1: `NEXT_PUBLIC_SUPABASE_URL`
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://nbzbmueojubzskutmold.supabase.co`
- ⚠️ **IMPORTANT:** This must be your Supabase URL, NOT the GitHub Pages URL!

#### Secret 2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iemJtdWVvanVienNrdXRtb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzcxNDYsImV4cCI6MjA4MTc1MzE0Nn0.PO-nPuz9uVVNZ8W68auowWgKcby5ZhO2qjIvOE_BbPw`

#### Secret 3: `NEXT_PUBLIC_GEMINI_API_KEY`
- **Name:** `NEXT_PUBLIC_GEMINI_API_KEY`
- **Value:** `AIzaSyDAPwdjFvLknDrbmEj1kHIZRd_H4nITvMc`

#### Secret 4: `NEXT_PUBLIC_APP_URL`
- **Name:** `NEXT_PUBLIC_APP_URL`
- **Value:** `https://iulianplop1.github.io/Kitchen-assistent`
- ⚠️ **Note:** This is your GitHub Pages URL (for redirects), but the Supabase URL above must be your actual Supabase project URL!

### Step 3: Verify Secrets Are Set

After adding all 4 secrets, you should see them listed in the Secrets page. Make sure:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` is set to `https://nbzbmueojubzskutmold.supabase.co` (NOT the GitHub Pages URL)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- ✅ `NEXT_PUBLIC_GEMINI_API_KEY` is set
- ✅ `NEXT_PUBLIC_APP_URL` is set to `https://iulianplop1.github.io/Kitchen-assistent`

### Step 4: Trigger a New Deployment

After setting the secrets, you need to redeploy:

1. Go to the **Actions** tab in your repository
2. Click **"Run workflow"** → **"Run workflow"** (or push a new commit)
3. Wait for the workflow to complete (2-3 minutes)
4. The build will now fail if secrets are missing (this is good - it catches errors early!)

### Step 5: Test Your Site

After deployment completes:
1. Visit: `https://iulianplop1.github.io/Kitchen-assistent/`
2. Try to sign in
3. Check the browser console - you should NOT see the 405 error anymore
4. The Supabase requests should now go to `https://nbzbmueojubzskutmold.supabase.co` instead of the GitHub Pages URL

## 🐛 Troubleshooting

### "Build failed: NEXT_PUBLIC_SUPABASE_URL secret is not set"
- ✅ Good! This means the validation is working
- Go to Settings → Secrets and add the missing secret

### "Still seeing 405 errors after deployment"
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set to your Supabase URL (not GitHub Pages URL)
- Clear your browser cache and hard refresh (Ctrl+Shift+R)
- Check the browser console to see what URL is being used

### "How do I find my Supabase URL?"
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (should look like `https://xxxxx.supabase.co`)

## ✅ Success Checklist

- [ ] All 4 secrets are added in GitHub Settings
- [ ] `NEXT_PUBLIC_SUPABASE_URL` points to your Supabase project (not GitHub Pages)
- [ ] Workflow completed successfully in Actions tab
- [ ] Site loads at `https://iulianplop1.github.io/Kitchen-assistent/`
- [ ] Sign in works without 405 errors
- [ ] Browser console shows requests going to `*.supabase.co` (not `*.github.io`)

