#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY: Cleaning public folder for immediate Vercel deployment...');

const publicPath = path.join(process.cwd(), 'public');

// Function to remove directories and files recursively
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

// Remove all problematic directories and files
const toRemove = [
  path.join(publicPath, '_headers'),
  path.join(publicPath, '_redirects'), 
  path.join(publicPath, '_redirects_fixed'),
  path.join(publicPath, 'netlify_redirects'),
  path.join(publicPath, 'sitemap_xml.tsx')
];

console.log('🧹 Removing problematic directories and files...');
toRemove.forEach(item => {
  if (fs.existsSync(item)) {
    removeRecursive(item);
  }
});

// Remove any remaining .tsx files in public folder
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(publicPath, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed .tsx file: ${filePath}`);
    }
  });
}

// Verify final structure
console.log('\n📁 Final public folder contents:');
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    const stat = fs.lstatSync(filePath);
    const icon = stat.isDirectory() ? '📁' : '📄';
    console.log(`  ${icon} ${file}`);
  });
}

console.log('\n✅ Emergency cleanup complete!');
console.log('🚀 Ready for Vercel deployment: npm run build && vercel --prod');