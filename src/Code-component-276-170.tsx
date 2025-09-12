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

# Install dependencies
npm install

# Clean the public folder (CRITICAL for deployment)
npm run emergency:clean
```

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Create environment file
cp .env.example .env.local
```

Add your environment variables to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESEND_API_KEY=your_resend_api_key
```

### Step 3: Run Locally

```bash
# Start development server
npm run dev
```

Your site will be available at: `http://localhost:5173`

### Step 4: Test All Features

Test these key features locally:
- ✅ **Home page** loads correctly
- ✅ **Contact form** submission works
- ✅ **Newsletter signup** works
- ✅ **Admin dashboard** at `/admin` 
- ✅ **Resume Builder** at `/resume-builder`
- ✅ **PWA** installation works
- ✅ **Dark mode** toggle works
- ✅ **Mobile responsiveness**

## 🔧 Production Build Test

Before deploying, test the production build locally:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Test at: `http://localhost:4173`

## 🚀 Git and Vercel Deployment

### Step 1: Clean Public Folder

```bash
# CRITICAL: Clean public folder before committing
npm run emergency:clean
```

### Step 2: Commit to Git

```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "🚀 Production-ready Herman Kwayu Portfolio

✅ Responsive portfolio website with deep slate blue theme
✅ Admin dashboard with secure session-based auth  
✅ Free Resume Builder with 4 professional templates
✅ Newsletter system with Resend API integration
✅ Contact form with Supabase backend
✅ SEO optimized with proper meta tags and sitemaps
✅ PWA capabilities with offline support
✅ Analytics tracking with SafeAnalytics wrapper
✅ All routes working: /admin, /resume-builder, etc.
✅ Public folder cleaned for Vercel deployment"

# Push to your repository
git push origin main
```

### Step 3: Deploy to Vercel

```bash
# Login to Vercel (if not already logged in)
vercel login

# Deploy to production
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Choose your account
- **Link to existing project**: No (or Yes if updating)
- **Project name**: `herman-kwayu-portfolio` (or your preferred name)
- **Directory**: `./` (current directory)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)
- **Development Command**: `npm run dev` (should auto-detect)

### Step 4: Configure Environment Variables in Vercel

After deployment, add environment variables in Vercel dashboard:

1. Go to: `https://vercel.com/dashboard`
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key  
VITE_RESEND_API_KEY = your_resend_api_key
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

### Public Folder Issues
If deployment fails with "unexpected token" errors:
```bash
npm run emergency:clean
npm run build
vercel --prod
```

### Environment Variable Issues
- Ensure all variables are prefixed with `VITE_`
- Check Vercel dashboard for proper variable names
- Redeploy after adding variables

### Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Network/API Issues
- Check Supabase project is active
- Verify API keys are correct
- Test API endpoints locally first

## 📱 Post-Deployment Testing

After deployment, test:

1. **Core functionality**:
   - Contact form submissions
   - Newsletter signups
   - Admin login

2. **Performance**:
   - Page load speeds
   - Mobile responsiveness
   - PWA installation

3. **SEO**:
   - Check `/sitemap.xml`
   - Verify `/robots.txt`
   - Test social sharing

4. **Analytics**:
   - Verify tracking works
   - Check admin analytics dashboard

## 🎉 Success Metrics

Your portfolio includes:

### 🌟 **Core Features**
- ✅ **Professional Herman Kwayu branding**
- ✅ **Responsive design** with deep slate blue theme
- ✅ **Contact form** with Supabase backend
- ✅ **Newsletter system** with Resend API
- ✅ **Dark mode support** with system preferences

### 🔧 **Advanced Features**
- ✅ **Admin Dashboard** with session-based auth (4-hour expiry)
- ✅ **Resume Builder** with 4 professional templates (completely free)
- ✅ **PWA capabilities** with service worker and offline support
- ✅ **SEO optimized** with sitemap, robots.txt, schema markup
- ✅ **Analytics tracking** with SafeAnalytics wrapper

### 📊 **Professional Sections**
- ✅ **Hero section** with availability status
- ✅ **About section** showcasing Airtel Africa, Ramani.io experience
- ✅ **Services section** with consulting offerings
- ✅ **Portfolio showcase** with project highlights
- ✅ **Professional expertise** highlighting 6+ years experience

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional):
   - Add your custom domain in Vercel dashboard
   - Update DNS settings

2. **Analytics Setup**:
   - Monitor user engagement
   - Track form submissions
   - Analyze portfolio views

3. **Content Updates**:
   - Add more portfolio projects
   - Update professional experience
   - Add client testimonials

4. **SEO Optimization**:
   - Submit sitemap to Google Search Console
   - Monitor search rankings
   - Optimize for local Tanzania searches

---

**🚀 Ready to deploy your professional portfolio? Follow these steps and you'll be live in under 30 minutes!**