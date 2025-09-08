#!/usr/bin/env node

/**
 * Static Files Fix Script for Vercel/Netlify Deployment
 * Ensures all static files are properly copied and accessible
 */

const fs = require('fs');
const path = require('path');

const STATIC_FILES = [
  { src: 'public/sitemap.xml', dest: 'dist/sitemap.xml' },
  { src: 'public/robots.txt', dest: 'dist/robots.txt' },
  { src: 'public/manifest.json', dest: 'dist/manifest.json' },
  { src: 'public/sw.js', dest: 'dist/sw.js' }
];

console.log('🔧 Fixing Static Files for Deployment...\n');

// Ensure dist directory exists
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.log('📁 Creating dist directory...');
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy static files to dist
let filesCopied = 0;
let errorsFound = 0;

STATIC_FILES.forEach(file => {
  const srcPath = path.join(process.cwd(), file.src);
  const destPath = path.join(process.cwd(), file.dest);
  
  try {
    if (fs.existsSync(srcPath)) {
      // Read source file
      const content = fs.readFileSync(srcPath);
      
      // Write to destination
      fs.writeFileSync(destPath, content);
      
      // Verify file was copied correctly
      const copiedSize = fs.statSync(destPath).size;
      const originalSize = fs.statSync(srcPath).size;
      
      if (copiedSize === originalSize) {
        console.log(`✅ Copied: ${file.src} → ${file.dest} (${copiedSize} bytes)`);
        filesCopied++;
      } else {
        console.log(`❌ Size mismatch: ${file.src} → ${file.dest}`);
        errorsFound++;
      }
    } else {
      console.log(`❌ Source file not found: ${file.src}`);
      errorsFound++;
    }
  } catch (error) {
    console.log(`❌ Error copying ${file.src}: ${error.message}`);
    errorsFound++;
  }
});

// Validate critical file contents
console.log('\n🔍 Validating File Contents:');

// Check sitemap.xml
const sitemapPath = path.join(process.cwd(), 'dist/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes('<?xml') && sitemapContent.includes('urlset')) {
    console.log('✅ sitemap.xml: Valid XML structure');
  } else {
    console.log('❌ sitemap.xml: Invalid XML structure');
    errorsFound++;
  }
} else {
  console.log('❌ sitemap.xml: File not found in dist');
  errorsFound++;
}

// Check robots.txt
const robotsPath = path.join(process.cwd(), 'dist/robots.txt');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('User-agent:') && robotsContent.includes('Sitemap:')) {
    console.log('✅ robots.txt: Valid format with sitemap reference');
  } else {
    console.log('❌ robots.txt: Missing required directives');
    errorsFound++;
  }
} else {
  console.log('❌ robots.txt: File not found in dist');
  errorsFound++;
}

// Check manifest.json
const manifestPath = path.join(process.cwd(), 'dist/manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    if (manifest.name && manifest.start_url && manifest.icons) {
      console.log('✅ manifest.json: Valid PWA manifest');
    } else {
      console.log('❌ manifest.json: Missing required PWA properties');
      errorsFound++;
    }
  } catch (error) {
    console.log('❌ manifest.json: Invalid JSON format');
    errorsFound++;
  }
} else {
  console.log('❌ manifest.json: File not found in dist');
  errorsFound++;
}

// Check service worker
const swPath = path.join(process.cwd(), 'dist/sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (swContent.includes('addEventListener') && swContent.includes('cache')) {
    console.log('✅ sw.js: Valid service worker structure');
  } else {
    console.log('❌ sw.js: Invalid service worker structure');
    errorsFound++;
  }
} else {
  console.log('❌ sw.js: File not found in dist');
  errorsFound++;
}

// Create _headers file for Netlify
const headersPath = path.join(process.cwd(), 'dist/_headers');
const headersContent = `# Headers for static files
/sitemap.xml
  Content-Type: application/xml
  Cache-Control: public, max-age=86400

/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=86400

/manifest.json
  Content-Type: application/json
  Cache-Control: public, max-age=3600

/sw.js
  Content-Type: application/javascript
  Service-Worker-Allowed: /
  Cache-Control: public, max-age=0

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
`;

try {
  fs.writeFileSync(headersPath, headersContent);
  console.log('✅ Created _headers file for Netlify');
} catch (error) {
  console.log('❌ Failed to create _headers file:', error.message);
  errorsFound++;
}

// Summary
console.log('\n📊 Static Files Fix Summary:');
console.log(`📄 Files copied: ${filesCopied}/${STATIC_FILES.length}`);
console.log(`❌ Errors found: ${errorsFound}`);

if (errorsFound === 0) {
  console.log('\n🎉 All static files are ready for deployment!');
  console.log('\n🔗 Test these URLs after deployment:');
  console.log('  • https://your-domain.com/sitemap.xml');
  console.log('  • https://your-domain.com/robots.txt');
  console.log('  • https://your-domain.com/manifest.json');
  console.log('  • https://your-domain.com/sw.js');
  console.log('\n💡 Add this to your build script: "npm run fix-static-files"');
} else {
  console.log('\n⚠️  Issues found. Please fix before deploying.');
  process.exit(1);
}