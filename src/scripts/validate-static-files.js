#!/usr/bin/env node

/**
 * Static Files Validation Script
 * Validates that all required static files are present and accessible
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  { path: 'public/sitemap.xml', type: 'XML Sitemap' },
  { path: 'public/robots.txt', type: 'Robots.txt' },
  { path: 'public/manifest.json', type: 'Web Manifest' },
  { path: 'public/sw.js', type: 'Service Worker' },
  { path: 'public/_redirects', type: 'Netlify Redirects' }
];

const DEPLOYMENT_CONFIGS = [
  { path: 'vercel.json', type: 'Vercel Config' },
  { path: 'netlify.toml', type: 'Netlify Config' }
];

console.log('🔍 Validating Static Files and Deployment Configuration...\n');

let hasErrors = false;

// Check required static files
console.log('📁 Checking Static Files:');
REQUIRED_FILES.forEach(file => {
  const fullPath = path.join(process.cwd(), file.path);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const size = stats.size;
    console.log(`✅ ${file.type}: ${file.path} (${size} bytes)`);
    
    // Basic content validation
    if (file.path.includes('sitemap.xml')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('<?xml') || !content.includes('urlset')) {
        console.log(`❌ Warning: ${file.type} appears to have invalid XML structure`);
        hasErrors = true;
      }
    }
    
    if (file.path.includes('robots.txt')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('User-agent:')) {
        console.log(`❌ Warning: ${file.type} appears to be missing User-agent directives`);
        hasErrors = true;
      }
    }
    
    if (file.path.includes('manifest.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        JSON.parse(content);
      } catch (e) {
        console.log(`❌ Warning: ${file.type} contains invalid JSON`);
        hasErrors = true;
      }
    }
  } else {
    console.log(`❌ Missing: ${file.type} at ${file.path}`);
    hasErrors = true;
  }
});

console.log('\n⚙️  Checking Deployment Configurations:');
DEPLOYMENT_CONFIGS.forEach(config => {
  const fullPath = path.join(process.cwd(), config.path);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const size = stats.size;
    console.log(`✅ ${config.type}: ${config.path} (${size} bytes)`);
  } else {
    console.log(`⚠️  Optional: ${config.type} not found at ${config.path}`);
  }
});

// Check build output if it exists
console.log('\n📦 Checking Build Output:');
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Build directory exists: dist/');
  
  // Check if static files are copied correctly
  REQUIRED_FILES.forEach(file => {
    const staticPath = file.path.replace('public/', '');
    const builtPath = path.join(distPath, staticPath);
    if (fs.existsSync(builtPath)) {
      console.log(`✅ Built file exists: dist/${staticPath}`);
    } else {
      console.log(`❌ Built file missing: dist/${staticPath}`);
      hasErrors = true;
    }
  });
} else {
  console.log('⚠️  Build directory not found. Run "npm run build" first.');
}

// Summary
console.log('\n📊 Validation Summary:');
if (hasErrors) {
  console.log('❌ Validation failed! Please fix the issues above.');
  process.exit(1);
} else {
  console.log('✅ All static files and configurations are valid!');
  console.log('\n🚀 Ready for deployment. Next steps:');
  console.log('  1. Run "npm run build" to create production build');
  console.log('  2. Test with "npm run preview" locally');
  console.log('  3. Deploy to your hosting platform');
  console.log('  4. Test static file URLs in production');
}

// Additional tips
console.log('\n💡 Testing URLs after deployment:');
console.log('  • https://your-domain.com/sitemap.xml');
console.log('  • https://your-domain.com/robots.txt');
console.log('  • https://your-domain.com/manifest.json');
console.log('\n🔧 Use the Admin Dashboard Static File Validator for ongoing monitoring.');