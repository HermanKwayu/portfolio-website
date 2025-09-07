import { useEffect } from 'react';

export function SitemapGenerator() {
  useEffect(() => {
    // Generate and inject sitemap data for better SEO
    const generateSitemap = () => {
      const baseUrl = 'https://www.hermankwayu.com';
      const currentDate = new Date().toISOString().split('T')[0];
      
      const pages = [
        {
          url: baseUrl,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '1.0',
          title: 'Home - Herman Kwayu Consulting',
          description: 'Strategic Business Consultant & Digital Transformation Expert'
        },
        {
          url: `${baseUrl}#about`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.8',
          title: 'About Herman Kwayu',
          description: 'Learn about Herman Kwayu\'s professional background and expertise'
        },
        {
          url: `${baseUrl}#services`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.9',
          title: 'Business Consulting Services',
          description: 'Comprehensive business consulting and digital transformation services'
        },
        {
          url: `${baseUrl}#contact`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.7',
          title: 'Contact Herman Kwayu',
          description: 'Get in touch for business consulting and strategic planning services'
        },
        {
          url: `${baseUrl}/unsubscribe`,
          lastmod: currentDate,
          changefreq: 'yearly',
          priority: '0.3',
          title: 'Newsletter Unsubscribe',
          description: 'Unsubscribe from Herman Kwayu newsletter'
        }
      ];

      // Generate XML sitemap content
      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>https://www.hermankwayu.com/og-image.jpg</image:loc>
      <image:title>${page.title}</image:title>
      <image:caption>${page.description}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

      // Generate robots.txt content
      const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
Disallow: /_redirects

# Specific bot instructions
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: LinkedInBot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Additional URLs for indexing
Allow: /#about
Allow: /#services
Allow: /#contact`;

      // Store sitemap data in localStorage for potential server-side generation
      localStorage.setItem('sitemap-xml', sitemapXml);
      localStorage.setItem('robots-txt', robotsTxt);
      
      // Add sitemap link to head if not exists
      if (!document.querySelector('link[rel="sitemap"]')) {
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.href = `${baseUrl}/sitemap.xml`;
        document.head.appendChild(sitemapLink);
      }

      // Add additional SEO hints
      const additionalMeta = [
        { name: 'google-site-verification', content: 'GOOGLE_VERIFICATION_CODE_HERE' },
        { name: 'msvalidate.01', content: 'BING_VERIFICATION_CODE_HERE' },
        { name: 'yandex-verification', content: 'YANDEX_VERIFICATION_CODE_HERE' },
        { name: 'p:domain_verify', content: 'PINTEREST_VERIFICATION_CODE_HERE' }
      ];

      additionalMeta.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`) && !content.includes('_HERE')) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });
    };

    generateSitemap();
  }, []);

  return null;
}