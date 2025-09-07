import { useEffect } from 'react';

export function SEOOptimizer() {
  useEffect(() => {
    // Performance optimizations for better SEO
    const optimizeForSEO = () => {
      // Add preconnect links for faster loading
      const preconnects = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ];

      preconnects.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          if (url.includes('fonts.gstatic.com')) {
            link.crossOrigin = 'anonymous';
          }
          document.head.appendChild(link);
        }
      });

      // Add DNS prefetch for external resources
      const dnsPrefetch = [
        'https://www.linkedin.com',
        'https://twitter.com',
        'https://calendly.com'
      ];

      dnsPrefetch.forEach(url => {
        if (!document.querySelector(`link[href="${url}"]`)) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = url;
          document.head.appendChild(link);
        }
      });

      // Add essential meta tags for better indexing
      const essentialMeta = [
        { name: 'format-detection', content: 'telephone=yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-touch-fullscreen', content: 'yes' },
        { name: 'HandheldFriendly', content: 'True' },
        { name: 'MobileOptimized', content: '320' }
      ];

      essentialMeta.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.head.appendChild(meta);
        }
      });

      // Add local business schema for better local SEO
      const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.hermankwayu.com#localbusiness",
        "name": "Herman Kwayu Consulting",
        "description": "Strategic Business Consultant & Digital Transformation Expert in Tanzania",
        "url": "https://www.hermankwayu.com",
        "telephone": "+255-XXX-XXX-XXX",
        "email": "truthherman@gmail.com",
        "image": "https://www.hermankwayu.com/og-image.jpg",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Business District",
          "addressLocality": "Dar es Salaam",
          "addressRegion": "Dar es Salaam",
          "postalCode": "00000",
          "addressCountry": "TZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-6.792354",
          "longitude": "39.208328"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday", 
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "17:00"
        },
        "sameAs": [
          "https://www.linkedin.com/in/herman-kwayu-044733135"
        ],
        "priceRange": "$$-$$$",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "currenciesAccepted": "USD, TZS"
      };

      // Add FAQ schema for better search results
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What services does Herman Kwayu offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Herman Kwayu offers strategic planning, digital transformation, business process optimization, innovation consulting, change management, and growth strategy services for businesses across Africa and globally."
            }
          },
          {
            "@type": "Question", 
            "name": "Where is Herman Kwayu based?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Herman Kwayu is based in Tanzania and provides both remote and on-site consulting services to clients across Africa and internationally."
            }
          },
          {
            "@type": "Question",
            "name": "What industries does Herman Kwayu specialize in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Herman Kwayu specializes in telecommunications, fintech, banking, and general business sectors with expertise in KYC compliance, digital transformation, and process optimization."
            }
          },
          {
            "@type": "Question",
            "name": "How can I contact Herman Kwayu for consulting services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can contact Herman Kwayu through the contact form on this website, email at truthherman@gmail.com, or schedule a consultation through the provided booking system."
            }
          }
        ]
      };

      // Add breadcrumb schema
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.hermankwayu.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About",
            "item": "https://www.hermankwayu.com#about"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Services",
            "item": "https://www.hermankwayu.com#services"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Contact",
            "item": "https://www.hermankwayu.com#contact"
          }
        ]
      };

      // Combine all schemas
      const combinedSchemas = [
        localBusinessSchema,
        faqSchema,
        breadcrumbSchema
      ];

      // Add schema to head
      combinedSchemas.forEach((schema, index) => {
        const scriptId = `seo-schema-${index}`;
        if (!document.querySelector(`#${scriptId}`)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.type = 'application/ld+json';
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        }
      });

      // Add performance hints
      const performanceHints = () => {
        // Lazy load images (if not already implemented)
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
          }
        });

        // Add importance hints to critical resources
        const criticalLinks = document.querySelectorAll('link[rel="stylesheet"]');
        criticalLinks.forEach((link, index) => {
          if (index === 0 && !link.hasAttribute('fetchpriority')) {
            link.setAttribute('fetchpriority', 'high');
          }
        });
      };

      // Run performance optimizations
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performanceHints);
      } else {
        performanceHints();
      }

      // Add service worker registration for offline capability (optional)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      }
    };

    optimizeForSEO();
  }, []);

  return null;
}