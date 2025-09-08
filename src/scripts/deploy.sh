#!/bin/bash

# Production Deployment Script for Herman Kwayu's Portfolio Website
# Run this script to prepare and deploy your application

set -e  # Exit on any error

echo "🚀 Starting production deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
print_status "Checking required files..."

required_files=(
    "package.json"
    "vite.config.ts"
    "tsconfig.json"
    ".env.example"
    "netlify.toml"
    "vercel.json"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file is missing!"
        exit 1
    fi
done

print_success "All required files are present."

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please create one based on .env.example"
    print_status "Copying .env.example to .env.local for you to fill in..."
    cp .env.example .env.local
    print_warning "Please edit .env.local with your actual environment variables before deploying."
fi

# Check Node.js version
print_status "Checking Node.js version..."
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version check passed: $(node -v)"

# Clean install dependencies
print_status "Installing dependencies..."
if [ -d "node_modules" ]; then
    print_status "Cleaning existing node_modules..."
    rm -rf node_modules
fi

npm install
print_success "Dependencies installed successfully."

# Run validation scripts
print_status "Running validation scripts..."
if [ -f "scripts/validate-static-files.js" ]; then
    npm run validate
    print_success "Static files validation passed."
else
    print_warning "Static files validation script not found, skipping..."
fi

# Run TypeScript check
print_status "Running TypeScript type check..."
npx tsc --noEmit
print_success "TypeScript check passed."

# Build the application
print_status "Building application for production..."
npm run build
print_success "Build completed successfully."

# Check build output
print_status "Verifying build output..."
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found!"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    print_error "index.html not found in build output!"
    exit 1
fi

build_size=$(du -sh dist | cut -f1)
print_success "Build output verified. Total size: $build_size"

# Check for common deployment files
print_status "Checking deployment configuration files..."

if [ -f "netlify.toml" ]; then
    print_success "Netlify configuration found (netlify.toml)"
fi

if [ -f "vercel.json" ]; then
    print_success "Vercel configuration found (vercel.json)"
fi

# Run preview server to test build
print_status "Starting preview server to test build..."
print_status "You can test your production build at http://localhost:4173"
print_status "Press Ctrl+C to stop the preview server when you're done testing."

# Background the preview server and capture its PID
npm run preview &
preview_pid=$!

# Give the server a moment to start
sleep 3

print_success "Preview server started (PID: $preview_pid)"
print_status "Test your application thoroughly before deploying to production."
print_status ""
print_status "📋 Pre-deployment checklist:"
print_status "  ✅ Dependencies installed"
print_status "  ✅ TypeScript compilation successful"
print_status "  ✅ Production build completed"
print_status "  ✅ Build output verified"
print_status "  🔍 Preview server running for testing"
print_status ""
print_status "🎯 Next steps:"
print_status "  1. Test your application at http://localhost:4173"
print_status "  2. Verify all features work correctly"
print_status "  3. Stop the preview server (Ctrl+C)"
print_status "  4. Set up your environment variables on your hosting platform"
print_status "  5. Deploy using your preferred method:"
print_status "     - Netlify: Connect your Git repository"
print_status "     - Vercel: Connect your Git repository"
print_status "     - Manual: Upload the 'dist' folder"
print_status ""
print_status "📚 See DEPLOYMENT_GUIDE.md for detailed deployment instructions."

# Wait for the preview server
wait $preview_pid

print_success "Deployment preparation completed successfully! 🎉"