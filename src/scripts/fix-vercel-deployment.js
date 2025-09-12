#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Fixing Vercel deployment structure...');

// Clean up public folder
const publicPath = path.join(process.cwd(), 'public');

function removeRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    if (fs.lstatSync(dirPath).isDirectory()) {
      fs.readdirSync(dirPath).forEach(file => {
        const filePath = path.join(dirPath, file);
        removeRecursive(filePath);
      });
      fs.rmdirSync(dirPath);
      console.log(`🗑️  Removed directory: ${dirPath}`);
    } else {
      fs.unlinkSync(dirPath);
      console.log(`🗑️  Removed file: ${dirPath}`);
    }
  }
}

// Remove problematic directories and files
const toRemove = [
  path.join(publicPath, '_headers'),
  path.join(publicPath, '_redirects'), 
  path.join(publicPath, '_redirects_fixed'),
  path.join(publicPath, 'netlify_redirects'),
  path.join(publicPath, 'sitemap_xml.tsx')
];

toRemove.forEach(item => {
  if (fs.existsSync(item)) {
    removeRecursive(item);
  }
});

// Find and remove any .tsx files in public folder
function findTsxFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath);
    } else if (file.endsWith('.tsx')) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed .tsx file: ${filePath}`);
    }
  });
}

if (fs.existsSync(publicPath)) {
  findTsxFiles(publicPath);
}

// Verify required static files exist
const requiredFiles = [
  'manifest.json',
  'robots.txt', 
  'sitemap.xml',
  'sw.js',
  'unsubscribe.html',
  'og-image.svg',
  'favicon.ico'
];

console.log('\n📋 Verifying required static files:');
let allFilesPresent = true;

requiredFiles.forEach(file => {
  const filePath = path.join(publicPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesPresent = false;
  }
});

// List final public folder structure
console.log('\n📁 Final public folder structure:');
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    const stat = fs.lstatSync(filePath);
    const icon = stat.isDirectory() ? '📁' : '📄';
    console.log(`  ${icon} ${file}`);
  });
}

if (allFilesPresent) {
  console.log('\n🎉 Public folder is ready for Vercel deployment!');
} else {
  console.log('\n⚠️  Some required files are missing. Please check the structure.');
}

// Verify vercel.json exists
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json configuration found');
} else {
  console.log('❌ vercel.json missing - creating basic configuration...');
  
  const vercelConfig = {
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
      { "source": "/admin", "destination": "/index.html" },
      { "source": "/resume-builder", "destination": "/index.html" },
      { "source": "/unsubscribe", "destination": "/index.html" },
      { "source": "/privacy-policy", "destination": "/index.html" },
      { "source": "/terms-of-service", "destination": "/index.html" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  };
  
  fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created basic vercel.json configuration');
}

console.log('\n🚀 Ready for deployment! Use: vercel --prod');