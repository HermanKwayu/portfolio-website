import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Basic page view tracking
    const trackPageView = () => {
      const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };

      // Store page view in local storage for basic analytics
      const existingViews = JSON.parse(localStorage.getItem('hermankwayu_pageviews') || '[]');
      existingViews.push(pageData);
      
      // Keep only last 100 page views to prevent storage bloat
      if (existingViews.length > 100) {
        existingViews.splice(0, existingViews.length - 100);
      }
      
      localStorage.setItem('hermankwayu_pageviews', JSON.stringify(existingViews));
      
      console.log('Page view tracked:', pageData);
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      let maxScroll = 0;
      const trackScroll = () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (maxScroll >= 25 && maxScroll < 50) {
            console.log('Scroll depth: 25%');
          } else if (maxScroll >= 50 && maxScroll < 75) {
            console.log('Scroll depth: 50%');
          } else if (maxScroll >= 75 && maxScroll < 100) {
            console.log('Scroll depth: 75%');
          } else if (maxScroll >= 100) {
            console.log('Scroll depth: 100%');
          }
        }
      };

      window.addEventListener('scroll', trackScroll);
      return () => window.removeEventListener('scroll', trackScroll);
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
      console.log(`Time on page: ${timeSpent} seconds`);
      
      // Store time spent
      const timeData = {
        url: window.location.href,
        timeSpent,
        timestamp: new Date().toISOString()
      };
      
      const existingTimes = JSON.parse(localStorage.getItem('hermankwayu_timespent') || '[]');
      existingTimes.push(timeData);
      
      // Keep only last 50 entries
      if (existingTimes.length > 50) {
        existingTimes.splice(0, existingTimes.length - 50);
      }
      
      localStorage.setItem('hermankwayu_timespent', JSON.stringify(existingTimes));
    };

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

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', trackTimeOnPage);
      cleanupScroll();
    };
  }, []);

  return null; // This component doesn't render anything
}

// Helper function to get analytics data (for admin use)
export const getAnalyticsData = () => {
  return {
    pageViews: JSON.parse(localStorage.getItem('hermankwayu_pageviews') || '[]'),
    timeSpent: JSON.parse(localStorage.getItem('hermankwayu_timespent') || '[]'),
    interactions: JSON.parse(localStorage.getItem('hermankwayu_interactions') || '[]')
  };
};