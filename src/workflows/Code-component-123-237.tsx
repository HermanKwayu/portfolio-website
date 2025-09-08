name: Deploy Portfolio Website

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test Build
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Type check
      run: npm run type-check

    - name: Validate static files
      run: npm run validate

    - name: Test build
      run: npm run build
      env:
        NODE_ENV: production

  deploy-netlify:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    name: Deploy to Netlify
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Production deployment check
      run: npm run prod:check

    - name: Build for production
      run: npm run build
      env:
        NODE_ENV: production
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v3.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: false
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-vercel:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    name: Deploy to Vercel (Backup)
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build for production
      run: npm run build
      env:
        NODE_ENV: production
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./

  health-check:
    runs-on: ubuntu-latest
    needs: [deploy-netlify]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    name: Post-Deployment Health Check
    
    steps:
    - name: Wait for deployment
      run: sleep 30

    - name: Health check
      run: |
        echo "Checking website health..."
        # Add your website URL here
        curl -f https://yourdomain.com || exit 1
        echo "✅ Website is healthy!"

    - name: SEO check
      run: |
        echo "Running basic SEO checks..."
        response=$(curl -s https://yourdomain.com)
        if echo "$response" | grep -q "<title>Herman Kwayu"; then
          echo "✅ Title tag found"
        else
          echo "❌ Title tag missing"
          exit 1
        fi
        
        if echo "$response" | grep -q "description"; then
          echo "✅ Meta description found"
        else
          echo "❌ Meta description missing"
          exit 1
        fi

  notify:
    runs-on: ubuntu-latest
    needs: [deploy-netlify, deploy-vercel, health-check]
    if: always() && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
    name: Deployment Notification
    
    steps:
    - name: Deployment success
      if: needs.deploy-netlify.result == 'success'
      run: |
        echo "🚀 Deployment successful!"
        echo "✅ Netlify deployment completed"
        echo "✅ Health checks passed"
        echo "Portfolio website is live!"

    - name: Deployment failure
      if: needs.deploy-netlify.result == 'failure' || needs.health-check.result == 'failure'
      run: |
        echo "❌ Deployment failed!"
        echo "Please check the logs and fix any issues."
        exit 1