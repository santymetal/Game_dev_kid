#!/bin/bash

# Voice Builder Setup Script
# This script sets up the Voice Builder development environment

echo "🎮 Setting up Voice Builder..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
if ! npm install; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run type check
echo "🔍 Running type check..."
if ! npm run check; then
    echo "⚠️  Type check failed, but continuing setup..."
fi

# Test build
echo "🏗️  Testing build process..."
if ! npm run build; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Clean up build artifacts for development
rm -rf dist/

echo ""
echo "🎉 Voice Builder setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To start production server:"
echo "  npm run start"
echo ""
echo "Open your browser to http://localhost:5000"
echo ""
echo "Have fun creating games with voice! 🎤✨"