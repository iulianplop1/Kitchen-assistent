# 🚀 Complete Guide: Publishing KitchenIQ to GitHub

Follow these steps to publish your KitchenIQ project on GitHub.

## ✅ Pre-Flight Checklist

Before starting, verify:
- ✅ Your code is working locally
- ✅ `.env` file is NOT in the repository (it's in `.gitignore`)
- ✅ No API keys or secrets are hardcoded in the code
- ✅ All files are saved

## 📝 Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Check what files will be committed (verify .env is NOT listed)
git status
```

**⚠️ IMPORTANT**: Make sure `.env` is NOT in the list. If you see it, your `.gitignore` isn't working properly.

### Step 2: Add All Files

```bash
# Add all files to staging
git add .

# Verify again that .env is not included
git status
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: KitchenIQ - AI-Powered Kitchen & Health Manager"
```

### Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name**: `kitcheniq` (or your choice)
   - **Description**: `AI-Powered Kitchen & Health Manager - Smart inventory, recipe generation, and health tracking`
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT check** "Add a README file" (we already have one)
   - **⚠️ DO NOT check** "Add .gitignore" (we already have one)
   - **⚠️ DO NOT check** "Choose a license" (we'll add it)
4. Click **Create repository**

### Step 5: Connect and Push

GitHub will show you commands. Run these (replace `YOUR_USERNAME` with your GitHub username):

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/kitcheniq.git

# Rename branch to main
git branch -M main

# Push your code
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token if 2FA is enabled).

### Step 6: Update README

After pushing, update the README with your actual repository URL:

1. Edit `README.md`
2. Find: `git clone https://github.com/yourusername/kitcheniq.git`
3. Replace `yourusername` with your GitHub username
4. Commit and push:

```bash
git add README.md
git commit -m "Update README with repository URL"
git push
```

### Step 7: Add Repository Details

1. Go to your repository on GitHub
2. Click the **⚙️ Settings** icon next to "About"
3. Add:
   - **Description**: `AI-Powered Kitchen & Health Manager`
   - **Topics**: Add these tags (press Enter after each):
     - `nextjs`
     - `typescript`
     - `supabase`
     - `gemini-ai`
     - `kitchen-assistant`
     - `recipe-generator`
     - `health-tracking`
     - `inventory-management`

## 🔒 Security Verification

Double-check that sensitive files are NOT in your repository:

```bash
# Check if .env is tracked (should return nothing)
git ls-files | grep .env

# If it shows .env, remove it:
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

## 📦 Files That Should Be Committed

✅ **Should be committed:**
- All source code (`.tsx`, `.ts`, `.css` files)
- `package.json` and `package-lock.json`
- Configuration files (`next.config.js`, `tsconfig.json`, etc.)
- Documentation (`README.md`, `SETUP.md`, etc.)
- `.env.example` (template file)
- `.gitignore`
- `LICENSE`

❌ **Should NOT be committed:**
- `.env` (your actual secrets)
- `node_modules/`
- `.next/` (build folder)
- Any files with API keys

## 🎯 Quick Command Reference

```bash
# Check repository status
git status

# See what files are tracked
git ls-files

# Add files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# View commit history
git log
```

## 🐛 Troubleshooting

### "fatal: not a git repository"
- Run `git init` first

### "Permission denied" when pushing
- Check your GitHub credentials
- Use a Personal Access Token if 2FA is enabled

### ".env file is showing in git status"
- Remove it: `git rm --cached .env`
- Verify `.gitignore` contains `.env`
- Commit the removal

### "Everything up-to-date" but nothing pushed
- Check if you're on the right branch: `git branch`
- Verify remote: `git remote -v`

## ✅ Final Checklist

Before you're done:

- [ ] Repository is on GitHub
- [ ] README updated with correct URL
- [ ] `.env.example` is committed
- [ ] `.env` is NOT committed
- [ ] Repository has description and topics
- [ ] Code is working (test locally)
- [ ] All files are properly committed

## 🎉 You're Done!

Your KitchenIQ project is now on GitHub! 

**Next steps:**
- Share your repository URL
- Consider adding a demo/screenshot
- Create your first release (v1.0.0)
- Star your own repo! ⭐

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book)
- See `GITHUB_SETUP.md` for more detailed instructions

