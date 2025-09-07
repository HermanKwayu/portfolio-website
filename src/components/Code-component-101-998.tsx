import { useEffect } from 'react';

export function SEOValidator() {
  useEffect(() => {
    // Comprehensive SEO validation
    const validateSEO = () => {
      const results = {
        title: validateTitle(),
        metaDescription: validateMetaDescription(),
        h1Tags: validateH1Tags(),
        images: validateImages(),
        structuredData: validateStructuredData(),
        canonical: validateCanonical(),
        socialMedia: validateSocialMedia(),
        performance: validatePerformance(),
        accessibility: validateAccessibility(),
        mobile: validateMobile()
      };

      if (process.env.NODE_ENV === 'development') {
        console.group('🔍 SEO Validation Results');
        Object.entries(results).forEach(([key, result]) => {
          const emoji = result.passed ? '✅' : '❌';
          console.log(`${emoji} ${key}:`, result);
        });
        console.groupEnd();
      }

      return results;
    };

    const validateTitle = () => {
      const title = document.title;
      const length = title.length;
      return {
        passed: length >= 30 && length <= 60,
        current: length,
        title: title,
        recommendation: length < 30 ? 'Title too short' : length > 60 ? 'Title too long' : 'Perfect length'
      };
    };

    const validateMetaDescription = () => {
      const metaDesc = document.querySelector('meta[name="description"]');
      const content = metaDesc?.getAttribute('content') || '';
      const length = content.length;
      return {
        passed: length >= 120 && length <= 160,
        current: length,
        content: content,
        recommendation: length < 120 ? 'Description too short' : length > 160 ? 'Description too long' : 'Perfect length'
      };
    };

    const validateH1Tags = () => {
      const h1Tags = document.querySelectorAll('h1');
      return {
        passed: h1Tags.length === 1,
        count: h1Tags.length,
        recommendation: h1Tags.length === 0 ? 'Missing H1 tag' : h1Tags.length > 1 ? 'Multiple H1 tags found' : 'Perfect - exactly one H1'
      };
    };

    const validateImages = () => {
      const images = document.querySelectorAll('img');
      const imagesWithAlt = document.querySelectorAll('img[alt]');
      const imagesWithSrcOrData = document.querySelectorAll('img[src], img[data-src]');
      
      return {
        passed: images.length === imagesWithAlt.length && images.length > 0,
        total: images.length,
        withAlt: imagesWithAlt.length,
        withSrc: imagesWithSrcOrData.length,
        recommendation: images.length === imagesWithAlt.length ? 'All images have alt text' : 'Some images missing alt text'
      };
    };

    const validateStructuredData = () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      let validSchemas = 0;
      
      scripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          if (data['@context'] && data['@type']) {
            validSchemas++;
          }
        } catch (e) {
          // Invalid JSON
        }
      });

      return {
        passed: validSchemas >= 4,
        count: validSchemas,
        recommendation: validSchemas >= 4 ? 'Good structured data coverage' : 'More structured data needed'
      };
    };

    const validateCanonical = () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      return {
        passed: !!canonical,
        url: canonical?.getAttribute('href'),
        recommendation: canonical ? 'Canonical URL found' : 'Missing canonical URL'
      };
    };

    const validateSocialMedia = () => {
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
      
      const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
      const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
      
      const foundOgTags = Array.from(ogTags).map(tag => tag.getAttribute('property'));
      const foundTwitterTags = Array.from(twitterTags).map(tag => tag.getAttribute('name'));
      
      const ogComplete = requiredOgTags.every(tag => foundOgTags.includes(tag));
      const twitterComplete = requiredTwitterTags.every(tag => foundTwitterTags.includes(tag));

      return {
        passed: ogComplete && twitterComplete,
        openGraph: {
          total: ogTags.length,
          required: requiredOgTags.length,
          complete: ogComplete
        },
        twitter: {
          total: twitterTags.length,
          required: requiredTwitterTags.length,
          complete: twitterComplete
        },
        recommendation: ogComplete && twitterComplete ? 'Social media tags complete' : 'Missing social media tags'
      };
    };

    const validatePerformance = () => {
      const performanceEntries = performance.getEntriesByType('navigation');
      const timing = performanceEntries[0] as PerformanceNavigationTiming;
      
      if (!timing) return { passed: false, recommendation: 'Performance data not available' };

      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

      return {
        passed: loadTime < 3000 && domContentLoaded < 2000,
        loadTime: Math.round(loadTime),
        domContentLoaded: Math.round(domContentLoaded),
        recommendation: loadTime < 3000 ? 'Good load time' : 'Page loads slowly'
      };
    };

    const validateAccessibility = () => {
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      const altTexts = document.querySelectorAll('img[alt]');
      const ariaLabels = document.querySelectorAll('[aria-label]');
      const headingStructure = validateHeadingStructure();

      return {
        passed: skipLinks.length > 0 && headingStructure.passed,
        skipLinks: skipLinks.length,
        altTexts: altTexts.length,
        ariaLabels: ariaLabels.length,
        headingStructure: headingStructure,
        recommendation: 'Accessibility features implemented'
      };
    };

    const validateHeadingStructure = () => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      let lastLevel = 0;
      let isValid = true;

      headings.forEach(heading => {
        const level = parseInt(heading.tagName.substring(1));
        if (level > lastLevel + 1) {
          isValid = false;
        }
        lastLevel = level;
      });

      return {
        passed: isValid && headings.length > 0,
        count: headings.length,
        recommendation: isValid ? 'Good heading structure' : 'Heading structure needs improvement'
      };
    };

    const validateMobile = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const viewportContent = viewport?.getAttribute('content') || '';
      const hasWidthDevice = viewportContent.includes('width=device-width');
      const hasInitialScale = viewportContent.includes('initial-scale=1');

      return {
        passed: hasWidthDevice && hasInitialScale,
        content: viewportContent,
        recommendation: hasWidthDevice && hasInitialScale ? 'Mobile optimized' : 'Mobile optimization needed'
      };
    };

    // Run validation after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', validateSEO);
    } else {
      setTimeout(validateSEO, 1000); // Allow time for dynamic content
    }

    // Also run validation when route changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target === document.head) {
          setTimeout(validateSEO, 500);
        }
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}