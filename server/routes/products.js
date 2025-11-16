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
    // Handle text search - use regex for simpler search that works with sorting
    if (cleanSearch) {
      filter.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { description: { $regex: cleanSearch, $options: 'i' } },
        { tags: { $regex: cleanSearch, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    // Validate sortBy field
    const validSortFields = ['createdAt', 'price', 'viewCount', 'title'];
    const cleanSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const cleanSortOrder = sortOrder === 'asc' ? 1 : -1;
    
    // Primary sort
    sort[cleanSortBy] = cleanSortOrder;
    
    // Secondary sort by createdAt (newest first) for consistent ordering when primary values are equal
    if (cleanSortBy !== 'createdAt') {
      sort.createdAt = -1; // Always newest first as secondary sort
    }

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
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error while fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    const validCategories = ['Electronics', 'Fashion', 'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Health & Beauty', 'Other'];
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
        
        // Provide helpful error messages
        let errorMessage = uploadError.message || 'Unknown error';
        
        if (errorMessage.includes('disabled') || errorMessage.includes('cloud_name is disabled')) {
          errorMessage = 'Cloudinary account is disabled. Please create a new Cloudinary account and update your credentials in the .env file. See CLOUDINARY_FIX.md for instructions.';
        } else if (uploadError.http_code === 401) {
          errorMessage = 'Cloudinary authentication failed. Please check your API credentials in the .env file.';
        } else if (uploadError.http_code === 400) {
          errorMessage = 'Invalid image file. Please try a different image.';
        }
        
        return res.status(500).json({ 
          message: `Error uploading image ${i + 1}: ${errorMessage}` 
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
router.put('/:id', auth, upload.array('images', 5), handleUploadError, async (req, res) => {
  try {
    // Manual validation for FormData (express-validator doesn't work well with FormData)
    const errors = [];
    
    if (req.body.title !== undefined) {
      const title = req.body.title?.trim() || '';
      if (title.length < 5 || title.length > 100) {
        errors.push({ msg: 'Title must be between 5 and 100 characters', param: 'title' });
      }
    }
    
    if (req.body.description !== undefined) {
      const description = req.body.description?.trim() || '';
      if (description.length < 10 || description.length > 1000) {
        errors.push({ msg: 'Description must be between 10 and 1000 characters', param: 'description' });
      }
    }
    
    if (req.body.price !== undefined) {
      const price = parseFloat(req.body.price);
      if (isNaN(price) || price < 0) {
        errors.push({ msg: 'Price must be a positive number', param: 'price' });
      }
    }
    
    if (req.body.category !== undefined) {
      const validCategories = ['Electronics', 'Fashion', 'Sports & Outdoors', 'Books & Media', 'Toys & Games', 'Health & Beauty', 'Other'];
      if (!validCategories.includes(req.body.category)) {
        errors.push({ msg: 'Invalid category', param: 'category' });
      }
    }
    
    if (req.body.condition !== undefined) {
      const validConditions = ['New', 'Like New', 'Good', 'Fair'];
      if (!validConditions.includes(req.body.condition)) {
        errors.push({ msg: 'Invalid condition', param: 'condition' });
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
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

    // Build updateData object with only the fields that are being updated
    const updateData = {};
    
    if (req.body.title !== undefined) {
      updateData.title = req.body.title.trim();
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description.trim();
    }
    if (req.body.price !== undefined) {
      updateData.price = parseFloat(req.body.price);
    }
    if (req.body.category !== undefined) {
      updateData.category = req.body.category;
    }
    if (req.body.condition !== undefined) {
      updateData.condition = req.body.condition;
    }

    // Parse location from FormData (comes as location.city, location.state, etc.)
    const location = {};
    if (req.body['location.city']) location.city = req.body['location.city'];
    if (req.body['location.state']) location.state = req.body['location.state'];
    if (req.body['location.country']) location.country = req.body['location.country'];
    if (Object.keys(location).length > 0) {
      updateData.location = location;
    }

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
          
          // Provide helpful error messages
          let errorMessage = uploadError.message || 'Unknown error';
          
          if (errorMessage.includes('disabled') || errorMessage.includes('cloud_name is disabled')) {
            errorMessage = 'Cloudinary account is disabled. Please create a new Cloudinary account and update your credentials in the .env file. See CLOUDINARY_FIX.md for instructions.';
          } else if (uploadError.http_code === 401) {
            errorMessage = 'Cloudinary authentication failed. Please check your API credentials in the .env file.';
          } else if (uploadError.http_code === 400) {
            errorMessage = 'Invalid image file. Please try a different image.';
          }
          
          return res.status(500).json({ message: `Error uploading images: ${errorMessage}` });
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

// @route   PUT /api/products/:id/mark-sold
// @desc    Mark a product as sold
// @access  Private (Seller/Owner)
router.put('/:id/mark-sold', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to mark this product as sold' });
    }

    // Check if product is already sold
    if (product.status === 'sold') {
      return res.status(400).json({ message: 'Product is already marked as sold' });
    }

    // Mark product as sold
    product.status = 'sold';
    product.isAvailable = false;
    product.soldAt = new Date();
    await product.save();

    const updatedProduct = await Product.findById(req.params.id)
      .populate('seller', 'name email phone');

    res.json({
      message: 'Product marked as sold successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Mark product as sold error:', error);
    res.status(500).json({ message: 'Server error while marking product as sold' });
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
