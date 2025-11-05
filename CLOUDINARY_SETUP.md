# 🔧 Cloudinary Setup Guide

## Issue: Image Upload Not Working

Your Cloudinary credentials need to be verified and updated.

## Steps to Fix:

### 1. **Get Your Cloudinary Credentials**

1. Go to https://cloudinary.com/users/login
2. Sign in to your account
3. Go to **Dashboard**
4. Copy these values:
   - **Cloud Name** (shown at top of dashboard)
   - **API Key** (shown in dashboard)
   - **API Secret** (click "Reveal" to show it)

### 2. **Update Your .env File**

Open `/Users/uddavdhakal/Desktop/Mart/server/.env` and update:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. **Test the Connection**

Run this command to test:

```bash
cd /Users/uddavdhakal/Desktop/Mart/server
node test-cloudinary.js
```

You should see: `✅ Cloudinary connection successful!`

### 4. **Restart Your Server**

After updating credentials:

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd /Users/uddavdhakal/Desktop/Mart/server
npm run dev
```

## Alternative: Use Local Storage (For Testing)

If you want to test without Cloudinary, you can temporarily store images locally. However, this is not recommended for production.

## Quick Fix Checklist:

- [ ] Cloudinary account is active
- [ ] Credentials are copied correctly (no extra spaces)
- [ ] `.env` file is in the `server` folder
- [ ] Server restarted after updating `.env`
- [ ] Test connection passes

## Still Having Issues?

1. Check Cloudinary dashboard for any account restrictions
2. Verify your API key and secret are correct
3. Make sure there are no extra spaces or quotes in `.env` file
4. Try regenerating your API secret in Cloudinary dashboard

## For Your Thesis:

If Cloudinary setup is blocking you, you can:
- Document that image upload requires Cloudinary configuration
- Show the error handling in your code
- Use placeholder images for demo purposes
