// Safe analytics wrapper that prevents fetch errors in development
// This file has ZERO imports to prevent any analytics modules from loading in development

interface SafeAnalytics {
  track: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (page?: string) => void;
  trackResumeBuilderVisit: () => void;
  trackResumeTemplateSelected: (templateId: string, templateName: string) => void;
  trackResumeCreated: (templateId: string, templateName: string, hasContent?: boolean) => void;
  trackResumeDownloaded: (templateId: string, templateName: string, format?: string) => void;
  trackUserInteraction: (element: string, action: string, properties?: Record<string, any>) => void;
  trackFormSubmission: (formType: string, success: boolean, properties?: Record<string, any>) => void;
}

// Production analytics cache
let prodAnalytics: any = null;
let isLoadingAnalytics = false;

// Helper to load analytics only in production - COMPLETELY DISABLED IN DEVELOPMENT
const loadProductionAnalytics = async () => {
  // ABSOLUTE BLOCK for development mode
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  
  if (prodAnalytics) return prodAnalytics;
  if (isLoadingAnalytics) return null;
  
  try {
    isLoadingAnalytics = true;
    const module = await import('./ComprehensiveAnalytics');
    prodAnalytics = module.analytics;
    return prodAnalytics;
  } catch (error) {
    // Silently fail - no logging in development
    return null;
  } finally {
    isLoadingAnalytics = false;
  }
};

// Safe analytics export - completely silent in development
export const analytics: SafeAnalytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.track?.(eventName, properties);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.track?.(eventName, properties);
        });
      }
    }
  },

  trackPageView: (page?: string) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackPageView?.(page);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackPageView?.(page);
        });
      }
    }
  },

  trackResumeBuilderVisit: () => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackResumeBuilderVisit?.();
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackResumeBuilderVisit?.();
        });
      }
    }
  },

  trackResumeTemplateSelected: (templateId: string, templateName: string) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackResumeTemplateSelected?.(templateId, templateName);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackResumeTemplateSelected?.(templateId, templateName);
        });
      }
    }
  },

  trackResumeCreated: (templateId: string, templateName: string, hasContent?: boolean) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackResumeCreated?.(templateId, templateName, hasContent);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackResumeCreated?.(templateId, templateName, hasContent);
        });
      }
    }
  },

  trackResumeDownloaded: (templateId: string, templateName: string, format?: string) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackResumeDownloaded?.(templateId, templateName, format);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackResumeDownloaded?.(templateId, templateName, format);
        });
      }
    }
  },

  trackUserInteraction: (element: string, action: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackUserInteraction?.(element, action, properties);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackUserInteraction?.(element, action, properties);
        });
      }
    }
  },

  trackFormSubmission: (formType: string, success: boolean, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      if (prodAnalytics) {
        prodAnalytics.trackFormSubmission?.(formType, success, properties);
      } else {
        loadProductionAnalytics().then(analytics => {
          analytics?.trackFormSubmission?.(formType, success, properties);
        });
      }
    }
  }
};

// Development mode - show status only once
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only log once per session
  const hasLoggedStatus = sessionStorage.getItem('analytics_status_logged');
  if (!hasLoggedStatus) {
    console.log('📊 SafeAnalytics: All tracking disabled in development - zero network requests');
    sessionStorage.setItem('analytics_status_logged', 'true');
  }
  
  // Add a simple test function to verify it's working
  (window as any).__testAnalytics = () => {
    console.log('Testing SafeAnalytics...');
    analytics.track('test_event', { test: true });
    analytics.trackResumeBuilderVisit();
    analytics.trackUserInteraction('test', 'click');
    console.log('✅ All analytics calls completed silently (no network requests)');
  };
}