/**
 * Development-Safe Analytics Component
 * 
 * This component provides a completely safe analytics interface that:
 * - Does NOTHING in development mode
 * - Never makes network requests in development
 * - Never imports heavy analytics modules in development
 * - Only provides functionality in production
 */

import { useEffect } from 'react';

// Safe analytics interface
export interface SafeAnalyticsInterface {
  track: (eventName: string, properties?: Record<string, any>) => void;
  trackPageView: (page?: string) => void;
  trackResumeBuilderVisit: () => void;
  trackResumeTemplateSelected: (templateId: string, templateName: string) => void;
  trackResumeCreated: (templateId: string, templateName: string, hasContent?: boolean) => void;
  trackResumeDownloaded: (templateId: string, templateName: string, format?: string) => void;
  trackUserInteraction: (element: string, action: string, properties?: Record<string, any>) => void;
  trackFormSubmission: (formType: string, success: boolean, properties?: Record<string, any>) => void;
}

// Create no-op analytics for development
const createNoOpAnalytics = (): SafeAnalyticsInterface => ({
  track: () => {},
  trackPageView: () => {},
  trackResumeBuilderVisit: () => {},
  trackResumeTemplateSelected: () => {},
  trackResumeCreated: () => {},
  trackResumeDownloaded: () => {},
  trackUserInteraction: () => {},
  trackFormSubmission: () => {}
});

// Lazy load production analytics ONLY in production
let productionAnalytics: SafeAnalyticsInterface | null = null;
let isLoading = false;

const getProductionAnalytics = async (): Promise<SafeAnalyticsInterface> => {
  // NEVER load in development
  if (process.env.NODE_ENV !== 'production') {
    return createNoOpAnalytics();
  }

  if (productionAnalytics) {
    return productionAnalytics;
  }

  if (isLoading) {
    return createNoOpAnalytics();
  }

  try {
    isLoading = true;
    // Only import in production
    const analyticsModule = await import('./ComprehensiveAnalytics');
    productionAnalytics = analyticsModule.analytics;
    return productionAnalytics;
  } catch (error) {
    // Silent fallback to no-op
    return createNoOpAnalytics();
  } finally {
    isLoading = false;
  }
};

// Export safe analytics
export const analytics: SafeAnalyticsInterface = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.track(eventName, properties));
    }
  },
  
  trackPageView: (page?: string) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackPageView(page));
    }
  },
  
  trackResumeBuilderVisit: () => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackResumeBuilderVisit());
    }
  },
  
  trackResumeTemplateSelected: (templateId: string, templateName: string) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackResumeTemplateSelected(templateId, templateName));
    }
  },
  
  trackResumeCreated: (templateId: string, templateName: string, hasContent?: boolean) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackResumeCreated(templateId, templateName, hasContent));
    }
  },
  
  trackResumeDownloaded: (templateId: string, templateName: string, format?: string) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackResumeDownloaded(templateId, templateName, format));
    }
  },
  
  trackUserInteraction: (element: string, action: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackUserInteraction(element, action, properties));
    }
  },
  
  trackFormSubmission: (formType: string, success: boolean, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
      getProductionAnalytics().then(analytics => analytics.trackFormSubmission(formType, success, properties));
    }
  }
};

// Development status logging - one time only
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const hasLogged = sessionStorage.getItem('dev_safe_analytics_logged');
  if (!hasLogged) {
    console.log('📊 DevelopmentSafeAnalytics: Zero functionality in development - no network requests');
    sessionStorage.setItem('dev_safe_analytics_logged', 'true');
  }
}

// Safe Analytics React Component - does nothing in development
export function DevelopmentSafeAnalytics() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Initialize production analytics
    getProductionAnalytics();
  }, []);

  return null; // This component renders nothing
}