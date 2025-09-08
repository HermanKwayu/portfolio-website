# ⚡ Quick Deploy to GitHub

The fastest way to get your Herman Kwayu Portfolio live on GitHub Pages, Netlify, or Vercel.

## 🚀 One-Command Deploy

```bash
# Make the script executable and run
chmod +x scripts/github-deploy.sh
./scripts/github-deploy.sh
```

This script will:
- ✅ Validate your project structure
- ✅ Run TypeScript checks
- ✅ Test the production build
- ✅ Create Git repository (if needed)
- ✅ Add GitHub remote
- ✅ Commit with comprehensive message
- ✅ Push to GitHub
- ✅ Provide next steps guidance

## 📋 Pre-Requirements

Before running the deploy script, make sure you have:

### 1. 🔧 Development Environment
```bash
# Check Node.js version (18+ required)
node --version

# Check npm version
npm --version

# Install dependencies
npm install
```

### 2. 🔐 GitHub Account
- Create a GitHub repository
- Have the repository URL ready
- Ensure you're logged into Git:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

### 3. 🌐 Hosting Accounts (Choose one or both)

#### Option A: Netlify (Recommended)
- Create account at [netlify.com](https://netlify.com)
- Generate Personal Access Token
- Note down your site ID after connecting

#### Option B: Vercel (Alternative)
- Create account at [vercel.com](https://vercel.com)
- Generate deployment token
- Note down org ID and project ID

### 4. 🔑 API Keys Ready
- **Supabase**: Project URL + Anon Key
- **Resend**: API Key (for newsletters)
- **Admin**: Session secret (generate random string)

## 🎯 After Deployment

### 1. Configure GitHub Secrets
Go to your repository settings and add these secrets:

```bash
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For Netlify
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id

# For Vercel (optional)
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_org_id
PROJECT_ID=your_project_id
```

### 2. Watch Automatic Deployment
- GitHub Actions will automatically build and deploy
- Check the Actions tab in your repository
- Monitor deployment progress

### 3. Configure Custom Domain (Optional)
- Add your domain in Netlify/Vercel dashboard
- Update DNS settings
- Enable SSL certificates

## 🔧 Manual Alternative

If you prefer manual setup:

```bash
# 1. Initialize Git
git init
git remote add origin https://github.com/username/repo.git

# 2. Run checks
npm run type-check
npm run validate
npm run build

# 3. Commit and push
git add .
git commit -m "🚀 Initial deployment"
git push -u origin main
```

## 🐛 Troubleshooting

### Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Validate static files
npm run validate

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Git Issues
```bash
# Reset to clean state
git reset --hard HEAD
git clean -fd

# Re-add files
git add .
git commit -m "Fresh deployment"
```

### Environment Issues
```bash
# Copy example environment
cp .env.example .env.local

# Edit with your actual values
nano .env.local
```

## 🎉 Success Indicators

You'll know deployment succeeded when:
- ✅ GitHub Actions shows green checkmarks
- ✅ Netlify/Vercel shows successful deployment
- ✅ Website loads at your domain
- ✅ Resume Builder works (test PDF generation)
- ✅ Contact form submits successfully
- ✅ Admin dashboard accessible

## 📞 Need Help?

If you encounter issues:

1. **Check the logs**: GitHub Actions tab in your repo
2. **Verify secrets**: All environment variables set correctly
3. **Test locally**: `npm run dev` should work first
4. **Review docs**: [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)

---

**🚀 Ready to launch your professional portfolio in under 5 minutes!**

Your Herman Kwayu Portfolio & Consulting Website includes:
- 📊 Professional business showcase
- 📄 Free Resume Builder (4 templates)
- 📧 Newsletter management system
- 🔐 Secure admin dashboard
- 📈 Built-in analytics
- 🎨 Modern responsive design
- ⚡ Lightning-fast performance