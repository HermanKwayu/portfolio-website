# Netlify redirects and rewrite rules

# Serve static files directly
/robots.txt  /robots.txt  200
/sitemap.xml  /sitemap.xml  200
/manifest.json  /manifest.json  200
/sw.js  /sw.js  200

# SPA fallback - serve index.html for all non-static routes
/*  /index.html  200