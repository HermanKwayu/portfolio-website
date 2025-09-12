# 🚀 LOCAL DEVELOPMENT & DEPLOYMENT GUIDE

Herman Kwayu Portfolio - Complete Setup and Deployment Instructions

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Vercel CLI** - Install with: `npm install -g vercel`

## 🛠️ Local Development Setup

### Step 1: Download and Setup

```bash
# If you haven't cloned the repository yet:
git clone <your-repo-url>
cd herman-kwayu-portfolio

# CRITICAL: Clean project and install dependencies
npm run local:setup
npm install
```

### Step 2: Environment Variables

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your actual values
# IMPORTANT: Replace ALL "your_*" placeholders with real values
```

**Required environment variables for .env.local:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
ADMIN_SESSION_SECRET=your_secure_32_character_secret
```

### Step 3: Start Local Development

```bash
# Start development server (includes cleanup)
npm run local:dev

# OR step by step:
npm run local:setup  # Clean project
npm run dev          # Start dev server
```

Your site will be available at: `http://localhost:5173`

### Step 4: Test All Features Locally

✅ **Core Features:**
- Home page loads correctly
- Contact form submission works
- Newsletter signup works  
- Dark mode toggle works
- Mobile responsiveness

✅ **Advanced Features:**
- Admin dashboard at `/admin`
- Resume Builder at `/resume-builder`
- PWA installation works
- All routes work properly

## 🔧 Production Build Testing

```bash
# Test production build locally
npm run local:build   # Clean + build
npm run local:preview # Clean + build + preview

# OR step by step:
npm run build
npm run preview
```

Test production build at: `http://localhost:4173`

## 🚀 Git Preparation and Deployment

### Step 1: Prepare for Git

```bash
# Run comprehensive cleanup and validation
chmod +x scripts/prepare-for-git.sh
./scripts/prepare-for-git.sh
```

This script will:
- ✅ Clean all problematic files from public folder
- ✅ Remove .tsx files that break Vercel deployment
- ✅ Test production build
- ✅ Validate project structure
- ✅ Show final file structure

### Step 2: Commit to Git

```bash
# Add all cleaned files
git add .

# Commit with comprehensive message
git commit -m "🚀 Production-ready Herman Kwayu Portfolio

✅ Responsive portfolio website with deep slate blue theme
✅ Admin dashboard with secure session-based auth (4-hour expiry)
✅ Free Resume Builder with 4 professional templates  
✅ Newsletter system with Resend API integration
✅ Contact form with Supabase backend
✅ SEO optimized with proper meta tags and sitemaps
✅ PWA capabilities with offline support
✅ Analytics tracking with SafeAnalytics wrapper
✅ Professional sections: Hero, About, Services, Portfolio
✅ All routes working: /admin, /resume-builder, /privacy, /terms
✅ Public folder cleaned for Vercel deployment
✅ Production build tested and validated"

# Push to repository
git push origin main
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel (if not already)
vercel login

# Deploy to production
vercel --prod
```

**First-time setup prompts:**
- **Set up and deploy**: Yes
- **Which scope**: Choose your account  
- **Link to existing project**: No (unless updating)
- **Project name**: `herman-kwayu-portfolio`
- **Directory**: `./` (current directory)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### Step 4: Configure Vercel Environment Variables

After deployment, add environment variables in Vercel dashboard:

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add these variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key  
RESEND_API_KEY = your_resend_api_key
ADMIN_SESSION_SECRET = your_secure_32_character_secret
```

### Step 5: Redeploy with Environment Variables

```bash
# Redeploy to apply environment variables
vercel --prod
```

## 🎯 Expected Live URLs

After successful deployment:
- **Home**: `https://herman-kwayu-portfolio-xyz.vercel.app/`
- **Admin**: `https://herman-kwayu-portfolio-xyz.vercel.app/admin`
- **Resume Builder**: `https://herman-kwayu-portfolio-xyz.vercel.app/resume-builder`
- **Privacy Policy**: `https://herman-kwayu-portfolio-xyz.vercel.app/privacy-policy`
- **Terms**: `https://herman-kwayu-portfolio-xyz.vercel.app/terms-of-service`

## 🐛 Troubleshooting

### Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Public Folder Issues  
```bash
# If deployment fails with "unexpected token" errors
npm run local:setup
npm run build
vercel --prod
```

### Environment Variable Issues
- Ensure all variables are prefixed with `VITE_` for frontend
- Check Vercel dashboard for correct variable names
- Redeploy after adding variables

## 📱 Post-Deployment Testing

Test these features after deployment:

### 🌟 **Core Functionality**
- ✅ Contact form submissions
- ✅ Newsletter signups  
- ✅ Admin login and dashboard
- ✅ Resume builder templates
- ✅ PWA installation

### 📊 **Performance**
- ✅ Page load speeds
- ✅ Mobile responsiveness
- ✅ SEO meta tags
- ✅ Social sharing

### 🔧 **Technical**
- ✅ All routes work properly
- ✅ Analytics tracking
- ✅ Error handling
- ✅ Security features

## 🎉 Your Portfolio Features

### 🌟 **Professional Branding**
- ✅ **Herman Kwayu** professional identity
- ✅ **Deep slate blue theme** with modern design
- ✅ **Responsive layout** for all devices
- ✅ **Professional sections**: Hero, About, Services, Portfolio

### 🔧 **Advanced Features**
- ✅ **Admin Dashboard** with secure session-based auth (4-hour expiry)
- ✅ **Resume Builder** with 4 professional templates (completely free)
- ✅ **Newsletter system** with Resend API integration
- ✅ **Contact form** with Supabase backend
- ✅ **PWA capabilities** with service worker and offline support

### 📊 **Technical Excellence** 
- ✅ **SEO optimized** with sitemap, robots.txt, schema markup
- ✅ **Analytics tracking** with SafeAnalytics wrapper
- ✅ **Dark mode support** with system preference detection
- ✅ **Performance optimized** with lazy loading and code splitting
- ✅ **Error handling** with comprehensive error boundaries

### 💼 **Professional Sections**
- ✅ **Hero section** with availability status
- ✅ **About section** showcasing Airtel Africa, Ramani.io experience  
- ✅ **Services section** with consulting offerings
- ✅ **Portfolio showcase** with project highlights
- ✅ **Professional expertise** highlighting 6+ years experience

## 🎯 Post-Deployment Optimization

### 1. **Custom Domain** (Optional)
- Add custom domain in Vercel dashboard
- Update DNS settings
- Configure SSL certificate

### 2. **SEO Enhancement**
- Submit sitemap to Google Search Console
- Monitor search rankings
- Optimize for Tanzania local searches

### 3. **Content Updates**
- Add more portfolio projects
- Update professional experience
- Add client testimonials

### 4. **Analytics Monitoring**
- Track user engagement
- Monitor form submissions
- Analyze portfolio performance

---

## ⚡ Quick Start Commands

```bash
# Complete local setup
npm run local:setup && npm install && cp .env.example .env.local

# Start development
npm run dev

# Test production build
npm run build && npm run preview

# Prepare for deployment
./scripts/prepare-for-git.sh

# Deploy to Vercel
git add . && git commit -m "Production deploy" && git push origin main && vercel --prod
```

**🚀 Your professional Herman Kwayu portfolio will be live and fully functional!**