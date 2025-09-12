#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 HERMAN KWAYU PORTFOLIO - Local Development Setup');
console.log('='.repeat(60));

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
      console.log(`🗑️  Removed directory: ${path.relative(process.cwd(), dirPath)}`);
    } else {
      fs.unlinkSync(dirPath);
      console.log(`🗑️  Removed file: ${path.relative(process.cwd(), dirPath)}`);
    }
  }
}

console.log('\n🧹 CLEANING PUBLIC FOLDER FOR LOCAL DEVELOPMENT...\n');

// Remove ALL problematic directories and files
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

// Remove ANY remaining .tsx files in public folder
if (fs.existsSync(publicPath)) {
  const files = fs.readdirSync(publicPath);
  files.forEach(file => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(publicPath, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed .tsx file: ${path.relative(process.cwd(), filePath)}`);
    }
  });
}

// Also clean up root-level files that shouldn't be there
const rootCleanup = [
  'Herman_Kwayu_Signature_svg.tsx',
  'MobileScanner.tsx',
  'production.config.tsx'
];

console.log('\n🧹 CLEANING ROOT DIRECTORY...\n');

rootCleanup.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Removed root file: ${file}`);
  }
});

// Clean up deleted text files
console.log('\n🧹 CLEANING DELETED TEXT FILES...\n');

const deleteTextFiles = [
  'MobileScanner_DELETED.txt',
  'components/DigitalSignature_DELETED.txt',
  'components/EventAnalytics_DELETED.txt',
  'components/EventDemo_DELETED.txt',
  'components/EventManager_DELETED.txt',
  'components/EventManagerAPI_DELETED.txt',
  'components/InvitationTemplates_DELETED.txt',
  'components/PasswordDiagnostic_DELETED.txt',
  'components/QRScannerApp_DELETED.txt',
  'components/Resume_DELETED.txt'
];

deleteTextFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`🗑️  Removed deleted text file: ${file}`);
  }
});

// Verify final public folder structure
console.log('\n📁 FINAL PUBLIC FOLDER STRUCTURE (Local Dev Ready):\n');
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

console.log('\n🎉 LOCAL DEVELOPMENT SETUP COMPLETE!\n');
console.log('✅ Public folder is now ready for local development and deployment');
console.log('✅ All problematic .tsx files removed');
console.log('✅ Directory structure optimized for Vercel');

console.log('\n🚀 NEXT STEPS:\n');
console.log('1. Run: npm install');
console.log('2. Create: .env.local with your environment variables');
console.log('3. Run: npm run dev');
console.log('4. Test all features locally');
console.log('5. Run: npm run build (to test production build)');
console.log('6. Run: npm run preview (to test production locally)');
console.log('7. Commit and push to git');
console.log('8. Deploy with: vercel --prod');

console.log('\n📋 WHAT WAS REMOVED:\n');
console.log('❌ public/_headers/ directory (contained .tsx files)');
console.log('❌ public/_redirects/ directory (contained .tsx files)');
console.log('❌ public/_redirects_fixed/ directory');
console.log('❌ public/netlify_redirects/ directory');
console.log('❌ public/sitemap_xml.tsx file');
console.log('❌ Root-level .tsx files that should be components');
console.log('❌ *_DELETED.txt files (cleanup)');

console.log('\n📋 WHAT REMAINS (Perfect for Vercel):\n');
console.log('✅ favicon.ico - Site icon');
console.log('✅ manifest.json - PWA manifest');
console.log('✅ robots.txt - SEO crawler instructions');
console.log('✅ sitemap.xml - SEO sitemap');
console.log('✅ sw.js - Service worker for PWA');
console.log('✅ og-image.svg - Social sharing image');
console.log('✅ unsubscribe.html - Static unsubscribe page');

console.log('\n🌟 YOUR PORTFOLIO FEATURES:\n');
console.log('✅ Responsive Herman Kwayu portfolio with deep slate blue theme');
console.log('✅ Admin dashboard with secure session-based authentication');
console.log('✅ Free Resume Builder with 4 professional templates');
console.log('✅ Newsletter system with Resend API integration');
console.log('✅ Contact form with Supabase backend');
console.log('✅ SEO optimized with proper meta tags and sitemaps');
console.log('✅ PWA capabilities with offline support');
console.log('✅ Analytics tracking with SafeAnalytics wrapper');
console.log('✅ Professional sections: Hero, About, Services, Portfolio');

console.log('\n🎯 READY FOR LOCAL DEVELOPMENT AND DEPLOYMENT!');
console.log('📖 See LOCAL_DEVELOPMENT_GUIDE.md for detailed instructions');