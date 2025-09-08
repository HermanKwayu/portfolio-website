/**
 * NoOpAnalytics - Completely Safe Analytics for Development
 * 
 * This module provides analytics functionality that:
 * - Does ABSOLUTELY NOTHING in development mode
 * - Never makes network requests in development
 * - Never imports heavy modules in development
 * - Provides a safe interface for all analytics calls
 */

// Safe analytics interface - all methods are no-ops in development
export const analytics = {
  track: () => {},
  trackPageView: () => {},
  trackResumeBuilderVisit: () => {},
  trackResumeTemplateSelected: () => {},
  trackResumeCreated: () => {},
  trackResumeDownloaded: () => {},
  trackUserInteraction: () => {},
  trackFormSubmission: () => {}
};

// Development status - only log once
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const hasLogged = sessionStorage.getItem('noop_analytics_logged');
  if (!hasLogged) {
    console.log('📊 NoOpAnalytics: Zero functionality in development mode');
    sessionStorage.setItem('noop_analytics_logged', 'true');
  }
}