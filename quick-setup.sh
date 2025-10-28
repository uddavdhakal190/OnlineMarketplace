#!/bin/bash

echo "🚀 Mart Marketplace - Quick Setup Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Backend dependencies installed"
else
    echo "✅ Backend dependencies already installed"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../client
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

# Check for environment files
echo "🔧 Checking environment configuration..."

if [ ! -f "../server/.env" ]; then
    echo "⚠️  Backend .env file not found"
    echo "📋 Please copy server/env.production to server/.env and update with your credentials"
    echo "   See SETUP_GUIDE.md for detailed instructions"
else
    echo "✅ Backend .env file found"
fi

if [ ! -f ".env" ]; then
    echo "⚠️  Frontend .env file not found"
    echo "📋 Please copy client/env.production to client/.env and update with your credentials"
    echo "   See SETUP_GUIDE.md for detailed instructions"
else
    echo "✅ Frontend .env file found"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up MongoDB Atlas, Cloudinary, and Stripe (see SETUP_GUIDE.md)"
echo "2. Update your .env files with the credentials"
echo "3. Start the servers:"
echo "   Backend:  cd server && npm run dev"
echo "   Frontend: cd client && npm run dev"
echo ""
echo "🌐 Your app will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "📚 For detailed setup instructions, see SETUP_GUIDE.md"
