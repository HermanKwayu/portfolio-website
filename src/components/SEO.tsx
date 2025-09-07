import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export function SEO({
  title = "Herman Kwayu - Business Consultant | Tanzania",
  description = "Strategic Business Consultant & Digital Transformation Expert with 8+ years experience. Specializing in process optimization & growth strategy across Africa.",
  keywords = "Herman Kwayu, business consultant Tanzania, digital transformation expert, strategic planning consultant, project management specialist, process optimization, KYC compliance expert, telecom consultant, fintech solutions, business analyst Africa, Dar es Salaam consultant, remote business consultant, innovation consulting, change management, growth strategy consultant",
  image = "https://www.hermankwayu.com/og-image.jpg",
  url = "https://www.hermankwayu.com",
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Herman Kwayu",
  section
}: SEOProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Create or update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'Herman Kwayu' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1, max-image-preview:large' },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes' },
      { name: 'theme-color', content: '#3b4270' },
      { name: 'theme-color', content: '#3b4270', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#1a1a1a', media: '(prefers-color-scheme: dark)' },
      { name: 'msapplication-TileColor', content: '#3b4270' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Herman Kwayu Consulting' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'MobileOptimized', content: '320' },
      { name: 'referrer', content: 'origin-when-cross-origin' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'supported-color-schemes', content: 'light dark' },
      
      // Enhanced SEO meta tags
      { name: 'geo.region', content: 'TZ' },
      { name: 'geo.placename', content: 'Tanzania' },
      { name: 'geo.position', content: '-6.792354;39.208328' },
      { name: 'ICBM', content: '-6.792354, 39.208328' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'distribution', content: 'global' },
      { name: 'rating', content: 'general' },
      { name: 'format-detection', content: 'telephone=yes, date=no, address=no, email=no, url=no' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'msapplication-starturl', content: url },
      { name: 'application-name', content: 'Herman Kwayu Consulting' },
      { name: 'msapplication-tooltip', content: 'Strategic Business Consultant' },
      { name: 'msapplication-task', content: `name=About;action-uri=${url}#about;icon-uri=${url}/favicon.ico` },
      { name: 'msapplication-task', content: `name=Services;action-uri=${url}#services;icon-uri=${url}/favicon.ico` },
      { name: 'msapplication-task', content: `name=Contact;action-uri=${url}#contact;icon-uri=${url}/favicon.ico` },
      
      // Business/Professional tags
      { name: 'business:contact_data:street_address', content: 'Tanzania' },
      { name: 'business:contact_data:locality', content: 'Dar es Salaam' },
      { name: 'business:contact_data:region', content: 'Tanzania' },
      { name: 'business:contact_data:postal_code', content: '00000' },
      { name: 'business:contact_data:country_name', content: 'Tanzania' },
      { name: 'business:contact_data:email', content: 'truthherman@gmail.com' },
      { name: 'business:contact_data:website', content: url },
      
      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Herman Kwayu - Strategic Business Consultant' },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Herman Kwayu Consulting' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'en_GB' },
      ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
      ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
      ...(author ? [{ property: 'article:author', content: author }] : []),
      ...(section ? [{ property: 'article:section', content: section }] : []),
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@hermankwayu' },
      { name: 'twitter:creator', content: '@hermankwayu' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: 'Herman Kwayu - Strategic Business Consultant' },
      { name: 'twitter:image:width', content: '1200' },
      { name: 'twitter:image:height', content: '630' },
      { name: 'twitter:app:name:iphone', content: 'Herman Kwayu Consulting' },
      { name: 'twitter:app:name:ipad', content: 'Herman Kwayu Consulting' },
      { name: 'twitter:app:name:googleplay', content: 'Herman Kwayu Consulting' },
      
      // LinkedIn tags
      { name: 'linkedin:owner', content: 'herman-kwayu-044733135' },
      { property: 'article:author', content: 'https://www.linkedin.com/in/herman-kwayu-044733135' },
      
      // Additional social media tags
      { property: 'fb:app_id', content: 'FACEBOOK_APP_ID' },
      { property: 'fb:admins', content: 'FACEBOOK_ADMIN_ID' },
      { name: 'pinterest-rich-pin', content: 'true' },
      { name: 'telegram:channel', content: '@hermankwayu' },
      
      // WhatsApp meta tags
      { property: 'whatsapp:title', content: title },
      { property: 'whatsapp:description', content: description },
      { property: 'whatsapp:image', content: image },
      
      // Professional classification
      { name: 'classification', content: 'business consulting, digital transformation' },
      { name: 'category', content: 'professional services, consulting, business strategy' },
      { name: 'coverage', content: 'worldwide' },
      { name: 'target', content: 'businesses, entrepreneurs, startups, enterprises' }
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });

    // Enhanced structured data with multiple schema types
    const structuredData = [
      // Person Schema
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${url}#person`,
        "name": "Herman Kwayu",
        "alternateName": ["Herman K", "Herman Kwayu Consulting"],
        "jobTitle": "Strategic Business Consultant & Digital Transformation Expert",
        "description": description,
        "url": url,
        "image": image,
        "email": "truthherman@gmail.com",
        "telephone": "+255-XXX-XXX-XXX",
        "nationality": "Tanzanian",
        "birthPlace": "Tanzania",
        "gender": "Male",
        "sameAs": [
          "https://www.linkedin.com/in/herman-kwayu-044733135",
          "https://twitter.com/hermankwayu"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dar es Salaam",
          "addressRegion": "Tanzania",
          "addressCountry": "TZ",
          "postalCode": "00000"
        },
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Business Consultant",
          "description": "Strategic business consulting and digital transformation expertise",
          "occupationLocation": {
            "@type": "Country",
            "name": "Tanzania"
          },
          "estimatedSalary": {
            "@type": "MonetaryAmountDistribution",
            "currency": "USD",
            "duration": "P1Y"
          }
        },
        "knowsAbout": [
          "Strategic Planning",
          "Digital Transformation",
          "Business Process Optimization",
          "KYC Compliance",
          "Project Management",
          "Change Management",
          "Innovation Consulting",
          "Growth Strategy",
          "Telecom Operations",
          "Fintech Solutions",
          "Business Analysis",
          "Process Improvement"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Professional Education"
        },
        "workLocation": [
          {
            "@type": "Place",
            "name": "Remote Consulting",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Worldwide"
            }
          },
          {
            "@type": "Place",
            "name": "On-site Consulting",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Tanzania",
              "addressCountry": "TZ"
            }
          }
        ]
      },
      // Professional Service Schema
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${url}#business`,
        "name": "Herman Kwayu Consulting",
        "alternateName": "HK Consulting",
        "description": "Strategic business consulting services specializing in digital transformation, process optimization, and growth strategy",
        "url": url,
        "logo": image,
        "image": image,
        "priceRange": "$-$$",
        "telephone": "+255-XXX-XXX-XXX",
        "email": "truthherman@gmail.com",
        "founder": {
          "@id": `${url}#person`
        },
        "employee": {
          "@id": `${url}#person`
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dar es Salaam",
          "addressRegion": "Tanzania",
          "addressCountry": "TZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -6.792354,
          "longitude": 39.208328
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "Tanzania"
          },
          {
            "@type": "Country",
            "name": "Kenya"
          },
          {
            "@type": "Country",
            "name": "Uganda"
          },
          {
            "@type": "Continent",
            "name": "Africa"
          },
          "Worldwide"
        ],
        "serviceType": "Business Consulting",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Consulting Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Strategic Planning",
                "description": "Comprehensive business strategy development and implementation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Digital Transformation",
                "description": "Technology integration and digital process optimization"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Business Process Optimization",
                "description": "Streamlining operations for maximum efficiency"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Innovation Consulting",
                "description": "Innovation strategy and implementation guidance"
              }
            }
          ]
        },
        "sameAs": [
          "https://www.linkedin.com/in/herman-kwayu-044733135"
        ]
      },
      // Website Schema
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${url}#website`,
        "url": url,
        "name": "Herman Kwayu Consulting",
        "description": description,
        "publisher": {
          "@id": `${url}#person`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${url}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      // WebPage Schema for current page
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": title,
        "description": description,
        "isPartOf": {
          "@id": `${url}#website`
        },
        "about": {
          "@id": `${url}#person`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": image,
          "width": 1200,
          "height": 630
        },
        "datePublished": "2023-01-01T00:00:00+00:00",
        "dateModified": new Date().toISOString(),
        "author": {
          "@id": `${url}#person`
        },
        "publisher": {
          "@id": `${url}#person`
        },
        "inLanguage": "en-US",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": url
            }
          ]
        }
      },
      // Organization Schema
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${url}#organization`,
        "name": "Herman Kwayu Consulting",
        "url": url,
        "logo": {
          "@type": "ImageObject",
          "url": image,
          "width": 512,
          "height": 512
        },
        "image": image,
        "description": description,
        "founder": {
          "@id": `${url}#person`
        },
        "foundingDate": "2015-01-01",
        "numberOfEmployees": "1-10",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Dar es Salaam",
          "addressRegion": "Tanzania",
          "addressCountry": "TZ"
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "Tanzania"
          },
          {
            "@type": "Country", 
            "name": "Kenya"
          },
          {
            "@type": "Country",
            "name": "Uganda"
          }
        ],
        "knowsAbout": [
          "Business Consulting",
          "Digital Transformation",
          "Strategic Planning",
          "Process Optimization",
          "Project Management"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+255-XXX-XXX-XXX",
          "contactType": "customer service",
          "email": "truthherman@gmail.com",
          "availableLanguage": ["English", "Swahili"]
        },
        "sameAs": [
          "https://www.linkedin.com/in/herman-kwayu-044733135"
        ]
      }
    ];

    // Add or update structured data script
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Add resource hints for better performance
    const resourceHints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://www.linkedin.com' },
      { rel: 'dns-prefetch', href: 'https://twitter.com' },
      { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
      { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' }
    ];

    resourceHints.forEach(hint => {
      const selector = hint.crossorigin ? 
        `link[rel="${hint.rel}"][href="${hint.href}"][crossorigin]` : 
        `link[rel="${hint.rel}"][href="${hint.href}"]`;
      
      if (!document.querySelector(selector)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.crossOrigin = hint.crossorigin;
        }
        document.head.appendChild(link);
      }
    });

    // Add favicon and app icons
    const icons = [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3b4270' },
      { rel: 'manifest', href: '/manifest.json' }
    ];

    icons.forEach(icon => {
      const selector = icon.sizes ? 
        `link[rel="${icon.rel}"][sizes="${icon.sizes}"]` : 
        `link[rel="${icon.rel}"][href="${icon.href}"]`;
      
      if (!document.querySelector(selector)) {
        const link = document.createElement('link');
        link.rel = icon.rel;
        link.href = icon.href;
        if (icon.type) link.type = icon.type;
        if (icon.sizes) link.setAttribute('sizes', icon.sizes);
        if (icon.color) link.setAttribute('color', icon.color);
        document.head.appendChild(link);
      }
    });

  }, [title, description, keywords, image, url, type, publishedTime, modifiedTime, author, section]);

  return null; // This component doesn't render anything
}