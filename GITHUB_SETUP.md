# GitHub Setup Guide for KitchenIQ

This guide will walk you through publishing your KitchenIQ project on GitHub.

## 📋 Pre-Publication Checklist

Before pushing to GitHub, make sure:

- [ ] `.env` file is in `.gitignore` (✅ Already done)
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] `.env.example` file exists with placeholder values
- [ ] README.md is complete and accurate
- [ ] All code is working and tested

## 🚀 Step-by-Step GitHub Setup

### Step 1: Initialize Git Repository (if not already done)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### Step 2: Add All Files

```bash
# Add all files to staging
git add .

# Check what will be committed (make sure .env is NOT listed)
git status
```

**Important**: Verify that `.env` is NOT in the list. If it is, check your `.gitignore` file.

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: KitchenIQ - AI-Powered Kitchen & Health Manager"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon in the top right
3. Select **New repository**
4. Fill in the details:
   - **Repository name**: `kitcheniq` (or your preferred name)
   - **Description**: "AI-Powered Kitchen & Health Manager - Smart inventory, recipe generation, and health tracking"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **Create repository**

### Step 5: Connect Local Repository to GitHub

GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/kitcheniq.git

# Rename branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### Step 6: Update README with Your Repository URL

After pushing, update the README.md:

1. Open `README.md`
2. Find the line: `git clone https://github.com/yourusername/kitcheniq.git`
3. Replace `yourusername` with your actual GitHub username
4. Commit and push the change:

```bash
git add README.md
git commit -m "Update README with repository URL"
git push
```

## 🔒 Security Best Practices

### What Should NEVER Be Committed:

- ✅ `.env` file (already in .gitignore)
- ✅ `.env.local` (already in .gitignore)
- ✅ `node_modules/` (already in .gitignore)
- ✅ `.next/` build folder (already in .gitignore)
- ✅ Any files with API keys or passwords

### What SHOULD Be Committed:

- ✅ `.env.example` (template file)
- ✅ All source code
- ✅ `package.json` and `package-lock.json`
- ✅ Configuration files
- ✅ Documentation (README, SETUP, etc.)

## 📝 Adding a Description and Topics

After your repository is created:

1. Go to your repository on GitHub
2. Click the **⚙️ Settings** icon (gear) next to "About"
3. Add:
   - **Description**: "AI-Powered Kitchen & Health Manager - Smart inventory, recipe generation, and health tracking"
   - **Topics** (add these tags):
     - `nextjs`
     - `typescript`
     - `supabase`
     - `gemini-ai`
     - `kitchen-assistant`
     - `recipe-generator`
     - `health-tracking`
     - `inventory-management`

## 🏷️ Creating a Release (Optional)

To create a release version:

1. Go to your repository
2. Click **Releases** → **Create a new release**
3. Tag version: `v1.0.0`
4. Release title: `KitchenIQ v1.0.0 - Initial Release`
5. Description: Copy from your README features section
6. Click **Publish release**

## 🔄 Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Commit with descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 📦 Adding a Badge to README (Optional)

You can add a badge to show the repository status. Add this at the top of README.md:

```markdown
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/kitcheniq)
![GitHub repo size](https://img.shields.io/github/repo-size/YOUR_USERNAME/kitcheniq)
![GitHub language count](https://img.shields.io/github/languages/count/YOUR_USERNAME/kitcheniq)
```

## ✅ Final Checklist

Before considering it done:

- [ ] Repository is on GitHub
- [ ] README is updated with correct repository URL
- [ ] `.env.example` exists and is committed
- [ ] No sensitive data in the repository
- [ ] All files are properly committed
- [ ] Repository description and topics are set
- [ ] Code is working (test locally first)

## 🎉 You're Done!

Your KitchenIQ project is now on GitHub! Share the repository URL with others, and they can clone and set it up using the instructions in the README.

