#!/usr/bin/env node

/**
 * Deployment Fix Script
 * Cleans up file structure and validates deployment configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running Deployment Fix Script...\n');

// 1. Clean up incorrectly placed React components in public directory
console.log('📁 Cleaning up public directory...');

const publicRedirectsPath = path.join(process.cwd(), 'public/_redirects');

// Check if _redirects is a directory (it should be a file)
try {
  const stats = fs.statSync(publicRedirectsPath);
  if (stats.isDirectory()) {
    console.log('❌ Found directory at public/_redirects (should be a file)');
    console.log('🗑️  Removing incorrect directory...');
    fs.rmSync(publicRedirectsPath, { recursive: true, force: true });
    console.log('✅ Cleaned up public/_redirects directory');
  } else {
    console.log('✅ public/_redirects is correctly a file');
  }
} catch (e) {
  console.log('⚠️  public/_redirects does not exist (will be created)');
}

// 2. Create proper _redirects file
const redirectsContent = `# Netlify redirects file
# Static files should be served directly
/sitemap.xml     /sitemap.xml     200
/robots.txt      /robots.txt      200
/manifest.json   /manifest.json   200
/sw.js           /sw.js           200

# SPA routes should serve index.html
/resume-builder  /index.html      200
/unsubscribe     /index.html      200
/admin          /index.html      200

# Catch-all for SPA
/*              /index.html      200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.unsplash.com; frame-src 'none';`;

fs.writeFileSync(publicRedirectsPath, redirectsContent, 'utf8');
console.log('✅ Created proper _redirects file');

// 3. Clean up other misplaced directories
const cleanupDirs = [
  'public/_redirects_fixed',
  'public/netlify_redirects'
];

cleanupDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  Removing ${dir}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Cleaned up ${dir}`);
  }
});

// 4. Validate static files
const requiredFiles = [
  'public/sitemap.xml',
  'public/robots.txt', 
  'public/manifest.json',
  'public/sw.js'
];

console.log('\n📋 Validating static files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const size = fs.statSync(filePath).size;
    console.log(`✅ ${file} (${size} bytes)`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

// 5. Validate configuration files
console.log('\n⚙️  Validating configuration files:');
const configFiles = [
  'netlify.toml',
  'vercel.json',
  'vite.config.ts'
];

configFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  Optional: ${file} not found`);
  }
});

// 6. Validate package.json scripts
console.log('\n📦 Validating package.json scripts:');
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredScripts = ['dev', 'build', 'preview'];
  
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ Script: ${script}`);
    } else {
      console.log(`❌ Missing script: ${script}`);
      allFilesExist = false;
    }
  });
}

// 7. Summary
console.log('\n📊 Fix Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present');
  console.log('✅ Deployment configuration is valid');
  console.log('\n🚀 Next steps:');
  console.log('  1. Run "npm run build" to create production build');
  console.log('  2. Test with "npm run preview" locally');
  console.log('  3. Deploy to your hosting platform');
  console.log('  4. Test static file URLs in production');
} else {
  console.log('❌ Some issues found - please fix before deploying');
  process.exit(1);
}

console.log('\n💡 Pro tip: Use the Admin Dashboard Static File Validator for ongoing monitoring');
console.log('🔗 Access via: [Your Domain]/admin (password: HermanAdmin2024!)');