# Static file headers for proper serving
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600

/robots.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/manifest.json
  Content-Type: application/manifest+json; charset=utf-8
  Cache-Control: public, max-age=86400

/sw.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: public, max-age=0, must-revalidate
  Service-Worker-Allowed: /