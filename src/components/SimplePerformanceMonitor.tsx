/**
 * Simple Performance Monitor - Lightweight performance tracking
 * Only active in development mode
 */

import React, { useEffect } from 'react';

export function SimplePerformanceMonitor() {
  useEffect(() => {
    // Only run in development, but return early component for production build optimization
    if (process?.env?.NODE_ENV !== 'development') {
      return;
    }

    let performanceEntries: PerformanceEntry[] = [];

    const logPerformance = () => {
      try {
        if (window.performance && window.performance.getEntriesByType) {
          const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
            const totalLoad = navigation.loadEventEnd - navigation.navigationStart;
            
            if (loadTime > 0) {
              console.log('📊 Performance Metrics:');
              console.log(`  Load Time: ${loadTime.toFixed(2)}ms`);
              console.log(`  DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
              console.log(`  Total Page Load: ${totalLoad.toFixed(2)}ms`);
              
              // Warn about slow loading times
              if (totalLoad > 3000) {
                console.warn('⚠️ Slow page load detected:', `${totalLoad.toFixed(2)}ms`);
              }
              
              if (loadTime > 1000) {
                console.warn('⚠️ Slow load event:', `${loadTime.toFixed(2)}ms`);
              }
            }
          }
        }
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    };

    // Log performance after page load with longer delay for accuracy
    const timer = setTimeout(logPerformance, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Return null for both dev and production
  return null;
}