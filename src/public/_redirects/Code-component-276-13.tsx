# Netlify redirects - also works with Vercel
/admin /admin 200
/resume-builder /resume-builder 200
/unsubscribe /unsubscribe 200
/privacy-policy /privacy-policy 200
/terms-of-service /terms-of-service 200

# Old URLs redirect to new ones
/resume /resume-builder 301
/cv-builder /resume-builder 301
/privacy /privacy-policy 301
/terms /terms-of-service 301

# Handle trailing slashes
/admin/ /admin 301
/resume-builder/ /resume-builder 301
/unsubscribe/ /unsubscribe 301
/privacy-policy/ /privacy-policy 301
/terms-of-service/ /terms-of-service 301

# Fallback for SPA
/* / 200