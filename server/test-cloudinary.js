require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set (hidden)' : 'NOT SET');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set (hidden)' : 'NOT SET');

// Test connection
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
    console.log('\nYour Cloudinary is configured correctly!');
    console.log('You can now upload images to your products.');
  })
  .catch(error => {
    console.error('\n❌ Cloudinary connection failed!');
    console.error('Error:', error.message || 'Unknown error');
    console.error('Error details:', error);
    
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your .env file is in the server folder');
    console.error('2. Check that credentials have no extra spaces or quotes');
    console.error('3. Verify credentials in Cloudinary Dashboard:');
    console.error('   - Go to https://cloudinary.com/console');
    console.error('   - Check Dashboard tab');
    console.error('   - Copy Cloud Name, API Key, and API Secret exactly');
    console.error('4. Make sure your Cloudinary account is active');
    
    // Try to get more info
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      console.error('\nCurrent credentials:');
      console.error('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
      console.error('API Key length:', process.env.CLOUDINARY_API_KEY?.length || 0);
      console.error('API Secret length:', process.env.CLOUDINARY_API_SECRET?.length || 0);
    }
    
    process.exit(1);
  });
