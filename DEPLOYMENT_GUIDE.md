# 🚀 Deployment Guide for KitchenIQ

## ⚠️ Important: GitHub Pages Doesn't Support Next.js

**GitHub Pages is for static sites only** - it doesn't support:
- Server-side rendering (SSR)
- API routes
- Environment variables
- Next.js features

**You need to deploy to a platform that supports Next.js:**
- ✅ **Vercel** (Recommended - made by Next.js creators)
- ✅ **Netlify** (Also great)
- ✅ **Railway** or **Render** (Alternatives)

---

## 🎯 Recommended: Deploy to Vercel (Easiest)

### Step 1: Push Your Code to GitHub

Make sure your code is on GitHub first (you already did this ✅).

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** (use your GitHub account - it's easiest)
3. **Click "Add New Project"**
4. **Import your GitHub repository:**
   - Select your `kitcheniq` repository
   - Click "Import"

### Step 3: Configure Environment Variables

**This is crucial!** Add your API keys here:

1. In the project settings, go to **Settings → Environment Variables**
2. **Add each variable:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://nbzbmueojubzskutmold.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key) |
   | `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key (get one from https://makersuite.google.com/app/apikey) |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` (Vercel will give you this) |

3. **Select environments:** Check all (Production, Preview, Development)
4. **Click "Save"**

### Step 4: Deploy

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. **Your site will be live!** 🎉

Vercel will give you a URL like: `https://kitcheniq-xyz.vercel.app`

---

## 🌐 Alternative: Deploy to Netlify

### Step 1: Push to GitHub
(You already did this ✅)

### Step 2: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** (use GitHub - easiest)
3. **Click "Add new site" → "Import an existing project"**
4. **Connect to GitHub** and select your repository
5. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)

### Step 3: Add Environment Variables

1. Go to **Site settings → Environment variables**
2. **Add all your variables** (same as Vercel above)
3. **Save**

### Step 4: Deploy

1. **Click "Deploy site"**
2. **Wait for build** (2-3 minutes)
3. **Your site is live!** 🎉

---

## 🔐 Environment Variables for Deployment

**Copy these values from your local `.env` file:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://nbzbmueojubzskutmold.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iemJtdWVvanVienNrdXRtb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzcxNDYsImV4cCI6MjA4MTc1MzE0Nn0.PO-nPuz9uVVNZ8W68auowWgKcby5ZhO2qjIvOE_BbPw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iemJtdWVvanVienNrdXRtb2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3NzE0NiwiZXhwIjoyMDgxNzUzMTQ2fQ.sSuhN46jgh7oMbrV7RGh04Jb6gBBM_xCTdaYPZsojFo
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_APP_URL=https://your-deployed-url.vercel.app
```

**⚠️ Important:**
- Add these in your deployment platform (Vercel/Netlify)
- **NOT** in GitHub (GitHub doesn't support environment variables for Next.js)
- The `NEXT_PUBLIC_APP_URL` should be your deployed URL (Vercel/Netlify will give you this)

---

## ✅ Quick Checklist

- [ ] Code is pushed to GitHub ✅
- [ ] Created account on Vercel or Netlify
- [ ] Connected GitHub repository
- [ ] Added all environment variables in deployment platform
- [ ] Deployed successfully
- [ ] Site is working (test sign in, receipt upload, etc.)

---

## 🐛 Troubleshooting

### "Environment variables not found"
- Make sure you added them in Vercel/Netlify settings
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding variables

### "Build failed"
- Check build logs in Vercel/Netlify
- Make sure `package.json` has all dependencies
- Verify Node.js version (should be 18+)

### "API errors on deployed site"
- Verify environment variables are set correctly
- Check that `NEXT_PUBLIC_` prefix is used for client-side variables
- Make sure you redeployed after adding variables

---

## 🎉 After Deployment

1. **Update README.md** with your live URL
2. **Test all features:**
   - Sign up/Sign in
   - Add inventory items
   - Upload receipt
   - Generate recipe
   - Track health data

3. **Share your live site!** 🚀

---

## 📝 Summary

**For GitHub:**
- ✅ Store your code
- ✅ Version control
- ❌ **Cannot host Next.js apps**

**For Deployment:**
- ✅ Use **Vercel** (easiest for Next.js)
- ✅ Or **Netlify**
- ✅ Add environment variables in the platform
- ✅ Get a live URL

**Your workflow:**
1. Code locally → Push to GitHub
2. GitHub → Connect to Vercel/Netlify
3. Add secrets in deployment platform
4. Deploy → Live website! 🎉

