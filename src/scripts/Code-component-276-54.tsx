#!/bin/bash

# Vercel Deployment Script for Herman Kwayu Portfolio
# This script ensures proper public folder structure and deploys to Vercel

echo "🚀 Starting Vercel deployment for Herman Kwayu Portfolio..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Verify public folder structure
echo "📁 Verifying public folder structure..."

# Required files for Vercel deployment
required_files=(
    "public/manifest.json"
    "public/robots.txt"
    "public/sitemap.xml"
    "public/sw.js"
    "public/unsubscribe.html"
    "public/og-image.svg"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Clean up any .tsx files in public folder (they shouldn't be there)
echo "🧹 Cleaning up public folder..."
find public/ -name "*.tsx" -type f -delete 2>/dev/null || true
find public/ -name "Code-component-*" -type f -delete 2>/dev/null || true

# Remove old directories if they exist
rm -rf public/_headers_old public/_redirects_old 2>/dev/null || true

echo "✅ Public folder structure verified and cleaned"

# Check if vercel.json exists and is valid
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found"
    exit 1
fi

echo "✅ vercel.json configuration found"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

if command -v vercel &> /dev/null; then
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "Your site is now live on Vercel"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "⚠️  Vercel CLI not found. Install it with: npm i -g vercel"
    echo "Then run: vercel --prod"
fi

echo "✅ Deployment process completed!"