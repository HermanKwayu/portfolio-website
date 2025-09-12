# Headers for Vercel deployment
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  
# Cache static assets
/manifest.json
  Cache-Control: public, max-age=31536000
  
/sitemap.xml
  Cache-Control: public, max-age=3600
  
/robots.txt
  Cache-Control: public, max-age=3600
  
/sw.js
  Cache-Control: public, max-age=0

# Security headers for API routes
/admin
  X-Robots-Tag: noindex, nofollow
  
# HTTPS redirect
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload