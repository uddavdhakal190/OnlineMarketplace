# Render Deployment Guide

This guide will help you deploy O Mart to Render.com.

## 📋 Pre-Deployment Checklist

### ✅ What's Already Configured
- ✅ Server uses `process.env.PORT` (Render will set this automatically)
- ✅ MongoDB connection with retry logic
- ✅ Environment variable support
- ✅ Health check endpoint at `/api/health`
- ✅ Error handling middleware
- ✅ CORS configuration (needs your Render frontend URL)

## 🚀 Deployment Steps

### 1. Deploy Backend (Web Service)

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `omart-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty**

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key_min_32_characters
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

5. **Important Notes:**
   - Render will automatically set `PORT` - you don't need to set it manually
   - After deploying frontend, update `FRONTEND_URL` with your actual frontend URL
   - Make sure MongoDB Atlas Network Access allows Render's IPs (or use 0.0.0.0/0 for all IPs)

### 2. Deploy Frontend (Static Site)

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Name**: `omart-frontend` (or your preferred name)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

4. **Set Environment Variables:**
   ```
   VITE_API_URL=https://onlinemarketplace-backend-vx8c.onrender.com/api
   ```
   
   **⚠️ IMPORTANT:** 
   - Replace with your actual backend URL
   - The URL must include `/api` at the end
   - After setting, you MUST rebuild the frontend for changes to take effect
   - Go to Render dashboard → Your frontend service → Manual Deploy → Clear build cache & deploy

5. **Important Notes:**
   - Replace `your-backend-url` with your actual backend Render URL
   - The build will create a `dist` folder with production-ready files

### 3. Update CORS After Deployment

After both services are deployed:

1. **Get your frontend URL** from Render (e.g., `https://omart-frontend.onrender.com`)
2. **Update backend environment variable:**
   - Go to your backend service on Render
   - Add/Update `FRONTEND_URL` to your frontend URL
   - Redeploy the backend

## 🔧 Required Environment Variables

### Backend (.env in Render)
```bash
NODE_ENV=production
PORT=10000  # Render sets this automatically, but you can set a default
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mart?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_characters_long
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (Environment Variables in Render)
```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🔒 Security Checklist

- [ ] Use strong `JWT_SECRET` (at least 32 characters, random)
- [ ] Use production Stripe keys (not test keys)
- [ ] MongoDB Atlas Network Access configured (allow Render IPs or 0.0.0.0/0)
- [ ] Cloudinary account is active and credentials are correct
- [ ] All sensitive data is in environment variables (not in code)
- [ ] CORS is configured with your actual frontend URL

## 🧪 Testing After Deployment

1. **Test Backend Health:**
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running","database":"connected"}`

2. **Test Frontend:**
   - Visit your frontend URL
   - Try registering a new account
   - Try logging in
   - Test creating a product

3. **Check Logs:**
   - Monitor Render logs for any errors
   - Check MongoDB connection status
   - Verify API calls are working

## 🐛 Common Issues

### Issue: CORS Errors
**Solution:** Make sure `FRONTEND_URL` in backend matches your frontend URL exactly (including `https://`)

### Issue: MongoDB Connection Failed
**Solution:** 
- Check MongoDB Atlas Network Access - add `0.0.0.0/0` to allow all IPs
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas cluster is running

### Issue: API Calls Failing
**Solution:**
- Verify `VITE_API_URL` in frontend matches your backend URL
- Check backend logs for errors
- Ensure backend is running and healthy

### Issue: Images Not Uploading
**Solution:**
- Verify Cloudinary credentials are correct
- Check Cloudinary account is active
- Review backend logs for Cloudinary errors

## 📝 Post-Deployment

1. **Update README.md** with your production URLs
2. **Test all features** thoroughly
3. **Monitor logs** for the first few days
4. **Set up monitoring** (optional but recommended)

## 🔄 Updating After Deployment

1. **Push changes to GitHub**
2. **Render will automatically redeploy** (if auto-deploy is enabled)
3. **Or manually trigger redeploy** from Render dashboard

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify all environment variables are set correctly
3. Test backend health endpoint
4. Check MongoDB Atlas connection
5. Review this guide for common issues

---

**Good luck with your deployment! 🚀**

