const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { auth, sellerAuth } = require('../middleware/auth');
const { upload, handleUploadError, uploadToCloudinary } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Clean empty query parameters
    const cleanCategory = category && category.trim() !== '' ? category : undefined;
    const cleanSearch = search && search.trim() !== '' ? search : undefined;
    
    // Parse and validate numeric values
    let cleanMinPrice = undefined;
    let cleanMaxPrice = undefined;
    if (minPrice && minPrice.trim() !== '') {
      const parsed = parseFloat(minPrice);
      if (!isNaN(parsed) && parsed >= 0) cleanMinPrice = parsed;
    }
    if (maxPrice && maxPrice.trim() !== '') {
      const parsed = parseFloat(maxPrice);
      if (!isNaN(parsed) && parsed >= 0) cleanMaxPrice = parsed;
    }
    
    // Validate pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 12, 50);

    // Build filter object
    const filter = { status: 'approved', isAvailable: true };

    if (cleanCategory) filter.category = cleanCategory;
    if (cleanMinPrice || cleanMaxPrice) {
      filter.price = {};
      if (cleanMinPrice) filter.price.$gte = cleanMinPrice;
      if (cleanMaxPrice) filter.price.$lte = cleanMaxPrice;
    }
    if (cleanSearch) {
      filter.$text = { $search: cleanSearch };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;

    // Get products
    const products = await Product.find(filter)
      .populate('seller', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone avatar');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Seller)
router.post('/', auth, sellerAuth, upload.array('images', 5), handleUploadError, async (req, res) => {
  try {
    console.log('Received FormData fields:', Object.keys(req.body));
    console.log('Files received:', req.files?.length || 0);
    
    // Parse FormData fields
    const {
      title,
      description,
      price,
      category,
      condition = 'New',
      tags = []
    } = req.body;

    // Parse location from FormData (comes as location.city, location.state, etc.)
    const location = {};
    if (req.body['location.city']) location.city = req.body['location.city'];
    if (req.body['location.state']) location.state = req.body['location.state'];
    if (req.body['location.country']) location.country = req.body['location.country'];

    // Simple validation (since FormData validation is tricky)
    if (!title || title.trim().length < 5 || title.trim().length > 100) {
      return res.status(400).json({ message: 'Title must be between 5 and 100 characters' });
    }
    if (!description || description.trim().length < 10 || description.trim().length > 1000) {
      return res.status(400).json({ message: 'Description must be between 10 and 1000 characters' });
    }
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    const validCategories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Upload images to Cloudinary
    const images = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        console.log(`Uploading image ${i + 1}/${req.files.length}: ${file.originalname} (${file.size} bytes)`);
        
        if (!file.buffer) {
          console.error('File buffer is missing');
          return res.status(400).json({ message: 'Image file is corrupted or invalid' });
        }
        
        const result = await uploadToCloudinary(file);
        console.log(`Image ${i + 1} uploaded successfully: ${result.secure_url}`);
        
        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      } catch (uploadError) {
        console.error(`Cloudinary upload error for image ${i + 1}:`, uploadError);
        console.error('Error details:', {
          message: uploadError.message,
          http_code: uploadError.http_code,
          name: uploadError.name
        });
        return res.status(500).json({ 
          message: `Error uploading image ${i + 1}: ${uploadError.message || 'Unknown error'}` 
        });
      }
    }

    // Create product
    const product = new Product({
      title: title.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      condition,
      images,
      seller: req.user._id,
      location: Object.keys(location).length > 0 ? location : undefined,
      tags: Array.isArray(tags) ? tags : []
    });

    await product.save();
    await product.populate('seller', 'name email phone');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Seller/Owner)
router.put('/:id', auth, upload.array('images', 5), handleUploadError, [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn([
    'Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors',
    'Books & Media', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Other'
  ]).withMessage('Invalid category'),
  body('condition').optional().isIn(['New', 'Like New', 'Good', 'Fair']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Check if product is sold
    if (product.status === 'sold') {
      return res.status(400).json({ message: 'Cannot update sold product' });
    }

    const updateData = { ...req.body };
    if (updateData.price) updateData.price = parseFloat(updateData.price);

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file);
          newImages.push({
            url: result.secure_url,
            publicId: result.public_id
          });
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: 'Error uploading images' });
        }
      }
      updateData.images = [...product.images, ...newImages];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('seller', 'name email phone');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Seller/Owner or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // TODO: Delete images from Cloudinary
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// @route   GET /api/products/seller/my-products
// @desc    Get seller's products
// @access  Private (Seller)
router.get('/seller/my-products', auth, sellerAuth, async (req, res) => {
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
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

module.exports = router;
