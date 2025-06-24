#!/bin/bash

# Movie Box Setup Script
# This script helps new developers set up the project quickly

echo "🎬 Movie Box Setup Script"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16.0 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="16.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to v16.0 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Set up environment variables
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "⚠️  .env file already exists, skipping..."
fi

# Check if API keys are configured
if grep -q "your_tmdb_api_key_here" .env; then
    echo ""
    echo "⚠️  IMPORTANT: You need to configure your API keys!"
    echo ""
    echo "1. Get a free TMDB API key from: https://www.themoviedb.org/settings/api"
    echo "2. Edit the .env file and replace 'your_tmdb_api_key_here' with your actual API key"
    echo "3. Optionally, get an OMDB API key from: http://www.omdbapi.com/apikey.aspx"
    echo ""
    echo "Example .env configuration:"
    echo "VITE_TMDB_API_KEY=your_actual_tmdb_api_key_here"
    echo "VITE_OMDB_API_KEY=your_actual_omdb_api_key_here"
    echo ""
fi

# Run linting to check for issues
echo "🔍 Running code quality checks..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting found some issues, but setup can continue"
else
    echo "✅ Code quality checks passed"
fi

# Try to build the project
echo ""
echo "🏗️  Testing build process..."
npm run build

if [ $? -ne 0 ]; then
    echo "⚠️  Build failed, but this might be due to missing API keys"
else
    echo "✅ Build successful"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your API keys in the .env file"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed instructions, see README.md"
echo "For contribution guidelines, see CONTRIBUTING.md"
echo ""
echo "Happy coding! 🚀"
