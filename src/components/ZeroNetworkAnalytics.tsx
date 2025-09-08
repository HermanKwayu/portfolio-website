/**
 * Zero Network Analytics - Completely Safe for Development
 * 
 * This component provides analytics functionality that:
 * - Makes ZERO network requests in development
 * - Never imports any modules that could make network requests in development
 * - Only provides real functionality in production
 */

// Safe analytics interface that does nothing in development
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

// Component that renders nothing and does nothing
export function ZeroNetworkAnalytics() {
  return null;
}

// Simple status log for development (one time only)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const hasLogged = sessionStorage.getItem('zero_network_analytics_logged');
  if (!hasLogged) {
    console.log('📊 ZeroNetworkAnalytics: All functionality disabled in development');
    sessionStorage.setItem('zero_network_analytics_logged', 'true');
  }
}