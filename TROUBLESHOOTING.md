# Troubleshooting Guide

## 500 Server Error on Login/Register

### Common Causes

1. **Missing JWT_SECRET**
   - Error: `JWT_SECRET is not configured`
   - Fix: Set `JWT_SECRET` in Render backend environment variables

2. **Database Connection Failed**
   - Error: `Database connection not available`
   - Fix: Check MongoDB Atlas connection and Network Access settings

3. **Missing Environment Variables**
   - Check Render logs for specific missing variable errors

### How to Fix

#### Step 1: Check Render Logs

1. Go to Render Dashboard
2. Click on your **Backend Service**
3. Go to **Logs** tab
4. Look for error messages (they'll show what's missing)

#### Step 2: Verify Environment Variables

In Render backend service, make sure these are set:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret_key_min_32_characters
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://onlinemarketplace-frontend.onrender.com
```

#### Step 3: Test Backend Health

```bash
curl https://onlinemarketplace-backend-vx8c.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected"
}
```

If `database` shows `disconnected`, check MongoDB Atlas.

#### Step 4: Check MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. **Network Access** → Make sure `0.0.0.0/0` is allowed (or Render IPs)
3. **Database Access** → Verify user credentials are correct
4. Check connection string format

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `JWT_SECRET is not configured` | Missing JWT_SECRET env var | Set in Render environment |
| `Database connection not available` | MongoDB not connected | Check MongoDB Atlas settings |
| `MongooseServerSelectionError` | IP not whitelisted | Add IP to MongoDB Network Access |
| `Authentication failed` | Wrong MongoDB credentials | Update MONGODB_URI |

### Quick Debug Commands

```bash
# Test health endpoint
curl https://onlinemarketplace-backend-vx8c.onrender.com/api/health

# Test root endpoint
curl https://onlinemarketplace-backend-vx8c.onrender.com/

# Test login (will show error details)
curl -X POST https://onlinemarketplace-backend-vx8c.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Still Not Working?

1. **Check Render Logs** - Most errors are logged there
2. **Verify all env vars** - Use the checklist above
3. **Test MongoDB connection** - Use MongoDB Atlas connection test
4. **Redeploy backend** - Sometimes helps after env var changes

