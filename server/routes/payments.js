const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for a product
// @access  Private
router.post('/create-payment-intent', auth, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, shippingAddress } = req.body;

    // Get product details
    const product = await Product.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is available
    if (!product.isAvailable || product.status !== 'approved') {
      return res.status(400).json({ message: 'Product is not available for purchase' });
    }

    // Check if user is admin (admin cannot buy)
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin cannot purchase products. Admin role is for management only.' });
    }

    // Check if user is trying to buy their own product
    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot buy your own product' });
    }

    // Calculate total amount (product price + shipping if needed)
    const amount = Math.round(product.price * 100); // Convert to cents

    // Create or get Stripe customer
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      customerId = customer.id;
      
      // Update user with customer ID
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    // Create payment intent (Finland - Euro)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      customer: customerId,
      metadata: {
        productId: productId,
        buyerId: req.user._id.toString(),
        sellerId: product.seller._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error while creating payment intent' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and create order
// @access  Private
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, productId, shippingAddress } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Get product details
    const product = await Product.findById(productId).populate('seller');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is still available
    if (!product.isAvailable || product.status !== 'approved') {
      return res.status(400).json({ message: 'Product is no longer available' });
    }

    // Create order
    const order = new Order({
      buyer: req.user._id,
      seller: product.seller._id,
      product: product._id,
      amount: product.price,
      paymentIntentId: paymentIntentId,
      paymentStatus: 'paid',
      shippingAddress: shippingAddress
    });

    await order.save();

    // Update product status
    product.isAvailable = false;
    product.status = 'sold';
    product.soldAt = new Date();
    product.buyer = req.user._id;
    await product.save();

    // Populate order details
    await order.populate([
      { path: 'buyer', select: 'name email' },
      { path: 'seller', select: 'name email' },
      { path: 'product', select: 'title price images' }
    ]);

    res.json({
      message: 'Payment confirmed and order created successfully',
      order
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error while confirming payment' });
  }
});

// @route   GET /api/payments/orders
// @desc    Get user's orders
// @access  Private
router.get('/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'all' } = req.query;
    const filter = {};

    if (type === 'bought') {
      filter.buyer = req.user._id;
    } else if (type === 'sold') {
      filter.seller = req.user._id;
    } else {
      filter.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
      ];
    }

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
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// @route   PUT /api/payments/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/orders/:id/status', auth, [
  body('status').isIn(['processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the seller or buyer
    if (order.seller.toString() !== req.user._id.toString() && 
        order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update order
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    await order.populate([
      { path: 'buyer', select: 'name email' },
      { path: 'seller', select: 'name email' },
      { path: 'product', select: 'title price images' }
    ]);

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      // Additional logic can be added here if needed
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
