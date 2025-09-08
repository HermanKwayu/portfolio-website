import { useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  resumeActions: {
    builderVisited: boolean;
    templateSelected?: string;
    resumeCreated: boolean;
    resumeDownloaded: boolean;
    createdAt?: number;
    downloadedAt?: number;
  };
  source?: string;
  referrer?: string;
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private session: UserSession;
  private apiEndpoint: string;
  private isEnabled: boolean = false;
  private hasWarnedAboutFailure: boolean = false;

  constructor() {
    // Set up the correct API endpoint using Supabase project info
    this.apiEndpoint = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/analytics`;
    
    // ONLY enable analytics in production
    this.isEnabled = process.env.NODE_ENV === 'production';
    
    // Initialize session (safe even when disabled)
    this.session = this.initializeSession();
    
    if (this.isEnabled) {
      this.startTracking();
    }
  }

  private initializeSession(): UserSession {
    const existingSession = localStorage.getItem('hk_analytics_session');
    const sessionId = this.generateSessionId();

    if (existingSession) {
      try {
        const parsed = JSON.parse(existingSession);
        // Update last activity
        parsed.lastActivity = Date.now();
        localStorage.setItem('hk_analytics_session', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        // Create new session if parsing fails
      }
    }

    // Create new session
    const newSession: UserSession = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 1,
      resumeActions: {
        builderVisited: false,
        resumeCreated: false,
        resumeDownloaded: false
      },
      source: this.getTrafficSource(),
      referrer: document.referrer || 'direct',
      device: this.detectDevice()
    };

    localStorage.setItem('hk_analytics_session', JSON.stringify(newSession));
    return newSession;
  }

  private generateSessionId(): string {
    return 'hk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getTrafficSource(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const referrer = document.referrer;

    if (utmSource) return utmSource;
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('linkedin')) return 'linkedin';
    if (referrer.includes('twitter')) return 'twitter';
    if (referrer.includes('facebook')) return 'facebook';
    if (referrer) return 'referral';
    return 'direct';
  }

  private detectDevice(): UserSession['device'] {
    const ua = navigator.userAgent;
    let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      type = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      type = 'mobile';
    }

    return {
      type,
      os: this.getOS(),
      browser: this.getBrowser()
    };
  }

  private getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private startTracking() {
    // NEVER start tracking in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', { timestamp: Date.now() });
      } else {
        this.track('page_visible', { timestamp: Date.now() });
        this.updateSession();
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      if (!this.isEnabled) return;
      
      this.track('session_end', {
        sessionDuration: Date.now() - this.session.startTime,
        pageViews: this.session.pageViews,
        resumeActions: this.session.resumeActions
      });
      
      // Only try to send if we're in production and have events
      if (process.env.NODE_ENV === 'production' && this.events.length > 0) {
        // Use sendBeacon for reliable event sending on page unload (no CORS issues)
        if (navigator.sendBeacon) {
          try {
            const blob = new Blob([JSON.stringify({
              events: this.events,
              session: this.session
            })], { type: 'application/json' });
            navigator.sendBeacon(this.apiEndpoint, blob);
          } catch (e) {
            // Silently fail on page unload - don't use regular fetch as it may be cancelled
            console.debug('Analytics: sendBeacon failed on page unload');
          }
        }
      }
    });

    // Send events periodically (only if we have events to send and in production)
    setInterval(() => {
      if (process.env.NODE_ENV === 'production' && this.events.length > 0) {
        this.sendPendingEvents();
      }
    }, 60000); // Send every 60 seconds (reduced frequency)

    // Track initial page load
    this.trackPageView();
  }

  private updateSession() {
    this.session.lastActivity = Date.now();
    this.session.pageViews++;
    localStorage.setItem('hk_analytics_session', JSON.stringify(this.session));
  }

  public track(eventName: string, properties: Record<string, any> = {}) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    // Don't track if analytics is disabled
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      event: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        path: window.location.pathname,
        sessionId: this.session.sessionId,
        device: this.session.device,
        source: this.session.source,
        referrer: this.session.referrer
      },
      timestamp: Date.now(),
      sessionId: this.session.sessionId
    };

    this.events.push(event);

    // Send critical events immediately (production only)
    if (['resume_downloaded', 'contact_form_submitted', 'session_end'].includes(eventName)) {
      this.sendPendingEvents();
    }
  }

  public trackPageView(page?: string) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    this.updateSession();
    this.track('page_view', {
      page: page || window.location.pathname,
      title: document.title,
      timestamp: Date.now()
    });
  }

  public enableAnalytics() {
    if (process.env.NODE_ENV === 'development') {
      this.isEnabled = true;
      this.startTracking();
      console.log('📊 Analytics enabled (development mode only)');
    } else {
      console.log('📊 Analytics are automatically enabled in production');
    }
  }

  public disableAnalytics() {
    if (process.env.NODE_ENV === 'development') {
      this.isEnabled = false;
      this.events = []; // Clear pending events
      console.log('📊 Analytics disabled');
    } else {
      console.log('📊 Analytics cannot be disabled in production');
    }
  }

  public isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  public trackResumeBuilderVisit() {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    if (!this.session.resumeActions.builderVisited) {
      this.session.resumeActions.builderVisited = true;
      localStorage.setItem('hk_analytics_session', JSON.stringify(this.session));
      
      this.track('resume_builder_visited', {
        firstVisit: true,
        timestamp: Date.now()
      });
    } else {
      this.track('resume_builder_revisited', {
        timestamp: Date.now()
      });
    }
  }

  public trackResumeTemplateSelected(templateId: string, templateName: string) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    this.session.resumeActions.templateSelected = templateId;
    localStorage.setItem('hk_analytics_session', JSON.stringify(this.session));

    this.track('resume_template_selected', {
      templateId,
      templateName,
      timestamp: Date.now()
    });
  }

  public trackResumeCreated(templateId: string, templateName: string, hasContent: boolean = true) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    this.session.resumeActions.resumeCreated = true;
    this.session.resumeActions.createdAt = Date.now();
    localStorage.setItem('hk_analytics_session', JSON.stringify(this.session));

    this.track('resume_created', {
      templateId,
      templateName,
      hasContent,
      timeFromStart: Date.now() - this.session.startTime,
      timestamp: Date.now()
    });
  }

  public trackResumeDownloaded(templateId: string, templateName: string, format: string = 'PDF') {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    const wasCreated = this.session.resumeActions.resumeCreated;
    const timeFromCreation = this.session.resumeActions.createdAt 
      ? Date.now() - this.session.resumeActions.createdAt 
      : 0;

    this.session.resumeActions.resumeDownloaded = true;
    this.session.resumeActions.downloadedAt = Date.now();
    localStorage.setItem('hk_analytics_session', JSON.stringify(this.session));

    this.track('resume_downloaded', {
      templateId,
      templateName,
      format,
      wasCreated,
      timeFromCreation,
      timeFromStart: Date.now() - this.session.startTime,
      timestamp: Date.now()
    });
  }

  public trackUserInteraction(element: string, action: string, properties: Record<string, any> = {}) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    this.track('user_interaction', {
      element,
      action,
      ...properties,
      timestamp: Date.now()
    });
  }

  public trackFormSubmission(formType: string, success: boolean, properties: Record<string, any> = {}) {
    // NEVER track in development - period
    if (process.env.NODE_ENV === 'development') return;
    
    if (!this.isEnabled) return;
    
    this.track('form_submission', {
      formType,
      success,
      ...properties,
      timestamp: Date.now()
    });
  }

  private async sendPendingEvents() {
    // ABSOLUTELY NO NETWORK REQUESTS IN DEVELOPMENT - PERIOD
    if (process.env.NODE_ENV === 'development') {
      this.events = []; // Clear events silently
      return;
    }

    // No network requests if disabled or no events
    if (!this.isEnabled || this.events.length === 0) {
      this.events = [];
      return;
    }

    // Double check we're in production before any network activity
    if (process.env.NODE_ENV !== 'production') {
      this.events = [];
      return;
    }

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced to 5 seconds

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          events: eventsToSend,
          session: this.session
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`📊 Analytics: Successfully sent ${eventsToSend.length} events`);
        this.hasWarnedAboutFailure = false;
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Only log once per session to avoid spam
      if (!this.hasWarnedAboutFailure) {
        console.debug('📊 Analytics: Network request failed - events will be queued for retry');
        this.hasWarnedAboutFailure = true;
      }
      
      // Only retry in production and if we don't have too many queued events
      if (process.env.NODE_ENV === 'production' && this.events.length < 20) {
        this.events.unshift(...eventsToSend.slice(0, 5)); // Only retry first 5 events
      }
    }
  }

  public getSessionData(): UserSession {
    return { ...this.session };
  }

  public getConversionFunnel(): {
    totalVisitors: number;
    resumeBuilderVisitors: number;
    resumeCreators: number;
    resumeDownloaders: number;
    conversionRates: {
      visitorToBuilder: number;
      builderToCreator: number;
      creatorToDownloader: number;
      visitorToDownloader: number;
    };
  } {
    const sessionData = this.getSessionData();
    
    // This would typically come from your analytics API
    // For now, return current session data
    const totalVisitors = 1;
    const resumeBuilderVisitors = sessionData.resumeActions.builderVisited ? 1 : 0;
    const resumeCreators = sessionData.resumeActions.resumeCreated ? 1 : 0;
    const resumeDownloaders = sessionData.resumeActions.resumeDownloaded ? 1 : 0;

    return {
      totalVisitors,
      resumeBuilderVisitors,
      resumeCreators,
      resumeDownloaders,
      conversionRates: {
        visitorToBuilder: resumeBuilderVisitors / totalVisitors,
        builderToCreator: resumeBuilderVisitors > 0 ? resumeCreators / resumeBuilderVisitors : 0,
        creatorToDownloader: resumeCreators > 0 ? resumeDownloaders / resumeCreators : 0,
        visitorToDownloader: resumeDownloaders / totalVisitors
      }
    };
  }
}

// Global analytics instance - created lazily to avoid SSR issues
let analyticsInstance: AnalyticsTracker | null = null;

export const analytics = {
  getInstance(): AnalyticsTracker | DummyAnalyticsTracker {
    // Only create real analytics in production
    if (process.env.NODE_ENV === 'production') {
      if (!analyticsInstance && typeof window !== 'undefined') {
        analyticsInstance = new AnalyticsTracker();
      }
      return analyticsInstance || new DummyAnalyticsTracker();
    }
    // Always return dummy in development
    return new DummyAnalyticsTracker();
  },
  
  // Proxy all methods to the instance
  track: (eventName: string, properties: Record<string, any> = {}) => 
    analytics.getInstance().track(eventName, properties),
  trackPageView: (page?: string) => 
    analytics.getInstance().trackPageView(page),
  trackResumeBuilderVisit: () => 
    analytics.getInstance().trackResumeBuilderVisit(),
  trackResumeTemplateSelected: (templateId: string, templateName: string) =>
    analytics.getInstance().trackResumeTemplateSelected(templateId, templateName),
  trackResumeCreated: (templateId: string, templateName: string, hasContent?: boolean) =>
    analytics.getInstance().trackResumeCreated(templateId, templateName, hasContent),
  trackResumeDownloaded: (templateId: string, templateName: string, format?: string) =>
    analytics.getInstance().trackResumeDownloaded(templateId, templateName, format),
  trackUserInteraction: (element: string, action: string, properties?: Record<string, any>) =>
    analytics.getInstance().trackUserInteraction(element, action, properties),
  trackFormSubmission: (formType: string, success: boolean, properties?: Record<string, any>) =>
    analytics.getInstance().trackFormSubmission(formType, success, properties),
  enableAnalytics: () => 
    analytics.getInstance().enableAnalytics(),
  disableAnalytics: () => 
    analytics.getInstance().disableAnalytics(),
  isAnalyticsEnabled: () => 
    analytics.getInstance().isAnalyticsEnabled(),
  getSessionData: () => 
    analytics.getInstance().getSessionData(),
  getConversionFunnel: () => 
    analytics.getInstance().getConversionFunnel()
};

// Dummy tracker for when analytics is disabled or in SSR
class DummyAnalyticsTracker {
  track() {}
  trackPageView() {}
  trackResumeBuilderVisit() {}
  trackResumeTemplateSelected() {}
  trackResumeCreated() {}
  trackResumeDownloaded() {}
  trackUserInteraction() {}
  trackFormSubmission() {}
  enableAnalytics() {}
  disableAnalytics() {}
  isAnalyticsEnabled() { return false; }
  getSessionData() { 
    return {
      sessionId: 'dummy',
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      resumeActions: {
        builderVisited: false,
        resumeCreated: false,
        resumeDownloaded: false
      },
      device: { type: 'desktop' as const }
    };
  }
  getConversionFunnel() {
    return {
      totalVisitors: 0,
      resumeBuilderVisitors: 0,
      resumeCreators: 0,
      resumeDownloaders: 0,
      conversionRates: {
        visitorToBuilder: 0,
        builderToCreator: 0,
        creatorToDownloader: 0,
        visitorToDownloader: 0
      }
    };
  }
}

// Debug helper - COMPLETELY DISABLED in development 
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Only show simple status message once per session
  const hasLoggedStatus = sessionStorage.getItem('comprehensive_analytics_status_logged');
  if (!hasLoggedStatus) {
    console.log('📊 ComprehensiveAnalytics: DISABLED (Development Mode) - Zero network requests');
    sessionStorage.setItem('comprehensive_analytics_status_logged', 'true');
  }
}

export function ComprehensiveAnalytics() {
  // Absolutely no rendering or execution in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Get the actual instance to check if enabled
    const analyticsInstance = analytics.getInstance();
    
    // Completely skip if analytics is not enabled
    if (!analyticsInstance.isAnalyticsEnabled()) {
      return;
    }

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track scroll milestones
        if (scrollPercent >= 25 && maxScroll < 25) {
          analyticsInstance.track('scroll_depth', { depth: '25%' });
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          analyticsInstance.track('scroll_depth', { depth: '50%' });
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          analyticsInstance.track('scroll_depth', { depth: '75%' });
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          analyticsInstance.track('scroll_depth', { depth: '90%' });
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    const trackTimeOnPage = () => {
      const timeSpent = Date.now() - startTime;
      analyticsInstance.track('time_on_page', { 
        timeSpent: Math.round(timeSpent / 1000),
        page: window.location.pathname 
      });
    };

    // Event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);

    // Track clicks on important elements
    const trackClicks = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        analyticsInstance.trackUserInteraction('button', 'click', {
          buttonText: button?.textContent?.trim() || 'Unknown',
          buttonId: button?.id || 'no-id',
          buttonClass: button?.className || 'no-class'
        });
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        analyticsInstance.trackUserInteraction('link', 'click', {
          linkText: link?.textContent?.trim() || 'Unknown',
          linkHref: (link as HTMLAnchorElement)?.href || 'no-href',
          isExternal: (link as HTMLAnchorElement)?.hostname !== window.location.hostname
        });
      }
    };

    document.addEventListener('click', trackClicks);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', trackClicks);
      trackTimeOnPage(); // Final time tracking
    };
  }, []);

  return null; // This component doesn't render anything
}