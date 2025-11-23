# Fix Frontend API URL Issue

## Problem
Frontend is calling wrong API URL (`dashboard.render.com` instead of your backend URL).

## Solution

### Step 1: Set Environment Variable in Render

1. Go to **Render Dashboard**
2. Click on your **Frontend Service** (`onlinemarketplace-frontend`)
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://onlinemarketplace-backend-vx8c.onrender.com/api`
6. Click **Save Changes**

### Step 2: Clear Build Cache & Redeploy

**⚠️ CRITICAL:** After setting the environment variable, you MUST rebuild:

1. In your frontend service on Render
2. Go to **Manual Deploy** tab
3. Click **Clear build cache & deploy**
4. Wait for build to complete (usually 2-5 minutes)

### Step 3: Verify

After rebuild:
1. Open your frontend: `https://onlinemarketplace-frontend.onrender.com`
2. Open browser DevTools (F12) → Console tab
3. You should see: `🔗 API Base URL: https://onlinemarketplace-backend-vx8c.onrender.com/api`
4. If you see `NOT SET` or `localhost`, the environment variable wasn't set correctly

## Why This Happens

- Vite environment variables are **baked into the build** at build time
- If you set the variable after building, it won't work
- You must **rebuild** after setting environment variables

## Quick Checklist

- [ ] `VITE_API_URL` is set in Render frontend environment
- [ ] Value is: `https://onlinemarketplace-backend-vx8c.onrender.com/api` (with `/api` at end)
- [ ] Cleared build cache and redeployed
- [ ] Checked browser console for API URL confirmation

## Still Not Working?

1. **Check Render logs** - Look for build errors
2. **Verify backend URL** - Make sure backend is running: `https://onlinemarketplace-backend-vx8c.onrender.com/api/health`
3. **Check CORS** - Make sure `FRONTEND_URL` in backend matches your frontend URL
4. **Try manual rebuild** - Sometimes auto-deploy doesn't pick up env vars

