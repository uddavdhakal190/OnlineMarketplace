# O Mart - C2C Marketplace Platform (Finland)

A complete consumer-to-consumer marketplace platform built with the MERN stack, designed for Finland. Users can buy and sell new products with secure payment processing in Euros (€).

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with role-based access (Buyer/Seller/Admin)
- **Product Management**: Create, edit, delete, and manage product listings
- **Product Browsing**: Advanced search, filtering, and categorization
- **Admin Panel**: Complete admin dashboard for managing products, users, and orders
- **Payment Processing**: Stripe integration for secure payments in Euros (€)
- **Finland Only**: Marketplace available exclusively in Finland
- **Finnish Localization**: All prices in Euros, Finnish postal codes, and location support
- **Order Management**: Track orders from creation to delivery
- **Image Upload**: Cloudinary integration for product images
- **Responsive Design**: Mobile-first design with Tailwind CSS

### User Roles
- **Buyers**: Browse products, make purchases, track orders
- **Sellers**: Create product listings, manage inventory, track sales
- **Admins**: Approve products, manage users, view analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image storage
- **Multer** - File upload handling

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Stripe Elements** - Payment UI

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account

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
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mart?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
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
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### MongoDB Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary credentials in your `.env` file

### Stripe Setup
1. Create a Stripe account
2. Get your publishable and secret keys
3. Update the Stripe credentials in your `.env` files
4. Set up webhooks for payment processing

## 📁 Project Structure

```
Mart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy with Git

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet.js for security headers
- File upload validation

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/products` - Admin products
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/products/:id/reject` - Reject product

### Payments
- `POST /api/payments/create-payment-intent` - Create payment
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/orders` - Get orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Port Already in Use Error

If you see an error like `Error: listen EADDRINUSE: address already in use :::5001`, it means another process is using the port.

**Quick Fix (Method 1 - Using the script):**
```bash
./fix-port.sh 5001
```

**Quick Fix (Method 2 - Manual command):**
```bash
# Find and kill the process using port 5001
lsof -ti:5001 | xargs kill -9
```

**Quick Fix (Method 3 - One-liner for any port):**
```bash
# Replace 5001 with your port number
lsof -ti:5001 | xargs kill -9 && cd server && npm run dev
```

**Alternative - Change the port:**
If you prefer to use a different port, update the `PORT` in `server/.env`:
```env
PORT=5002  # or any other available port
```

**Check what's using a port:**
```bash
lsof -i:5001
```

**For frontend port (usually 3000 or 5173):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or port 5173 (Vite default)
lsof -ti:5173 | xargs kill -9
```

## 🆘 Support

For support, email support@omart.fi or create an issue in the repository.

---

**Happy Coding! 🎉**
