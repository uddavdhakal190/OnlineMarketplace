# O Mart - C2C Marketplace Platform (Finland)

A simple, community-driven consumer-to-consumer marketplace platform built with the MERN stack, designed exclusively for Finland. Users can buy and sell new products through direct contact with sellers.

##  Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with any email address
- **Product Management**: Create, edit, delete, and manage product listings
- **Product Browsing**: Advanced search, filtering, and categorization
- **Admin Panel**: Complete admin dashboard for managing products and users
- **Direct Contact**: Buyers contact sellers directly via email or phone
- **Finland Only**: Marketplace available exclusively in Finland
- **Finnish Localization**: All prices in Euros (€), Finnish postal codes, and location support
- **Image Upload**: Cloudinary integration for product images
- **Mark as Sold**: Sellers can manually mark products as sold
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **New Products Only**: All products are brand new

### User Roles
- **Users**: Can both buy and sell products (all registered users)
- **Admins**: Manage products and users (cannot buy or sell)

### Product Categories
- Electronics
- Fashion
- Sports & Outdoors
- Books & Media
- Toys & Games
- Health & Beauty
- Other

##  Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

##  Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mart?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_min_32_characters
   JWT_EXPIRE=200d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

##  Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file
5. Add your IP address to Network Access (or use `0.0.0.0/0` for development)

### Cloudinary Setup
1. Create a Cloudinary account (free tier available)
2. Get your cloud name, API key, and API secret from Dashboard
3. Update the Cloudinary credentials in your `.env` file

### Generate JWT Secret
You can generate a secure JWT secret using:
```bash
openssl rand -base64 48 | tr -d "=+/" | cut -c1-64
```

## 📁 Project Structure

```
Mart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── layout/     # Navbar, Footer
│   │   │   └── ui/         # Button, Card, Input, etc.
│   │   ├── contexts/       # AuthContext
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── admin/      # AdminDashboard, AdminProducts, AdminUsers
│   │   │   └── ...         # Home, Products, ProductDetail, etc.
│   │   ├── utils/          # API, helpers
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/             # User, Product models
│   ├── routes/             # API routes (auth, products, users, admin)
│   ├── middleware/         # auth, upload
│   ├── package.json
│   └── server.js
└── README.md
```

##  Deployment

### Deploy to Render

#### Backend Deployment
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
4. Set environment variables (see Configuration section)
5. Deploy

#### Frontend Deployment
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
5. Deploy

**Important**: After setting `VITE_API_URL`, you must **clear build cache & redeploy** for changes to take effect.

##  Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js for security headers
- File upload validation (images only, 5MB max)
- Admin-only routes protection

##  API Endpoints

### Authentication
- `POST /api/auth/register` - User registration (any email)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters, search, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (requires auth, seller role)
- `PUT /api/products/:id` - Update product (owner or admin)
- `PUT /api/products/:id/mark-sold` - Mark product as sold
- `DELETE /api/products/:id` - Delete product (owner or admin)
- `GET /api/products/seller/my-products` - Get seller's products

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/my-products` - Get user's products
- `GET /api/users/seller/:id` - Get seller profile

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/products` - Get all products for admin
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/products/:id/reject` - Reject product
- `DELETE /api/admin/products/:id` - Delete product (admin)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/toggle-status` - Toggle user status

### Health Check
- `GET /api/health` - Server and database health status
- `GET /` - API information and available endpoints

## 🎯 How It Works

1. **Registration**: Users register with any email address
2. **Product Listing**: Users create product listings (admin approval required)
3. **Browsing**: Buyers browse and search products
4. **Contact**: Buyers contact sellers directly via email/phone
5. **Sale**: Transaction happens directly between buyer and seller
6. **Mark as Sold**: Seller marks product as sold when transaction completes

## 🔧 Troubleshooting

### Port Already in Use Error

If you see `Error: listen EADDRINUSE: address already in use :::5001`:

**Quick Fix:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Then restart server
cd server && npm run dev
```

**For frontend port (3000 or 5173):**
```bash
lsof -ti:3000 | xargs kill -9
# or
lsof -ti:5173 | xargs kill -9
```

### Cloudinary Upload Errors

- Verify credentials are set in `.env` file
- Check Cloudinary account is active
- Ensure images are valid format (JPG, PNG) and under 5MB

### Database Connection Issues

- Verify MongoDB Atlas Network Access allows your IP
- Check `MONGODB_URI` is correct
- Ensure MongoDB cluster is running

### CORS Errors

- Verify `FRONTEND_URL` in backend matches your frontend URL
- Check backend CORS configuration includes your frontend origin

##  Pages

### Public Pages
- Home
- Products (with search, filters, sorting)
- Product Detail
- Seller Profile
- Login
- Register
- About Us
- Contact
- Privacy Policy
- Terms of Service

### Protected Pages
- Profile
- My Products
- Create Product
- Edit Product

### Admin Pages
- Admin Dashboard
- Admin Products
- Admin Users

##  Support

For support, email **support@omart.fi** or create an issue in the repository.

##  License

This project is licensed under the MIT License.

---

**Built with love for the Finland community**

**© 2026 O Mart. All rights reserved.**
