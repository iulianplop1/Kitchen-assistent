# 📝 Step-by-Step: Publishing KitchenIQ to GitHub

## ⚠️ IMPORTANT: API Keys & Secrets

**NEVER commit your actual API keys to GitHub!**

- ✅ Your `.env` file is already in `.gitignore` (won't be committed)
- ✅ Use `.env.example` as a template (no real keys)
- ✅ Add real API keys only in:
  - Your local `.env` file (for development)
  - GitHub Secrets (if using GitHub Actions)
  - Deployment platform (Vercel/Netlify) environment variables

---

## 🚀 Complete Step-by-Step Instructions

### STEP 1: Verify Your Files Are Safe

Before doing anything, make sure your secrets are protected:

```bash
# Check if .env is being tracked (should return NOTHING)
git ls-files | grep .env

# If it shows .env, remove it immediately:
git rm --cached .env
```

**✅ Good sign**: If the command returns nothing, you're safe!

### STEP 2: Check What Will Be Committed

```bash
# Initialize git (if not already done)
git init

# See what files will be committed
git status
```

**What you should see:**
- ✅ All your code files
- ✅ `.env.example` (template, no real keys)
- ✅ `README.md`, `package.json`, etc.
- ❌ **NO `.env` file** (your actual secrets)

If `.env` appears, **STOP** and check your `.gitignore` file.

### STEP 3: Add All Files to Git

```bash
# Add all files (except those in .gitignore)
git add .

# Double-check .env is NOT included
git status
```

**Verify again**: `.env` should NOT be in the list!

### STEP 4: Create Your First Commit

```bash
git commit -m "Initial commit: KitchenIQ - AI-Powered Kitchen & Health Manager"
```

### STEP 5: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click the green "New" button** (or the **+** icon → **New repository**)
3. **Fill in the form:**
   - **Repository name**: `kitcheniq` (or your preferred name)
   - **Description**: `AI-Powered Kitchen & Health Manager - Smart inventory, recipe generation, and health tracking`
   - **Visibility**: 
     - Choose **Public** (anyone can see code)
     - Or **Private** (only you can see)
   - **⚠️ IMPORTANT**: 
     - ❌ **DO NOT** check "Add a README file"
     - ❌ **DO NOT** check "Add .gitignore"
     - ❌ **DO NOT** check "Choose a license"
     - (We already have all of these!)
4. **Click "Create repository"**

### STEP 6: Connect Your Local Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/kitcheniq.git

# Make sure you're on the main branch
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**You'll be asked for credentials:**
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - If you don't have one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Give it `repo` permissions

### STEP 7: Update README with Your Repository URL

1. **Edit `README.md`** (line 45)
2. **Find this line:**
   ```markdown
   git clone https://github.com/yourusername/kitcheniq.git
   ```
3. **Replace `yourusername`** with your actual GitHub username
4. **Save the file**
5. **Commit and push the change:**
   ```bash
   git add README.md
   git commit -m "Update README with repository URL"
   git push
   ```

### STEP 8: Add Repository Details (Optional but Recommended)

1. **Go to your repository on GitHub**
2. **Click the ⚙️ Settings icon** next to "About" section
3. **Add:**
   - **Description**: `AI-Powered Kitchen & Health Manager`
   - **Website**: (leave blank or add your deployed URL)
   - **Topics**: Add these (press Enter after each):
     - `nextjs`
     - `typescript`
     - `supabase`
     - `gemini-ai`
     - `kitchen-assistant`
     - `recipe-generator`
     - `health-tracking`
     - `inventory-management`

---

## 🔐 About API Keys & Secrets

### For Local Development (Your Computer)

**Keep your `.env` file local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-actual-key-here
```

**This file:**
- ✅ Stays on your computer
- ✅ Is in `.gitignore` (won't be committed)
- ✅ Never goes to GitHub

### For GitHub Repository

**Only commit `.env.example`** (template with placeholders):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

**This file:**
- ✅ Shows others what variables they need
- ✅ Has NO real keys
- ✅ Is safe to commit

### For Deployment (Vercel/Netlify)

When you deploy, you'll add your real API keys in the deployment platform:

**Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add each variable with your real values
3. They're stored securely and NOT in your code

**Netlify:**
1. Go to Site settings → Environment variables
2. Add each variable with your real values
3. They're stored securely and NOT in your code

---

## ✅ Final Verification Checklist

Before you're done, verify:

- [ ] `.env` is NOT in `git status` output
- [ ] `.env.example` IS committed (template only)
- [ ] Code is pushed to GitHub
- [ ] README has correct repository URL
- [ ] Repository has description and topics
- [ ] No API keys are visible in any committed files

**How to check for secrets in your code:**
```bash
# Search for your actual API keys (replace with your key)
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude=".env"

# Should return NOTHING (or only .env.example with placeholders)
```

---

## 🎉 You're Done!

Your project is now on GitHub with:
- ✅ All your code
- ✅ Documentation
- ✅ Template files
- ✅ NO secrets or API keys

**Next Steps:**
1. Share your repository URL
2. Deploy to Vercel/Netlify (add secrets there)
3. Star your own repo! ⭐

---

## 🆘 Troubleshooting

### "Permission denied" when pushing
- Use a Personal Access Token instead of password
- GitHub → Settings → Developer settings → Personal access tokens

### ".env file is showing in git status"
- Run: `git rm --cached .env`
- Verify `.gitignore` contains `.env`
- Commit: `git commit -m "Remove .env from tracking"`

### "Everything up-to-date" but nothing pushed
- Check branch: `git branch` (should be `main`)
- Check remote: `git remote -v` (should show your GitHub URL)

---

## 📚 Quick Command Reference

```bash
# Check status
git status

# See what's tracked
git ls-files

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Check for secrets (should return nothing)
grep -r "your-actual-api-key" . --exclude-dir=node_modules
```

