# Netlify redirects file
# Static files should be served directly
/sitemap.xml     /sitemap.xml     200
/robots.txt      /robots.txt      200
/manifest.json   /manifest.json   200
/sw.js           /sw.js           200

# SPA routes should serve index.html
/resume-builder  /index.html      200
/unsubscribe     /index.html      200
/admin          /index.html      200

# Catch-all for SPA
/*              /index.html      200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://*.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co https://api.unsplash.com; frame-src 'none';