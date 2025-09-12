import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { ProfessionalExpertise } from "./components/ProfessionalExpertise";
import { Services } from "./components/Services";
import { Newsletter } from "./components/Newsletter";
import { Portfolio } from "./components/Portfolio";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SEO } from "./components/SEO";
import { SitemapGenerator } from "./components/SitemapGenerator";
import { SEOOptimizer } from "./components/SEOOptimizer";
import { SEODebugger } from "./components/SEODebugger";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { OptimizedLoader } from "./components/OptimizedLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProductionWrapper } from "./components/ProductionWrapper";
import { analytics } from "./components/SafeAnalytics";

import { projectId, publicAnonKey } from './utils/supabase/info';

// Lazy load heavy components for better performance
const Unsubscribe = lazy(() => import("./components/Unsubscribe").then(module => ({ default: module.Unsubscribe })));
const ResumeBuilder = lazy(() => import("./components/ResumeBuilder").then(module => ({ default: module.ResumeBuilder })));
const AdminDashboard = lazy(() => import("./components/AdminDashboard").then(module => ({ default: module.AdminDashboard })));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy").then(module => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import("./components/TermsOfService").then(module => ({ default: module.TermsOfService })));

type ViewType = 'home' | 'resume' | 'unsubscribe' | 'admin' | 'privacy' | 'terms';

interface RouteConfig {
  title: string;
  description: string;
  keywords: string;
}

const routeConfigs: Record<ViewType, RouteConfig> = {
  home: {
    title: "Herman Kwayu - Business Consultant Tanzania",
    description: "Herman Kwayu – Expert in KYC, compliance, and project management with 6+ years of experience in telecom and fintech, delivering impactful solutions.",
    keywords: "Herman Kwayu, business consultant Tanzania, digital transformation expert, strategic planning consultant, project management specialist, process optimization, KYC compliance expert, telecom consultant, fintech solutions, business analyst Africa, Dar es Salaam consultant, remote business consultant, innovation consulting, change management, growth strategy consultant"
  },
  resume: {
    title: "Free Resume Builder - CV Templates | Herman Kwayu",
    description: "Create professional resumes with our free resume builder. Choose from 4 modern templates designed for maximum impact. Build your CV in minutes - no signup required.",
    keywords: "free resume builder, professional CV templates, resume creator, job application, career tools, CV maker, resume templates, professional resume, free CV builder"
  },
  unsubscribe: {
    title: "Newsletter Unsubscribe - Herman Kwayu",
    description: "Unsubscribe from Herman Kwayu's newsletter. We respect your privacy preferences and make it easy to manage your subscription settings.",
    keywords: "newsletter unsubscribe, email preferences, privacy, Herman Kwayu newsletter"
  },
  admin: {
    title: "Admin Dashboard - Herman Kwayu",
    description: "Admin dashboard for managing website content, analytics, and system settings.",
    keywords: "admin dashboard, website management, analytics, herman kwayu admin"
  },
  privacy: {
    title: "Privacy Policy - Herman Kwayu",
    description: "Privacy policy for Herman Kwayu's website. We respect your privacy and are committed to protecting your personal information.",
    keywords: "privacy policy, data protection, personal information, Herman Kwayu privacy"
  },
  terms: {
    title: "Terms of Service - Herman Kwayu",
    description: "Terms of service for Herman Kwayu's website. Please read these terms carefully before using our services.",
    keywords: "terms of service, service agreement, user agreement, Herman Kwayu terms"
  },
  signature: {
    title: "Digital Signature - Herman Kwayu",
    description: "Professional digital signature solution for contracts, agreements, and legal documents. Create legally binding electronic signatures with timestamp and authentication.",
    keywords: "digital signature, electronic signature, contract signing, legal documents, professional signature, Herman Kwayu signature, document authentication"
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [serverWarmed, setServerWarmed] = useState(false);

  // Server warm-up for fast admin access
  useEffect(() => {
    const warmUpServer = async () => {
      if (serverWarmed) return;
      
      // Skip warm-up if no network connection
      if (!navigator.onLine) {
        console.log('⚠️ Server warm-up skipped (no network connection)');
        return;
      }
      
      try {
        // Pre-warm server immediately on app load
        const warmUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/warm`;
        
        fetch(warmUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          keepalive: true,
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }).then(() => {
          setServerWarmed(true);
          console.log('🔥 Server pre-warmed for fast admin access');
        }).catch(() => {
          // Silently ignore warm-up errors - they're expected when offline
          console.log('⚠️ Server warm-up failed (backend may be offline)');
        });
      } catch (error) {
        // Ignore warm-up errors silently
        console.log('⚠️ Server warm-up skipped (connection issues)');
      }
    };
    
    // Warm up immediately
    warmUpServer();
    
    // Re-warm every 2 minutes to prevent cold starts (only if online)
    const warmUpInterval = setInterval(() => {
      if (navigator.onLine) {
        warmUpServer();
      }
    }, 120000);
    
    return () => clearInterval(warmUpInterval);
  }, [serverWarmed]);

  // Optimized route detection 
  useEffect(() => {
    const detectRoute = (): ViewType => {
      const urlParams = new URLSearchParams(window.location.search);
      const pathname = window.location.pathname.toLowerCase();
      
      // Admin detection
      if (pathname.includes('admin') || pathname === '/admin') {
        return 'admin';
      }
      
      // Resume Builder detection
      if (pathname.includes('resume') || pathname === '/resume-builder') {
        return 'resume';
      }
      
      // Unsubscribe detection
      if (
        urlParams.has('unsubscribe') || 
        (urlParams.has('email') && urlParams.has('id')) ||
        pathname.includes('unsubscribe')
      ) {
        return 'unsubscribe';
      }
      
      // Privacy Policy detection
      if (pathname.includes('privacy') || pathname === '/privacy-policy') {
        return 'privacy';
      }
      
      // Terms of Service detection
      if (pathname.includes('terms') || pathname === '/terms-of-service') {
        return 'terms';
      }
      
      return 'home';
    };

    try {
      const route = detectRoute();
      setCurrentView(route);
      setIsInitialLoad(false);
      
      // Track page view
      analytics.trackPageView(route);
    } catch (error) {
      console.error('Route detection error:', error);
      setCurrentView('home');
      setIsInitialLoad(false);
    }

    // Handle browser back/forward navigation
    const handlePopState = () => {
      try {
        const newRoute = detectRoute();
        if (newRoute !== currentView) {
          setIsLoading(true);
          setTimeout(() => {
            setCurrentView(newRoute);
            setIsLoading(false);
            
            // Track page view for navigation
            analytics.trackPageView(newRoute);
            
            // Scroll to top for new views
            if (newRoute !== 'home') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 100); // Reduced delay for better performance
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setCurrentView('home');
        setIsLoading(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Listen for custom navigation events
    const handleNavigate = (event: CustomEvent<{ view: ViewType }>) => {
      navigateToView(event.detail.view);
    };

    window.addEventListener('navigate-to-resume', handleNavigate as EventListener);
    window.addEventListener('navigate-to-admin', handleNavigate as EventListener);
    window.addEventListener('navigate-to-privacy', handleNavigate as EventListener);
    window.addEventListener('navigate-to-terms', handleNavigate as EventListener);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate-to-resume', handleNavigate as EventListener);
      window.removeEventListener('navigate-to-admin', handleNavigate as EventListener);
      window.removeEventListener('navigate-to-privacy', handleNavigate as EventListener);
      window.removeEventListener('navigate-to-terms', handleNavigate as EventListener);
    };
  }, [currentView]);

  const navigateToView = (view: ViewType) => {
    if (view === currentView) return;
    
    try {
      setIsLoading(true);
      
      // Update URL based on view
      const urls = {
        home: '/',
        resume: '/resume-builder',
        unsubscribe: '/unsubscribe',
        admin: '/admin',
        privacy: '/privacy-policy',
        terms: '/terms-of-service'
      };
      
      window.history.pushState({ view }, '', urls[view]);
      
      // Faster transition
      setTimeout(() => {
        setCurrentView(view);
        setIsLoading(false);
        
        // Track page view for programmatic navigation
        analytics.trackPageView(view);
        
        // Scroll to top for new views
        if (view !== 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigateToView('home');
  };

  // Show initial loading state
  if (isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const currentConfig = routeConfigs[currentView];

  return (
    <ErrorBoundary>
      <ProductionWrapper>
        <div className="min-h-screen">
          <SEO 
            title={currentConfig.title}
            description={currentConfig.description}
            keywords={currentConfig.keywords}
          />
        
          {currentView === 'home' && (
            <>
              <SitemapGenerator />
              <SEOOptimizer />
            </>
          )}

          {/* Loading overlay for smooth transitions */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Home Route */}
          {currentView === 'home' && (
            <>
              <Header />
              <main>
                <Hero />
                <About />
                <Services 
                  onNavigateToResume={() => navigateToView('resume')} 
                />
                <Newsletter />
                <Contact />
                <Portfolio />
                {/* Testimonials section ready for future activation */}
                {/* <Testimonials /> */}
              </main>
              <Footer />
            </>
          )}

          {/* Resume Builder Route */}
          {currentView === 'resume' && (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <OptimizedLoader size="lg" message="Loading Resume Builder..." />
              </div>
            }>
              <ResumeBuilder onBack={handleBackToHome} />
            </Suspense>
          )}

          {/* Unsubscribe Route */}
          {currentView === 'unsubscribe' && (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <OptimizedLoader size="lg" message="Loading..." />
              </div>
            }>
              <Unsubscribe />
            </Suspense>
          )}

          {/* Admin Route */}
          {currentView === 'admin' && (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <OptimizedLoader size="lg" message="Loading Admin Dashboard..." />
              </div>
            }>
              <AdminDashboard 
                isVisible={true}
                onClose={handleBackToHome}
              />
            </Suspense>
          )}

          {/* Privacy Policy Route */}
          {currentView === 'privacy' && (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <OptimizedLoader size="lg" message="Loading Privacy Policy..." />
              </div>
            }>
              <PrivacyPolicy onBack={handleBackToHome} />
            </Suspense>
          )}

          {/* Terms of Service Route */}
          {currentView === 'terms' && (
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <OptimizedLoader size="lg" message="Loading Terms of Service..." />
              </div>
            }>
              <TermsOfService onBack={handleBackToHome} />
            </Suspense>
          )}
        </div>
      </ProductionWrapper>
    </ErrorBoundary>
  );
}