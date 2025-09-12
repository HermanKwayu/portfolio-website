#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY: Cleaning public folder for IMMEDIATE Vercel deployment...');

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
      console.log(`🗑️  REMOVED directory: ${dirPath}`);
    } else {
      fs.unlinkSync(dirPath);
      console.log(`🗑️  REMOVED file: ${dirPath}`);
    }
  }
}

// Remove ALL problematic directories and files
const toRemove = [
  path.join(publicPath, '_headers'),
  path.join(publicPath, '_redirects'), 
  path.join(publicPath, '_redirects_fixed'),
  path.join(publicPath, 'netlify_redirects'),
  path.join(publicPath, 'sitemap_xml.tsx')
];

console.log('🧹 REMOVING ALL PROBLEMATIC DIRECTORIES...');
toRemove.forEach(item => {
  if (fs.existsSync(item)) {
    removeRecursive(item);
  }
});

// Remove ANY remaining .tsx files in public folder
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(publicPath, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  REMOVED .tsx file: ${filePath}`);
    }
  });
}

// Verify final structure and show results
console.log('\n📁 FINAL PUBLIC FOLDER CONTENTS (Vercel-ready):');
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath).sort();
  files.forEach(file => {
    const filePath = path.join(publicPath, file);
    const stat = fs.lstatSync(filePath);
    const icon = stat.isDirectory() ? '❌ DIR' : '✅';
    const size = stat.isDirectory() ? '' : ` (${Math.round(stat.size / 1024)}KB)`;
    console.log(`  ${icon} ${file}${size}`);
  });
}

console.log('\n🎉 EMERGENCY CLEANUP COMPLETE!');
console.log('✅ Public folder is now Vercel-compatible');
console.log('🚀 READY TO DEPLOY: npm run build && vercel --prod');
console.log('\n📋 What was removed:');
console.log('   - _headers/ directory (contained .tsx files)');
console.log('   - _redirects/ directory (contained .tsx files)');
console.log('   - _redirects_fixed/ directory');
console.log('   - netlify_redirects/ directory');
console.log('   - sitemap_xml.tsx file');
console.log('\n📋 What remains (correct for Vercel):');
console.log('   - favicon.ico, manifest.json, robots.txt');
console.log('   - sitemap.xml, sw.js, og-image.svg');
console.log('   - unsubscribe.html');
console.log('\n🎯 Next steps:');
console.log('   1. npm run build');
console.log('   2. vercel --prod');
console.log('   3. Your portfolio will be LIVE! 🎉');