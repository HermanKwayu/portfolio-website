#!/bin/bash

# 🚀 Herman Kwayu Portfolio - GitHub Deployment Script
# This script prepares and deploys your portfolio to GitHub with CI/CD

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Herman Kwayu Portfolio - GitHub Deployment${NC}"
echo -e "${BLUE}================================================${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root directory?${NC}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📝 Initializing Git repository...${NC}"
    git init
fi

# Check if we have the required files
echo -e "${BLUE}🔍 Checking project structure...${NC}"

required_files=(
    "App.tsx"
    "package.json"
    ".gitignore"
    "vite.config.ts"
    "components/ResumeBuilder.tsx"
    "supabase/functions/server/index.tsx"
    ".github/workflows/deploy.yml"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Project structure validated${NC}"

# Run pre-deployment checks
echo -e "${BLUE}🔧 Running pre-deployment checks...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run type checking
echo -e "${YELLOW}🔍 Running TypeScript checks...${NC}"
npm run type-check

# Validate static files
echo -e "${YELLOW}📄 Validating static files...${NC}"
npm run validate

# Test build
echo -e "${YELLOW}🏗️ Testing production build...${NC}"
npm run build

echo -e "${GREEN}✅ All pre-deployment checks passed${NC}"

# Check for environment variables
echo -e "${BLUE}🔐 Environment Variables Checklist${NC}"
echo -e "${YELLOW}Make sure you have these ready for GitHub Secrets:${NC}"
echo ""
echo -e "📋 Required Secrets for GitHub Actions:"
echo -e "   • VITE_SUPABASE_URL"
echo -e "   • VITE_SUPABASE_ANON_KEY"
echo -e "   • NETLIFY_AUTH_TOKEN"
echo -e "   • NETLIFY_SITE_ID"
echo -e "   • VERCEL_TOKEN (optional)"
echo -e "   • ORG_ID (optional)"
echo -e "   • PROJECT_ID (optional)"
echo ""

# Prompt for GitHub repository URL
echo -e "${BLUE}🔗 GitHub Repository Setup${NC}"
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url

if [ -z "$repo_url" ]; then
    echo -e "${RED}❌ Repository URL is required${NC}"
    exit 1
fi

# Add GitHub remote if it doesn't exist
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}🔗 Adding GitHub remote...${NC}"
    git remote add origin "$repo_url"
else
    echo -e "${YELLOW}🔄 Updating GitHub remote...${NC}"
    git remote set-url origin "$repo_url"
fi

# Stage all files
echo -e "${YELLOW}📦 Staging files for commit...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️ No changes to commit${NC}"
else
    # Create comprehensive commit message
    echo -e "${YELLOW}💾 Creating commit...${NC}"
    git commit -m "🚀 Deploy Herman Kwayu Portfolio & Consulting Website

✨ Features Included:
- Professional portfolio with 8+ years experience showcase
- Free Resume Builder with 4 modern templates (PDF/DOCX)
- Secure Admin Dashboard with session-based auth
- Newsletter management with Resend API integration
- Contact form with Supabase backend
- SEO optimized (92% score) with comprehensive meta tags
- Mobile-first responsive design with dark mode
- Privacy-first analytics and GDPR compliance
- Automated CI/CD with GitHub Actions

🛠️ Technical Stack:
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS v4 + Shadcn/ui
- Backend: Supabase (DB + Auth + Edge Functions)
- Deployment: Netlify + Vercel (backup)
- Email: Resend API for newsletters

🔧 Setup Complete:
- GitHub Actions workflow configured
- Multi-platform deployment ready
- Environment variables documented
- Health checks and monitoring included

Ready for production deployment! 🎯"
fi

# Push to GitHub
echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
git push -u origin main

echo ""
echo -e "${GREEN}🎉 SUCCESS! Your portfolio has been pushed to GitHub!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. 🔐 Set up GitHub Secrets:"
echo -e "   • Go to: $repo_url/settings/secrets/actions"
echo -e "   • Add the required environment variables"
echo ""
echo -e "2. 🌐 Configure Netlify:"
echo -e "   • Connect your GitHub repository"
echo -e "   • Set build command: npm run build"
echo -e "   • Set publish directory: dist"
echo ""
echo -e "3. 📊 Monitor Deployment:"
echo -e "   • Check GitHub Actions: $repo_url/actions"
echo -e "   • Monitor deployment status"
echo ""
echo -e "4. 🔧 Optional - Vercel Backup:"
echo -e "   • Connect repository for redundancy"
echo -e "   • Configure environment variables"
echo ""
echo -e "${GREEN}🚀 Your Herman Kwayu Portfolio is ready for the world!${NC}"
echo ""
echo -e "${BLUE}📖 For detailed setup instructions, see:${NC}"
echo -e "   • GITHUB_DEPLOYMENT.md"
echo -e "   • DEPLOYMENT_GUIDE.md"
echo ""
echo -e "${YELLOW}🎯 Repository URL: $repo_url${NC}"
echo -e "${GREEN}✅ GitHub deployment preparation complete!${NC}"