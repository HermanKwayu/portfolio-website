#!/bin/bash

echo "🧹 Cleaning public folder for Vercel deployment..."

# Remove all .tsx files from public folder (they shouldn't be there)
find public/ -name "*.tsx" -type f -delete 2>/dev/null || true

# Remove problematic directories that contain .tsx files
rm -rf public/_headers/ 2>/dev/null || true
rm -rf public/_redirects/ 2>/dev/null || true
rm -rf public/_redirects_fixed/ 2>/dev/null || true
rm -rf public/netlify_redirects/ 2>/dev/null || true

# Remove any other non-static files
rm -f public/sitemap_xml.tsx 2>/dev/null || true

echo "✅ Public folder cleaned for Vercel deployment"

# List current public folder contents
echo "📁 Current public folder structure:"
ls -la public/