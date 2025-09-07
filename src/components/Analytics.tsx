import { useEffect } from 'react';

interface AnalyticsEvent {
  type: string;
  data: Record<string, any>;
  timestamp: string;
  url: string;
}

export function Analytics() {
  useEffect(() => {
    // Enhanced page view tracking with device info
    const trackPageView = () => {
      try {
        const pageData = {
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          screen: `${screen.width}x${screen.height}`,
          deviceMemory: (navigator as any).deviceMemory || 'unknown',
          connectionType: (navigator as any).connection?.effectiveType || 'unknown',
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Store page view in local storage for basic analytics
        const existingViews = JSON.parse(localStorage.getItem('hermankwayu_pageviews') || '[]');
        existingViews.push(pageData);
        
        // Keep only last 100 page views to prevent storage bloat
        if (existingViews.length > 100) {
          existingViews.splice(0, existingViews.length - 100);
        }
        
        localStorage.setItem('hermankwayu_pageviews', JSON.stringify(existingViews));
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Page view tracked:', pageData);
        }
      } catch (error) {
        console.warn('Error tracking page view:', error);
      }
    };

    // Enhanced scroll depth tracking with throttling
    const trackScrollDepth = () => {
      let maxScroll = 0;
      let scrollMilestones: Record<number, boolean> = {};
      let ticking = false;

      const trackScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            try {
              const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
              if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track major milestones
                [25, 50, 75, 100].forEach(milestone => {
                  if (maxScroll >= milestone && !scrollMilestones[milestone]) {
                    scrollMilestones[milestone] = true;
                    
                    const scrollData = {
                      milestone,
                      url: window.location.href,
                      timestamp: new Date().toISOString()
                    };
                    
                    // Store scroll milestone
                    const existingScrolls = JSON.parse(localStorage.getItem('hermankwayu_scrolldepth') || '[]');
                    existingScrolls.push(scrollData);
                    
                    if (existingScrolls.length > 50) {
                      existingScrolls.splice(0, existingScrolls.length - 50);
                    }
                    
                    localStorage.setItem('hermankwayu_scrolldepth', JSON.stringify(existingScrolls));
                    
                    if (process.env.NODE_ENV === 'development') {
                      console.log(`Scroll depth milestone: ${milestone}%`);
                    }
                  }
                });
              }
            } catch (error) {
              console.warn('Error tracking scroll depth:', error);
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', trackScroll, { passive: true });
      return () => window.removeEventListener('scroll', trackScroll);
    };

    // Enhanced time tracking with visibility API
    const startTime = Date.now();
    let visibilityStartTime = Date.now();
    let totalVisibleTime = 0;
    
    const trackTimeOnPage = () => {
      try {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const visibleTime = Math.round(totalVisibleTime / 1000);
        
        const timeData = {
          url: window.location.href,
          timeSpent,
          visibleTime,
          timestamp: new Date().toISOString(),
          exitType: 'beforeunload'
        };
        
        const existingTimes = JSON.parse(localStorage.getItem('hermankwayu_timespent') || '[]');
        existingTimes.push(timeData);
        
        if (existingTimes.length > 50) {
          existingTimes.splice(0, existingTimes.length - 50);
        }
        
        localStorage.setItem('hermankwayu_timespent', JSON.stringify(existingTimes));
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Time on page: ${timeSpent}s (visible: ${visibleTime}s)`);
        }
      } catch (error) {
        console.warn('Error tracking time on page:', error);
      }
    };

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        totalVisibleTime += Date.now() - visibilityStartTime;
      } else {
        visibilityStartTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track initial page view
    trackPageView();

    // Set up scroll tracking
    const cleanupScroll = trackScrollDepth();

    // Track time on page when user leaves
    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track form interactions
    const trackFormInteraction = (formType: string, action: string) => {
      console.log(`Form interaction: ${formType} - ${action}`);
      
      const interactionData = {
        formType,
        action,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };
      
      const existingInteractions = JSON.parse(localStorage.getItem('hermankwayu_interactions') || '[]');
      existingInteractions.push(interactionData);
      
      // Keep only last 50 interactions
      if (existingInteractions.length > 50) {
        existingInteractions.splice(0, existingInteractions.length - 50);
      }
      
      localStorage.setItem('hermankwayu_interactions', JSON.stringify(existingInteractions));
    };

    // Add event listeners for form tracking
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', () => trackFormInteraction('contact', 'submit'));
    }

    // Add click tracking for important buttons
    const trackButtonClick = (buttonType: string) => {
      console.log(`Button clicked: ${buttonType}`);
      trackFormInteraction('button', buttonType);
    };

    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('[data-track]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const trackingData = button.getAttribute('data-track');
        if (trackingData) trackButtonClick(trackingData);
      });
    });

    // Error boundary for unhandled errors
    const trackError = (error: ErrorEvent) => {
      try {
        const errorData = {
          message: error.message,
          filename: error.filename,
          lineno: error.lineno,
          colno: error.colno,
          stack: error.error?.stack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        };
        
        const existingErrors = JSON.parse(localStorage.getItem('hermankwayu_errors') || '[]');
        existingErrors.push(errorData);
        
        if (existingErrors.length > 20) {
          existingErrors.splice(0, existingErrors.length - 20);
        }
        
        localStorage.setItem('hermankwayu_errors', JSON.stringify(existingErrors));
        console.error('JavaScript error tracked:', errorData);
      } catch (trackingError) {
        console.warn('Error tracking failed:', trackingError);
      }
    };

    // Add global error handler
    window.addEventListener('error', trackError);

    // Track unhandled promise rejections
    const trackUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const rejectionData = {
          reason: event.reason?.toString() || 'Unknown promise rejection',
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
        
        const existingRejections = JSON.parse(localStorage.getItem('hermankwayu_rejections') || '[]');
        existingRejections.push(rejectionData);
        
        if (existingRejections.length > 10) {
          existingRejections.splice(0, existingRejections.length - 10);
        }
        
        localStorage.setItem('hermankwayu_rejections', JSON.stringify(existingRejections));
        console.error('Unhandled promise rejection tracked:', rejectionData);
      } catch (error) {
        console.warn('Promise rejection tracking failed:', error);
      }
    };

    window.addEventListener('unhandledrejection', trackUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', trackError);
      window.removeEventListener('unhandledrejection', trackUnhandledRejection);
      cleanupScroll();
    };
  }, []);

  return null; // This component doesn't render anything
}

// Helper function to get comprehensive analytics data (for admin use)
export const getAnalyticsData = () => {
  try {
    return {
      pageViews: JSON.parse(localStorage.getItem('hermankwayu_pageviews') || '[]'),
      timeSpent: JSON.parse(localStorage.getItem('hermankwayu_timespent') || '[]'),
      interactions: JSON.parse(localStorage.getItem('hermankwayu_interactions') || '[]'),
      scrollDepth: JSON.parse(localStorage.getItem('hermankwayu_scrolldepth') || '[]'),
      errors: JSON.parse(localStorage.getItem('hermankwayu_errors') || '[]'),
      rejections: JSON.parse(localStorage.getItem('hermankwayu_rejections') || '[]')
    };
  } catch (error) {
    console.warn('Error retrieving analytics data:', error);
    return {
      pageViews: [],
      timeSpent: [],
      interactions: [],
      scrollDepth: [],
      errors: [],
      rejections: []
    };
  }
};

// Helper function to clear analytics data
export const clearAnalyticsData = () => {
  try {
    const keys = [
      'hermankwayu_pageviews',
      'hermankwayu_timespent', 
      'hermankwayu_interactions',
      'hermankwayu_scrolldepth',
      'hermankwayu_errors',
      'hermankwayu_rejections'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('Analytics data cleared');
  } catch (error) {
    console.warn('Error clearing analytics data:', error);
  }
};

// Helper function to export analytics data
export const exportAnalyticsData = () => {
  try {
    const data = getAnalyticsData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `hermankwayu-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.warn('Error exporting analytics data:', error);
  }
};