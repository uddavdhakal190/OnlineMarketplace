const express = require('express');
const { query } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(auth, adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingProducts,
      recentUsers,
      recentProducts,
      recentOrders
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      Product.find().sort({ createdAt: -1 }).limit(5).populate('seller', 'name email'),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('buyer seller product', 'name title')
    ]);

    // Calculate revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingProducts,
        totalRevenue
      },
      recent: {
        users: recentUsers,
        products: recentProducts,
        orders: recentOrders
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products for admin management
// @access  Private (Admin)
router.get('/products', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'sold']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   PUT /api/admin/products/:id/approve
// @desc    Approve a product
// @access  Private (Admin)
router.put('/products/:id/approve', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'approved';
    await product.save();

    res.json({
      message: 'Product approved successfully',
      product
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({ message: 'Server error while approving product' });
  }
});

// @route   PUT /api/admin/products/:id/reject
// @desc    Reject a product
// @access  Private (Admin)
router.put('/products/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.status = 'rejected';
    if (reason) product.rejectionReason = reason;
    await product.save();

    res.json({
      message: 'Product rejected successfully',
      product
    });
  } catch (error) {
    console.error('Reject product error:', error);
    res.status(500).json({ message: 'Server error while rejecting product' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product (admin only)
// @access  Private (Admin)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // TODO: Delete images from Cloudinary
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private (Admin)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('role').optional().isIn(['buyer', 'seller', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = {};
    
    if (role) {
      if (role === 'buyer') {
        // Show all non-admin users (buyers and sellers are both regular users)
        filter.role = { $ne: 'admin' };
      } else {
        filter.role = role;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user active status
// @access  Private (Admin)
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin management
// @access  Private (Admin)
router.get('/orders', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const orders = await Order.find(filter)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('product', 'title price images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

module.exports = router;
