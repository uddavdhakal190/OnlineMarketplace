# 🚀 Mart Marketplace - Production Setup Guide

This guide will help you set up all external services needed for your Mart marketplace to work in production.

## 📋 **Prerequisites**
- Node.js installed
- Git installed
- A code editor (VS Code recommended)

---

## 1️⃣ **MongoDB Atlas Setup**

### **Step 1: Create Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** or **"Start Free"**
3. Sign up with your email or use Google/GitHub

### **Step 2: Create Cluster**
1. Choose **"Build a Database"**
2. Select **"M0 Sandbox"** (Free tier - perfect for development)
3. Choose a **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Select a **Region** closest to you
5. Click **"Create Cluster"** (takes 1-3 minutes)

### **Step 3: Database Access**
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create a username (e.g., `mart-admin`)
5. Generate a strong password (save it!)
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

### **Step 4: Network Access**
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### **Step 5: Get Connection String**
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `mart`

**Example connection string:**
```
mongodb+srv://mart-admin:yourpassword@cluster0.abc123.mongodb.net/mart?retryWrites=true&w=majority
```

---

## 2️⃣ **Cloudinary Setup**

### **Step 1: Create Account**
1. Go to [Cloudinary](https://cloudinary.com)
2. Click **"Sign Up For Free"**
3. Fill in your details and verify email

### **Step 2: Get API Credentials**
1. After logging in, you'll see your **Dashboard**
2. Note down these values from the **Dashboard**:
   - **Cloud Name** (e.g., `dxy123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### **Step 3: Test Upload (Optional)**
1. Go to **"Media Library"** in the dashboard
2. Try uploading a test image to verify everything works

---

## 3️⃣ **Stripe Setup**

### **Step 1: Create Account**
1. Go to [Stripe](https://stripe.com)
2. Click **"Start now"** or **"Sign up"**
3. Fill in your business details
4. Verify your email

### **Step 2: Get API Keys**
1. Go to **"Developers"** → **"API Keys"**
2. You'll see two sets of keys:
   - **Publishable key** (starts with `pk_test_`) - Use this in frontend
   - **Secret key** (starts with `sk_test_`) - Use this in backend

### **Step 3: Set Up Webhooks (Optional)**
1. Go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Use: `http://localhost:5001/api/payments/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

---

## 🔧 **Update Environment Variables**

### **Backend (.env)**
1. Copy `server/env.production` to `server/.env`
2. Update with your actual credentials:

```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/mart?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### **Frontend (.env)**
1. Copy `client/env.production` to `client/.env`
2. Update with your actual credentials:

```env
VITE_API_URL=http://localhost:5001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

---

## 🚀 **Test Your Setup**

### **1. Start Backend Server**
```bash
cd server
npm run dev
```

### **2. Start Frontend Server**
```bash
cd client
npm run dev
```

### **3. Test Features**
1. **Register a new user** at http://localhost:3000/register
2. **Login** at http://localhost:3000/login
3. **Create a product** (as a seller)
4. **Upload images** (should work with Cloudinary)
5. **Test payment flow** (with Stripe test cards)

---

## 🧪 **Stripe Test Cards**

Use these test card numbers for testing payments:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date and any 3-digit CVC.

---

## 🔒 **Security Notes**

1. **Never commit `.env` files** to Git
2. **Use strong passwords** for all services
3. **Rotate API keys** regularly in production
4. **Use environment-specific configurations**
5. **Enable 2FA** on all service accounts

---

## 📞 **Need Help?**

- **MongoDB Atlas**: [Documentation](https://docs.atlas.mongodb.com/)
- **Cloudinary**: [Documentation](https://cloudinary.com/documentation)
- **Stripe**: [Documentation](https://stripe.com/docs)

---

## ✅ **Checklist**

- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Cloudinary account created
- [ ] API credentials obtained
- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Environment variables updated
- [ ] Backend server running
- [ ] Frontend server running
- [ ] All features tested

**🎉 You're ready to go live!**
