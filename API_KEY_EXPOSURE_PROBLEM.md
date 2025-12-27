# 🔐 Critical: API Key Exposure Problem

## ⚠️ The Root Cause

Your Gemini API key keeps getting revoked because **it's exposed in your client-side JavaScript bundle**.

### Why This Happens:

1. **`NEXT_PUBLIC_` prefix**: Variables with this prefix are embedded into the client-side JavaScript
2. **Static Export**: Your app uses `output: 'export'` which creates a static site
3. **Client Components**: Your components use `'use client'` and import Gemini functions directly
4. **Public Access**: Once deployed, anyone can:
   - View the page source
   - Open browser DevTools → Sources
   - See your API key in the JavaScript bundle
   - Copy and use your API key

### The Evidence:

```typescript
// lib/gemini/client.ts
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';  // ❌ EXPOSED!
export const genAI = new GoogleGenerativeAI(apiKey);
```

This code runs in the browser, so the API key is in the JavaScript bundle.

## 🔍 How to Verify

1. Deploy your site
2. Open it in a browser
3. Press `F12` (DevTools)
4. Go to **Sources** or **Network** tab
5. Search for `AIza` or `GEMINI_API_KEY`
6. You'll find your API key in plain text!

## ✅ Solutions

### Option 1: Use API Routes (Recommended - Requires Different Hosting)

**Problem**: GitHub Pages doesn't support Next.js API routes (it's static only)

**Solution**: Deploy to a platform that supports server-side code:
- **Vercel** (best for Next.js)
- **Netlify**
- **Railway**
- **Render**

Then create API routes to proxy Gemini requests:

```typescript
// app/api/gemini/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY; // No NEXT_PUBLIC_ prefix!
  // ... handle request server-side
}
```

### Option 2: Use a Backend Proxy Service

Create a separate backend service (Node.js, Python, etc.) that:
- Holds the API key securely
- Receives requests from your frontend
- Makes Gemini API calls
- Returns results

### Option 3: Accept the Risk (Not Recommended)

For GitHub Pages static sites, you have limited options:
- Accept that the key will be exposed
- Use API key restrictions in Google Cloud Console:
  - Restrict by HTTP referrer (your domain)
  - Set usage quotas
  - Monitor usage regularly
- Rotate keys frequently

### Option 4: Use Google's API Key Restrictions

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add: `https://iulianplop1.github.io/*`
5. Under **API restrictions**:
   - Select **Restrict key**
   - Choose only **Generative Language API**
6. Save

This won't prevent exposure, but limits damage if someone steals it.

## 🚨 Immediate Actions

1. **Rotate your current API key** (it's already exposed)
2. **Add restrictions** in Google Cloud Console
3. **Consider migrating to Vercel** for proper API route support
4. **Monitor API usage** regularly

## 📋 Migration to Vercel (Recommended)

### Step 1: Create API Route

```typescript
// app/api/gemini/recipe/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY; // Server-side only!
    const body = await request.json();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // ... handle Gemini request
    
    return NextResponse.json({ result: '...' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

### Step 2: Update Client Code

```typescript
// Instead of direct Gemini calls:
// const result = await generateRecipe(...)

// Call your API route:
const response = await fetch('/api/gemini/recipe', {
  method: 'POST',
  body: JSON.stringify({ ingredients, mode, preferences })
});
const result = await response.json();
```

### Step 3: Update Environment Variables

- Remove `NEXT_PUBLIC_GEMINI_API_KEY` from client
- Add `GEMINI_API_KEY` (no NEXT_PUBLIC_ prefix) in Vercel
- This keeps it server-side only

## 🎯 Best Practice

**Never use `NEXT_PUBLIC_` prefix for sensitive API keys!**

- ✅ `GEMINI_API_KEY` - Server-side only
- ❌ `NEXT_PUBLIC_GEMINI_API_KEY` - Exposed to browser

## 📊 Current Architecture Problem

```
Browser (Client)
    ↓
Direct Gemini API Call
    ↓
API Key in JavaScript Bundle ❌
    ↓
Publicly Accessible
```

## ✅ Secure Architecture

```
Browser (Client)
    ↓
API Route (/api/gemini/...)
    ↓
Server-side (API Key Hidden) ✅
    ↓
Gemini API
```

## 🔗 Next Steps

1. **Short-term**: Add API key restrictions in Google Cloud Console
2. **Medium-term**: Migrate to Vercel for API route support
3. **Long-term**: Implement proper authentication and rate limiting

