import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "Herman Kwayu - Business Consultant | Tanzania",
  description = "Strategic Business Consultant & Digital Transformation Expert with 8+ years experience. Specializing in process optimization & growth strategy across Africa.",
  keywords = "Herman Kwayu, business consultant Tanzania, digital transformation expert, strategic planning consultant, project management specialist, process optimization, KYC compliance expert, telecom consultant, fintech solutions, business analyst Africa, Dar es Salaam consultant, remote business consultant, innovation consulting, change management, growth strategy consultant",
  image = "https://www.hermankwayu.com/og-image.jpg",
  url = "https://www.hermankwayu.com"
}: SEOProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Create or update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'Herman Kwayu' },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#3b4270' },
      { name: 'msapplication-TileColor', content: '#3b4270' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: 'Herman Kwayu Consulting' },
      
      // Enhanced SEO meta tags
      { name: 'geo.region', content: 'TZ' },
      { name: 'geo.placename', content: 'Tanzania' },
      { name: 'geo.position', content: '-6.792354;39.208328' },
      { name: 'ICBM', content: '-6.792354, 39.208328' },
      { name: 'language', content: 'en' },
      { name: 'revisit-after', content: '7 days' },
      { name: 'distribution', content: 'global' },
      { name: 'rating', content: 'general' },
      
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
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Herman Kwayu Consulting' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:locale:alternate', content: 'en_GB' },
      
      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@hermankwayu' },
      { name: 'twitter:creator', content: '@hermankwayu' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:image:alt', content: 'Herman Kwayu - Strategic Business Consultant' },
      
      // LinkedIn tags
      { name: 'linkedin:owner', content: 'herman-kwayu-044733135' },
      { property: 'article:author', content: 'https://www.linkedin.com/in/herman-kwayu-044733135' },
      
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

  }, [title, description, keywords, image, url]);

  return null; // This component doesn't render anything
}