const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        address: req.user.address,
        avatar: req.user.avatar,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be between 10 and 15 characters'),
  body('address.street').optional().isString().withMessage('Street must be a string'),
  body('address.city').optional().isString().withMessage('City must be a string'),
  body('address.state').optional().isString().withMessage('State must be a string'),
  body('address.zipCode').optional().isString().withMessage('Zip code must be a string'),
  body('address.country').optional().isString().withMessage('Country must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, address } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// @route   GET /api/users/my-products
// @desc    Get user's products
// @access  Private
router.get('/my-products', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { seller: req.user._id };
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
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
    console.error('Get user products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/users/seller/:id
// @desc    Get seller profile by ID
// @access  Public
router.get('/seller/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id)
      .select('name email phone avatar createdAt');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Get seller's approved products
    const products = await Product.find({ 
      seller: req.params.id, 
      status: 'approved',
      isAvailable: true 
    })
    .select('title price images category createdAt')
    .sort({ createdAt: -1 })
    .limit(6);

    // Get seller stats
    const stats = await Product.aggregate([
      { $match: { seller: seller._id, status: 'approved' } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalViews: { $sum: '$viewCount' }
        }
      }
    ]);

    res.json({
      seller,
      products,
      stats: stats.length > 0 ? stats[0] : { totalProducts: 0, totalViews: 0 }
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ message: 'Server error while fetching seller profile' });
  }
});

module.exports = router;
