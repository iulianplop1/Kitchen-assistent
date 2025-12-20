# 🚀 Deploy KitchenIQ to GitHub Pages

This guide will help you deploy your Next.js app to GitHub Pages using GitHub Actions.

## ⚠️ Important Limitations

GitHub Pages only supports **static sites**. This means:
- ✅ Client-side features work (React, Supabase client, Gemini API)
- ❌ Server-side features don't work (middleware, API routes, SSR)
- ⚠️ Auth will work but middleware redirects won't work (we'll handle this client-side)

## 📋 Step-by-Step Setup

### Step 1: Update Repository Name in Config

1. **Edit `next.config.js`**
2. **Find these lines:**
   ```js
   basePath: process.env.NODE_ENV === 'production' ? '/kitcheniq' : '',
   assetPrefix: process.env.NODE_ENV === 'production' ? '/kitcheniq' : '',
   ```
3. **Replace `kitcheniq`** with your actual GitHub repository name
4. **Save the file**

### Step 2: Add GitHub Secrets

Your API keys need to be added as GitHub Secrets (they won't be visible in code):

1. **Go to your GitHub repository**
2. **Click "Settings"** (top menu)
3. **Click "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**
5. **Add these 4 secrets:**

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://nbzbmueojubzskutmold.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iemJtdWVvanVienNrdXRtb2xkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzcxNDYsImV4cCI6MjA4MTc1MzE0Nn0.PO-nPuz9uVVNZ8W68auowWgKcby5ZhO2qjIvOE_BbPw` |
   | `NEXT_PUBLIC_GEMINI_API_KEY` | `AIzaSyDAPwdjFvLknDrbmEj1kHIZRd_H4nITvMc` |
   | `NEXT_PUBLIC_APP_URL` | `https://YOUR_USERNAME.github.io/kitcheniq` (replace with your username and repo name) |

6. **Click "Add secret"** for each one

### Step 3: Enable GitHub Pages

1. **Go to your repository → Settings**
2. **Scroll to "Pages"** (left sidebar)
3. **Under "Source":**
   - Select **"GitHub Actions"**
4. **Save**

### Step 4: Commit and Push

The GitHub Actions workflow will automatically deploy when you push:

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push
```

### Step 5: Wait for Deployment

1. **Go to your repository on GitHub**
2. **Click "Actions"** tab
3. **Watch the workflow run** (takes 2-3 minutes)
4. **When it's done**, your site will be live at:
   `https://YOUR_USERNAME.github.io/kitcheniq`

## 🔧 Configuration Details

### Repository Name

**Important:** Make sure the `basePath` in `next.config.js` matches your repository name exactly.

If your repo is `kitcheniq`, use:
```js
basePath: '/kitcheniq'
```

If your repo is `my-kitchen-app`, use:
```js
basePath: '/my-kitchen-app'
```

### Environment Variables

All variables must have `NEXT_PUBLIC_` prefix because they're baked into the client bundle at build time.

## 🐛 Troubleshooting

### "404 Not Found" on GitHub Pages

- Check that `basePath` in `next.config.js` matches your repo name
- Make sure GitHub Pages is set to use "GitHub Actions" as source
- Wait a few minutes after deployment (can take time to propagate)

### "Build failed" in GitHub Actions

- Check the Actions tab for error details
- Verify all secrets are set correctly
- Make sure repository name matches in `next.config.js`

### "API errors" on deployed site

- Verify secrets are set correctly in GitHub
- Check that `NEXT_PUBLIC_APP_URL` matches your GitHub Pages URL
- Make sure you pushed the latest code

### Auth redirects not working

- Middleware doesn't work on static sites
- Auth will still work, but redirects need to be handled client-side
- The app will check auth status in the browser

## ✅ After Deployment

1. **Test your site:**
   - Visit: `https://YOUR_USERNAME.github.io/kitcheniq`
   - Try signing in
   - Test features (inventory, recipes, etc.)

2. **Update README:**
   - Add your live GitHub Pages URL
   - Update any links

3. **Share your site!** 🎉

## 📝 Notes

- **Automatic deployments:** Every push to `main` branch will trigger a new deployment
- **Build time:** Takes 2-3 minutes per deployment
- **Custom domain:** You can add a custom domain in GitHub Pages settings
- **HTTPS:** GitHub Pages provides free HTTPS automatically

## 🔄 Updating Your Site

Just push changes to GitHub:

```bash
git add .
git commit -m "Your changes"
git push
```

GitHub Actions will automatically rebuild and redeploy!

