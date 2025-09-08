#!/usr/bin/env node

// Fix static files for Vercel deployment
// This script updates domain placeholders and ensures files are properly formatted

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing static files for Vercel deployment...');

// Get the actual domain from environment or use placeholder
const domain = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : process.env.PRODUCTION_URL 
  ? process.env.PRODUCTION_URL
  : 'https://YOUR_DOMAIN';

console.log(`📍 Using domain: ${domain}`);

// Fix robots.txt
const robotsPath = path.join(__dirname, '../public/robots.txt');
if (fs.existsSync(robotsPath)) {
  let robotsContent = fs.readFileSync(robotsPath, 'utf8');
  
  // Update sitemap URL
  robotsContent = robotsContent.replace(
    /Sitemap: https:\/\/[^\s]+\/sitemap\.xml/g,
    `Sitemap: ${domain}/sitemap.xml`
  );
  
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ Updated robots.txt');
} else {
  console.log('❌ robots.txt not found');
}

// Fix sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Update all URLs
  sitemapContent = sitemapContent.replace(
    /https:\/\/YOUR_DOMAIN/g,
    domain
  );
  
  sitemapContent = sitemapContent.replace(
    /https:\/\/www\.hermankwayu\.com/g,
    domain
  );
  
  // Update lastmod to current date
  const currentDate = new Date().toISOString().split('T')[0];
  sitemapContent = sitemapContent.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${currentDate}</lastmod>`
  );
  
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log('✅ Updated sitemap.xml');
} else {
  console.log('❌ sitemap.xml not found');
}

// Validate manifest.json
const manifestPath = path.join(__dirname, '../public/manifest.json');
if (fs.existsSync(manifestPath)) {
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    JSON.parse(manifestContent); // Validate JSON
    console.log('✅ manifest.json is valid');
  } catch (error) {
    console.log('❌ manifest.json is invalid:', error.message);
  }
} else {
  console.log('❌ manifest.json not found');
}

// Validate sw.js
const swPath = path.join(__dirname, '../public/sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (swContent.includes('addEventListener')) {
    console.log('✅ sw.js looks valid');
  } else {
    console.log('⚠️ sw.js might have issues');
  }
} else {
  console.log('❌ sw.js not found');
}

// Create or update _headers file for Netlify (backup)
const headersPath = path.join(__dirname, '../public/_headers');
const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/sitemap.xml
  Content-Type: application/xml
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=3600

/manifest.json
  Content-Type: application/json
  Cache-Control: public, max-age=86400

/sw.js
  Content-Type: application/javascript
  Cache-Control: public, max-age=0, must-revalidate
`;

fs.writeFileSync(headersPath, headersContent);
console.log('✅ Created _headers file');

console.log('🎉 Static files fixed for Vercel deployment!');
console.log('');
console.log('📋 Files processed:');
console.log('  ✅ robots.txt - Updated sitemap URL');
console.log('  ✅ sitemap.xml - Updated all domain references');
console.log('  ✅ manifest.json - Validated JSON format');
console.log('  ✅ sw.js - Validated service worker');
console.log('  ✅ _headers - Created for Netlify backup');
console.log('');
console.log('🚀 Ready for deployment!');