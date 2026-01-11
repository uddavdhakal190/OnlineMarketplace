const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  
  // Get email from command line argument
  const email = process.argv[2];
  
  if (!email) {
    console.error(' Please provide your email address');
    console.log('Usage: node make-admin.js your-email@gmail.com');
    process.exit(1);
  }
  
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(` User with email ${email} not found`);
      process.exit(1);
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(' Success!');
    console.log(`User ${user.name} (${user.email}) is now an admin`);
    console.log('\nYou can now:');
    console.log('- Access admin panel at /admin');
    console.log('- Approve/reject products');
    console.log('- Manage users and orders');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
