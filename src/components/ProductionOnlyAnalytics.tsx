// Production-only analytics wrapper - ZERO functionality in development
// This component provides a completely safe analytics interface that does nothing in development

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

// Completely safe no-op implementation
const createSafeAnalytics = (): SafeAnalytics => ({
  track: () => {},
  trackPageView: () => {},
  trackResumeBuilderVisit: () => {},
  trackResumeTemplateSelected: () => {},
  trackResumeCreated: () => {},
  trackResumeDownloaded: () => {},
  trackUserInteraction: () => {},
  trackFormSubmission: () => {}
});

// Export the safe analytics interface
export const analytics: SafeAnalytics = createSafeAnalytics();

// Development status logging - only once per session
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const hasLoggedStatus = sessionStorage.getItem('production_analytics_status_logged');
  if (!hasLoggedStatus) {
    console.log('📊 ProductionOnlyAnalytics: All tracking disabled in development mode');
    sessionStorage.setItem('production_analytics_status_logged', 'true');
  }
}

// Test function for development debugging
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__testProductionAnalytics = () => {
    console.log('Testing ProductionOnlyAnalytics...');
    analytics.track('test_event', { test: true });
    analytics.trackResumeBuilderVisit();
    analytics.trackUserInteraction('test', 'click');
    console.log('✅ All analytics calls completed silently (no functionality in development)');
  };
}