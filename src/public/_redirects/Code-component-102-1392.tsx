# Static files should be served directly
/sitemap.xml   /sitemap.xml   200
/robots.txt    /robots.txt    200
/manifest.json /manifest.json 200
/sw.js         /sw.js         200

# API routes
/api/*   /.netlify/functions/:splat   200

# Resume builder page
/resume-builder  /index.html  200

# Unsubscribe page
/unsubscribe     /index.html  200

# Handle specific routes for SPA
/admin           /index.html  200

# Catch-all: serve index.html for all other routes (SPA)
/*               /index.html  200