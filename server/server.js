const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://onlinemarketplace-frontend.onrender.com', // Render frontend URL
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173' // Vite default port
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== 'production') {
      // In development, allow all origins
      callback(null, true);
    } else {
      // In production, log and block
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

// MongoDB connection function
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mart';
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  Warning: MONGODB_URI not found in .env, using default localhost connection');
    }
    
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Check if MONGODB_URI is correct in your .env file');
      console.error('2. Verify your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('3. Check your internet connection');
      console.error('4. Verify MongoDB Atlas cluster is running');
    }
    
    throw error;
  }
};

// MongoDB connection check middleware
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      message: 'Database connection not available. Please try again in a moment.',
      error: 'Database unavailable'
    });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'O Mart API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      admin: '/api/admin'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Start server and attempt MongoDB connection
const startServer = async () => {
  // Start the server first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('⏳ Attempting to connect to MongoDB...');
  });

  // Attempt MongoDB connection (non-blocking)
  try {
    await connectDB();
  } catch (error) {
    console.error('⚠️  MongoDB connection failed. Server is running but database operations will fail.');
    console.error('💡 Please check:');
    console.error('   1. Your IP is whitelisted in MongoDB Atlas Network Access');
    console.error('   2. MONGODB_URI is correct in your .env file');
    console.error('   3. Your internet connection is working');
    console.error('\n🔄 Server will retry connection automatically when MongoDB becomes available.');
    
    // Retry connection every 10 seconds
    const retryInterval = setInterval(async () => {
      try {
        if (mongoose.connection.readyState === 0) {
          await connectDB();
          clearInterval(retryInterval);
          console.log('✅ MongoDB connection restored!');
        }
      } catch (err) {
        // Silently retry
      }
    }, 10000);
  }
};

startServer();
