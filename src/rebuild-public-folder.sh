#!/bin/bash

echo "🛠️  Rebuilding public folder for Vercel deployment..."

# Create a backup of important files first
mkdir -p /tmp/public_backup
cp public/manifest.json /tmp/public_backup/ 2>/dev/null || true
cp public/robots.txt /tmp/public_backup/ 2>/dev/null || true
cp public/sitemap.xml /tmp/public_backup/ 2>/dev/null || true
cp public/sw.js /tmp/public_backup/ 2>/dev/null || true
cp public/unsubscribe.html /tmp/public_backup/ 2>/dev/null || true
cp public/og-image.svg /tmp/public_backup/ 2>/dev/null || true
cp public/favicon.ico /tmp/public_backup/ 2>/dev/null || true

echo "📦 Backed up important files"

# Remove all problematic content
rm -rf public/_headers/ 2>/dev/null || true
rm -rf public/_redirects/ 2>/dev/null || true  
rm -rf public/_redirects_fixed/ 2>/dev/null || true
rm -rf public/netlify_redirects/ 2>/dev/null || true
rm -f public/sitemap_xml.tsx 2>/dev/null || true
rm -f public/*.tsx 2>/dev/null || true

echo "🧹 Cleaned problematic files"

# Restore important files
cp /tmp/public_backup/* public/ 2>/dev/null || true

echo "📁 Current public folder structure:"
ls -la public/

echo "✅ Public folder rebuilt for Vercel deployment"
echo "🚀 Ready to deploy with: vercel --prod"