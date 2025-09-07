# Manual Setup Instructions for SPA Redirects

## The Problem
The `_redirects` files became directories with TSX files instead of proper redirect files.

## Quick Fix Steps

### For Netlify Hosting:
1. Delete the `/public/_redirects` directory and all its contents
2. Copy `/public/_redirects.txt` to `/public/_redirects` (remove the .txt extension)

### For Vercel Hosting:
✅ Already configured with `/vercel.json`

### For Apache Servers:
✅ Already configured with `/public/.htaccess`

### For Other Static Hosts:
Use the content from `/public/_redirects.txt`

## Command Line Fix (if you have access):
```bash
# Remove the problematic directories
rm -rf /public/_redirects
rm -rf /public/_redirects_fixed  
rm -rf /public/netlify_redirects

# Copy the correct redirect file
cp /public/_redirects.txt /public/_redirects
```

## File Content to Use:
```
# Handle SPA routing - redirect all non-file requests to index.html
/*    /index.html   200
```

## Verify It's Working:
After fixing, test these URLs:
- `https://hermankwayu.com/unsubscribe?email=test@example.com`
- `https://hermankwayu.com/some-non-existent-route`

Both should show your React app instead of 404 errors.