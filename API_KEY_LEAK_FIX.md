# 🔐 API Key Leak - Fix Guide

## ⚠️ What Happened

Your Gemini API key was **exposed publicly** in the documentation files that were committed to GitHub. Google detected this and **revoked the API key** for security reasons.

You're now seeing this error:
```
Error: Your API key was reported as leaked. Please use another API key.
```

## ✅ What I Fixed

1. **Removed all hardcoded API keys** from documentation files
2. **Added better error handling** in the Gemini client with helpful messages
3. **Updated all guides** to instruct users to get their own API keys

## 🚀 What You Need to Do

### Step 1: Get a New Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the new API key (it will start with `AIza...`)

### Step 2: Update GitHub Secret

1. Go to your repository: `https://github.com/iulianplop1/Kitchen-assistent`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Find the `NEXT_PUBLIC_GEMINI_API_KEY` secret
4. Click the **pencil icon** (Edit) or delete and recreate it
5. Paste your **new API key**
6. Click **"Update secret"**

### Step 3: Redeploy

After updating the secret, trigger a new deployment:

1. Go to the **Actions** tab
2. Click **"Run workflow"** → **"Run workflow"**
3. Wait 2-3 minutes for deployment to complete

### Step 4: Test

After deployment:
1. Visit your site: `https://iulianplop1.github.io/Kitchen-assistent/`
2. Try using features that require Gemini (recipe generation, receipt parsing, etc.)
3. Check the browser console - you should **NOT** see the "API key was reported as leaked" error anymore

## 🛡️ Security Best Practices

**Never commit API keys to GitHub!**

✅ **DO:**
- Use GitHub Secrets for API keys
- Use `.env` files locally (and add them to `.gitignore`)
- Use environment variables in deployment platforms

❌ **DON'T:**
- Commit API keys in code files
- Put API keys in documentation files
- Share API keys publicly

## 📝 About the Supabase 406 Error

You might also see:
```
Failed to load resource: the server responded with a status of 406
```

This is a separate issue - a 406 means "Not Acceptable" and usually indicates:
- Missing or incorrect `Accept` headers
- Content negotiation issues
- CORS problems

The Supabase client library should handle this automatically. If you're still seeing 406 errors:
1. Make sure you're using the latest version of `@supabase/ssr`
2. Check that your Supabase URL and keys are correct
3. Verify your Supabase project is active and accessible

## ✅ Success Checklist

- [ ] Got a new Gemini API key from Google AI Studio
- [ ] Updated `NEXT_PUBLIC_GEMINI_API_KEY` secret in GitHub
- [ ] Triggered a new deployment
- [ ] Deployment completed successfully
- [ ] Site works without "API key leaked" errors
- [ ] Gemini features (recipes, receipt parsing) work correctly

## 🆘 Still Having Issues?

If you're still seeing errors after updating the API key:

1. **Double-check the secret name**: It must be exactly `NEXT_PUBLIC_GEMINI_API_KEY`
2. **Verify the key format**: Google API keys start with `AIza` and are about 39 characters long
3. **Check the deployment logs**: Go to Actions → Latest workflow → Check build logs
4. **Clear browser cache**: Hard refresh (Ctrl+Shift+R) to clear cached JavaScript

## 📚 Additional Resources

- [Google AI Studio](https://makersuite.google.com/app/apikey) - Get API keys
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Documentation](https://supabase.com/docs)

