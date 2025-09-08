# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Your application requires the following environment variables to be configured in your hosting platform:

#### **Required Variables:**
```bash
SUPABASE_URL=https://ugyhqxxevikymkhmaqir.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWhxeHhldmlreW1raG1hcWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MjMyODgsImV4cCI6MjA3MjE5OTI4OH0.lxYDtyqYPbaAreFP_niJyoxhRaAjeXjcVDwCEEKKJUA
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_DB_URL=your_database_connection_string
RESEND_API_KEY=your_resend_api_key
ADMIN_SESSION_SECRET=your_secure_random_session_secret
NODE_ENV=production
VITE_APP_ENV=production
```

#### **Optional Variables (if using these services):**
```bash
DPO_COMPANY_TOKEN=your_dpo_token
DPO_SERVICE_TYPE=your_dpo_service_type
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_id
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

### 2. Supabase Configuration

#### **Database Setup:**
Your app uses a key-value store table that should already exist. If not, ensure the following table exists:
- Table: `kv_store_4d80a1b0`
- Columns: `key` (text), `value` (jsonb), `created_at` (timestamp)

#### **Edge Functions:**
Ensure your Supabase edge function is deployed at:
- Function name: `make-server-4d80a1b0`
- URL: `https://ugyhqxxevikymkhmaqir.supabase.co/functions/v1/make-server-4d80a1b0`

#### **Storage Buckets:**
The following buckets will be created automatically by your server:
- `make-4d80a1b0-files` (for file uploads)
- `make-4d80a1b0-assets` (for assets)

### 3. Domain Configuration
Update the following with your actual production domain:
- `.env` file: `VITE_APP_URL=https://your-domain.com`
- Supabase Auth Settings: Add your domain to allowed redirect URLs
- CORS settings in Supabase: Add your domain to allowed origins

## Deployment Options

### Option 1: Netlify Deployment (Recommended)

1. **Connect Repository:**
   ```bash
   # Push your code to GitHub/GitLab
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Netlify Configuration:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Environment Variables:**
   Add all required environment variables in Netlify Dashboard > Site Settings > Environment Variables

4. **Custom Domain:**
   - Configure your custom domain in Netlify
   - SSL will be automatically provisioned

### Option 2: Vercel Deployment

1. **Connect Repository:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Vercel Configuration:**
   - Framework: React
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables:**
   Add all required environment variables in Vercel Dashboard > Settings > Environment Variables

### Option 3: Manual Build & Deploy

1. **Build the Application:**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider (AWS S3, DigitalOcean, etc.)

## Post-Deployment Verification

### 1. Check Core Functionality:
- [ ] Homepage loads correctly
- [ ] Resume Builder works
- [ ] Contact form submits successfully
- [ ] Newsletter signup works
- [ ] Admin dashboard accessible
- [ ] All routing works (resume-builder, unsubscribe, admin)

### 2. Check Analytics:
- [ ] Analytics tracking is working
- [ ] Performance monitoring is active
- [ ] SEO metadata is correctly rendered

### 3. Check Mobile Responsiveness:
- [ ] All pages work on mobile devices
- [ ] Touch interactions work properly
- [ ] Forms are mobile-friendly

### 4. Security Checks:
- [ ] HTTPS is enforced
- [ ] Security headers are present
- [ ] Admin dashboard requires authentication
- [ ] Environment variables are secure

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (use Node 18+)
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run build`

2. **Environment Variable Issues:**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Restart deployment after adding variables

3. **Supabase Connection Issues:**
   - Verify Supabase URL and keys
   - Check if edge functions are deployed
   - Ensure database tables exist

4. **Routing Issues:**
   - Ensure redirects are configured correctly
   - Check that SPA routing is enabled on your hosting platform

### Performance Optimization:

1. **Enable Gzip/Brotli compression** on your hosting platform
2. **Configure CDN** for static assets
3. **Enable browser caching** with appropriate headers
4. **Monitor Core Web Vitals** with the built-in performance monitoring

## Maintenance

### Regular Tasks:
- [ ] Monitor error logs weekly
- [ ] Update dependencies monthly
- [ ] Backup Supabase database regularly
- [ ] Review analytics and performance metrics
- [ ] Update SSL certificates (if manual)

### Security Updates:
- [ ] Rotate API keys every 6 months
- [ ] Update admin session secrets regularly
- [ ] Review and update security headers
- [ ] Monitor for vulnerabilities in dependencies

## Support

For deployment issues:
1. Check the browser console for JavaScript errors
2. Review build logs for compilation errors
3. Verify all environment variables are correctly set
4. Test locally with production build: `npm run build && npm run preview`

Contact: truthherman@gmail.com for technical support.