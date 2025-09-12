#!/bin/bash

echo "🚀 HERMAN KWAYU PORTFOLIO - Git Preparation Script"
echo "=" | head -c 60 && echo

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 CLEANING PROJECT FOR GIT COMMIT...${NC}\n"

# Run the local dev setup to clean files
echo -e "${YELLOW}Running local development setup cleanup...${NC}"
node scripts/local-dev-setup.js

echo -e "\n${BLUE}📋 CHECKING PROJECT STATUS...${NC}\n"

# Check if .env.local exists and warn about it
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local found - This will NOT be committed (good!)${NC}"
    echo -e "   Make sure you have your environment variables ready for Vercel deployment"
else
    echo -e "${RED}❌ .env.local not found${NC}"
    echo -e "   Run: cp .env.example .env.local"
    echo -e "   Then add your actual environment variables"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules found - Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules not found - Run: npm install${NC}"
fi

# Check if build works
echo -e "\n${BLUE}🔨 TESTING PRODUCTION BUILD...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Production build successful${NC}"
    
    # Check if dist folder was created
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ dist folder created ($(du -sh dist | cut -f1))${NC}"
        
        # Clean up build folder for commit
        rm -rf dist
        echo -e "${BLUE}🧹 Cleaned dist folder for git commit${NC}"
    fi
else
    echo -e "${RED}❌ Production build failed${NC}"
    echo -e "   Fix build errors before committing"
    exit 1
fi

echo -e "\n${BLUE}📁 FINAL PROJECT STRUCTURE:${NC}\n"

# Show public folder contents
echo -e "${YELLOW}Public folder (should only contain static files):${NC}"
ls -la public/ | while read line; do
    if [[ $line == *".tsx"* ]]; then
        echo -e "${RED}❌ $line${NC}"
    else
        echo -e "${GREEN}✅ $line${NC}"
    fi
done

echo -e "\n${BLUE}🎯 READY FOR GIT COMMIT!${NC}\n"

echo -e "${GREEN}Your Herman Kwayu Portfolio includes:${NC}"
echo -e "✅ Responsive portfolio website with deep slate blue theme"
echo -e "✅ Admin dashboard with secure session-based authentication"
echo -e "✅ Free Resume Builder with 4 professional templates"
echo -e "✅ Newsletter system with Resend API integration"
echo -e "✅ Contact form with Supabase backend"
echo -e "✅ SEO optimized with proper meta tags and sitemaps"
echo -e "✅ PWA capabilities with offline support"
echo -e "✅ Analytics tracking with SafeAnalytics wrapper"

echo -e "\n${BLUE}🚀 NEXT STEPS:${NC}\n"
echo -e "1. ${YELLOW}git add .${NC}"
echo -e "2. ${YELLOW}git commit -m \"🚀 Production-ready Herman Kwayu Portfolio with admin dashboard, resume builder, and comprehensive features\"${NC}"
echo -e "3. ${YELLOW}git push origin main${NC}"
echo -e "4. ${YELLOW}vercel --prod${NC}"

echo -e "\n${GREEN}🎉 Your professional portfolio is ready for deployment!${NC}"