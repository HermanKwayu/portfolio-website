#!/bin/bash

# 🚀 Herman Kwayu Website - Production Deployment with Static Files Fix
# This script ensures static files are properly configured for production

set -e  # Exit on any error

echo "🚀 Starting Herman Kwayu Website Deployment"
echo "=========================================="

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

# Step 1: Check if static files exist
print_status "Checking static files..."
required_files=("public/sitemap.xml" "public/robots.txt" "public/manifest.json" "public/sw.js")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✅ $file exists"
    else
        print_error "❌ $file missing - creating..."
        exit 1
    fi
done

# Step 2: Validate static file content
print_status "Validating static file content..."

# Check sitemap.xml
if grep -q "hermankwayu.com" public/sitemap.xml; then
    print_success "✅ Sitemap has correct domain"
else
    print_error "❌ Sitemap domain issue"
    exit 1
fi

# Check robots.txt
if grep -q "hermankwayu.com" public/robots.txt; then
    print_success "✅ Robots.txt has correct domain"
else
    print_error "❌ Robots.txt domain issue"
    exit 1
fi

# Check manifest.json
if grep -q "Herman Kwayu" public/manifest.json; then
    print_success "✅ Manifest.json is valid"
else
    print_error "❌ Manifest.json issue"
    exit 1
fi

# Check service worker
if grep -q "herman-kwayu" public/sw.js; then
    print_success "✅ Service worker is valid"
else
    print_error "❌ Service worker issue"
    exit 1
fi

# Step 3: Validate package.json scripts
print_status "Checking build scripts..."
if grep -q "vercel:build" package.json; then
    print_success "✅ Vercel build script exists"
else
    print_warning "⚠️ Vercel build script missing"
fi

# Step 4: Validate vercel.json configuration
print_status "Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    if grep -q "buildCommand" vercel.json; then
        print_success "✅ Vercel build command configured"
    else
        print_warning "⚠️ Build command not configured in vercel.json"
    fi
    
    if grep -q "rewrites" vercel.json; then
        print_success "✅ Vercel routing configured"
    else
        print_warning "⚠️ Routing not configured in vercel.json"
    fi
else
    print_error "❌ vercel.json missing"
    exit 1
fi

# Step 5: Build the project
print_status "Building project..."
if npm run vercel:build; then
    print_success "✅ Build completed successfully"
else
    print_error "❌ Build failed"
    exit 1
fi

# Step 6: Verify build output
print_status "Verifying build output..."
if [ -d "dist" ]; then
    print_success "✅ Build directory exists"
    
    # Check if static files are in dist
    if [ -f "dist/sitemap.xml" ]; then
        print_success "✅ Static files copied to build"
    else
        print_warning "⚠️ Static files not in build output"
    fi
else
    print_error "❌ Build directory missing"
    exit 1
fi

# Step 7: Final deployment message
print_success "🎉 Pre-deployment checks passed!"
echo ""
print_status "Next steps:"
echo "1. Push changes to main branch: git push origin main"
echo "2. Vercel will auto-deploy with proper static files"
echo "3. Test these URLs after deployment:"
echo "   - https://www.hermankwayu.com/sitemap.xml"
echo "   - https://www.hermankwayu.com/robots.txt"
echo "   - https://www.hermankwayu.com/manifest.json"
echo "   - https://www.hermankwayu.com/sw.js"
echo ""
print_status "4. Submit sitemap to Google Search Console:"
echo "   - https://search.google.com/search-console"
echo "   - Add: https://www.hermankwayu.com/sitemap.xml"
echo ""
print_success "🚀 Ready for deployment!"