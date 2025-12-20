# 🚀 Quick Start: Deploy to GitHub Pages

## Step 1: Add GitHub Secrets (API Keys)

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these 4 secrets:

   **Secret 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://nbzbmueojubzskutmold.supabase.co`

   **Secret 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iemJtdWVvanVienNrdXRtb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzcxNDYsImV4cCI6MjA4MTc1MzE0Nn0.PO-nPuz9uVVNZ8W68auowWgKcby5ZhO2qjIvOE_BbPw`

   **Secret 3:**
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: `AIzaSyDAPwdjFvLknDrbmEj1kHIZRd_H4nITvMc`

   **Secret 4:**
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`
     - Replace `YOUR_USERNAME` with your GitHub username
     - Replace `YOUR_REPO_NAME` with your repository name

## Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **"GitHub Actions"**
3. Save

## Step 3: Commit and Push

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push
```

## Step 4: Wait for Deployment

1. Go to **Actions** tab in your repository
2. Watch the workflow run (takes 2-3 minutes)
3. When done, your site is live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## ✅ Done!

Your site is now live on GitHub Pages!

**Note:** The repository name is automatically detected by GitHub Actions, so you don't need to change anything in `next.config.js`.

