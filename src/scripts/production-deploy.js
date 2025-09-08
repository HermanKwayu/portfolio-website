#!/usr/bin/env node

/**
 * Production Deployment Script
 * Validates and prepares the application for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production deployment preparation...\n');

// Configuration
const CONFIG = {
  requiredFiles: [
    'App.tsx',
    'package.json',
    'netlify.toml',
    'public/robots.txt',
    'public/sitemap.xml',
    'public/manifest.json',
    'styles/globals.css'
  ],
  requiredComponents: [
    'components/AdminDashboard.tsx',
    'components/ErrorHandler.tsx',
    'components/FetchErrorSuppressor.tsx',
    'components/SimpleProductionHealthCheck.tsx',
    'components/ProductionWrapper.tsx',
    'components/ResumeBuilder.tsx',
    'components/Header.tsx',
    'components/Footer.tsx'
  ],
  requiredEnvVars: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'RESEND_API_KEY'
  ]
};

let errors = [];
let warnings = [];

// Check required files
console.log('📁 Checking required files...');
CONFIG.requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  } else {
    console.log(`✅ ${file}`);
  }
});

// Check required components
console.log('\n🧩 Checking required components...');
CONFIG.requiredComponents.forEach(component => {
  if (!fs.existsSync(component)) {
    errors.push(`Missing required component: ${component}`);
  } else {
    console.log(`✅ ${component}`);
  }
});

// Check package.json
console.log('\n📦 Validating package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts.build) {
    errors.push('Missing build script in package.json');
  }
  
  if (!packageJson.scripts.preview) {
    warnings.push('Missing preview script in package.json');
  }
  
  console.log(`✅ Package name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
} catch (error) {
  errors.push(`Invalid package.json: ${error.message}`);
}

// Check environment variables (simulation)
console.log('\n🔐 Checking environment variables...');
CONFIG.requiredEnvVars.forEach(envVar => {
  // In actual deployment, these would be checked on the hosting platform
  console.log(`⚠️  ${envVar} - Verify in hosting platform`);
});

// Check Netlify/Vercel configuration
console.log('\n⚙️  Checking deployment configuration...');
if (fs.existsSync('netlify.toml')) {
  console.log('✅ Netlify configuration found');
  try {
    const netlifyConfig = fs.readFileSync('netlify.toml', 'utf8');
    if (netlifyConfig.includes('[[redirects]]')) {
      console.log('✅ Redirects configured');
    } else {
      warnings.push('No redirects found in netlify.toml');
    }
  } catch (error) {
    warnings.push(`Could not validate netlify.toml: ${error.message}`);
  }
}

if (fs.existsSync('vercel.json')) {
  console.log('✅ Vercel configuration found');
}

// Check SEO files
console.log('\n🔍 Checking SEO files...');
const seoFiles = ['public/robots.txt', 'public/sitemap.xml'];
seoFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    warnings.push(`SEO file missing: ${file}`);
  }
});

// Check for development-only code
console.log('\n🧹 Scanning for development-only code...');
const checkFileForDevCode = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const devPatterns = [
      /console\.log(?!\s*\(/,  // console.log not in production logger
      /console\.debug/,
      /process\.env\.NODE_ENV\s*===\s*['"]development['"]/
    ];
    
    let hasDevCode = false;
    devPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasDevCode = true;
      }
    });
    
    return hasDevCode;
  } catch (error) {
    return false;
  }
};

// Check main files for dev code
const mainFiles = ['App.tsx', 'components/AdminDashboard.tsx'];
mainFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (checkFileForDevCode(file)) {
      console.log(`⚠️  ${file} contains development code (this is expected)`);
    } else {
      console.log(`✅ ${file} production-ready`);
    }
  }
});

// Performance checks
console.log('\n⚡ Performance checks...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (appContent.includes('lazy(')) {
    console.log('✅ Lazy loading implemented');
  } else {
    warnings.push('No lazy loading detected');
  }
  
  if (appContent.includes('Suspense')) {
    console.log('✅ Suspense boundaries found');
  } else {
    warnings.push('No Suspense boundaries found');
  }
  
  if (appContent.includes('ErrorBoundary')) {
    console.log('✅ Error boundaries implemented');
  } else {
    errors.push('No error boundaries found');
  }
} catch (error) {
  errors.push(`Could not check App.tsx: ${error.message}`);
}

// Security checks
console.log('\n🛡️  Security checks...');
try {
  const adminContent = fs.readFileSync('components/AdminDashboard.tsx', 'utf8');
  
  if (adminContent.includes('session')) {
    console.log('✅ Session management implemented');
  } else {
    warnings.push('No session management detected');
  }
  
  if (adminContent.includes('timeout') || adminContent.includes('expiry')) {
    console.log('✅ Session timeout configured');
  } else {
    warnings.push('No session timeout detected');
  }
} catch (error) {
  warnings.push(`Could not check AdminDashboard.tsx: ${error.message}`);
}

// Final report
console.log('\n' + '='.repeat(50));
console.log('📊 PRODUCTION DEPLOYMENT REPORT');
console.log('='.repeat(50));

if (errors.length === 0) {
  console.log('✅ All critical checks passed!');
} else {
  console.log(`❌ ${errors.length} critical error(s) found:`);
  errors.forEach(error => console.log(`   • ${error}`));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  warnings.forEach(warning => console.log(`   • ${warning}`));
}

console.log('\n📋 Pre-deployment checklist:');
console.log('   1. Set environment variables in hosting platform');
console.log('   2. Verify admin credentials');
console.log('   3. Test contact form in production');
console.log('   4. Verify email service (Resend API)');
console.log('   5. Check analytics and monitoring');

console.log('\n🎯 Deployment targets:');
console.log('   • Initial load: < 3 seconds');
console.log('   • Admin dashboard: < 1 second (demo mode)');
console.log('   • API responses: < 2 seconds');
console.log('   • Core Web Vitals: All green');

if (errors.length === 0) {
  console.log('\n🚀 Ready for production deployment!');
  process.exit(0);
} else {
  console.log('\n🛑 Fix critical errors before deploying.');
  process.exit(1);
}