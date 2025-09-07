import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry && lastEntry.startTime) {
              console.log('LCP:', lastEntry.startTime);
              // You can send this to analytics
              // Analytics.track('web_vital', { metric: 'LCP', value: lastEntry.startTime });
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              console.log('FID:', entry.processingStart - entry.startTime);
              // Analytics.track('web_vital', { metric: 'FID', value: entry.processingStart - entry.startTime });
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            console.log('CLS:', clsValue);
            // Analytics.track('web_vital', { metric: 'CLS', value: clsValue });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring not supported:', error);
        }
      }
    };

    // Monitor page load performance
    const monitorPageLoad = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigation) {
              const metrics = {
                dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp: navigation.connectEnd - navigation.connectStart,
                ttfb: navigation.responseStart - navigation.requestStart,
                dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                load: navigation.loadEventEnd - navigation.loadEventStart,
                total: navigation.loadEventEnd - navigation.navigationStart
              };
              
              console.log('Page Load Metrics:', metrics);
              // Analytics.track('page_performance', metrics);
            }
          }, 0);
        });
      }
    };

    // Monitor resource loading
    const monitorResources = () => {
      if ('PerformanceObserver' in window) {
        try {
          const resourceObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
              if (entry.duration > 1000) { // Flag slow resources (>1s)
                console.warn('Slow resource:', entry.name, entry.duration);
                // Analytics.track('slow_resource', { 
                //   url: entry.name, 
                //   duration: entry.duration,
                //   type: entry.initiatorType 
                // });
              }
            });
          });
          resourceObserver.observe({ entryTypes: ['resource'] });
        } catch (error) {
          console.warn('Resource monitoring not supported:', error);
        }
      }
    };

    // Initialize monitoring
    observeWebVitals();
    monitorPageLoad();
    monitorResources();

    // Cleanup function
    return () => {
      // Disconnect observers if needed
      if ('PerformanceObserver' in window) {
        try {
          PerformanceObserver.supportedEntryTypes?.forEach(type => {
            const observer = new PerformanceObserver(() => {});
            observer.disconnect();
          });
        } catch (error) {
          console.warn('Error cleaning up performance observers:', error);
        }
      }
    };
  }, []);

  return null; // This component doesn't render anything
}