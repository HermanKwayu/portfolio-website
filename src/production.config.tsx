/**
 * Production Configuration
 * Centralized configuration for production deployment
 */

export const PRODUCTION_CONFIG = {
  // Performance settings
  PERFORMANCE: {
    LAZY_LOAD_DELAY: 100,
    API_TIMEOUT: 10000,
    BACKGROUND_REFRESH_INTERVAL: 120000, // 2 minutes
    SESSION_TIMEOUT: 4 * 60 * 60 * 1000, // 4 hours
    WARNING_TIME: 5 * 60 * 1000, // 5 minutes before logout
    CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes
  },

  // Error handling
  ERROR_HANDLING: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    FALLBACK_ENABLED: true,
    SUPPRESS_PATTERNS: [
      'analytics',
      'tracking', 
      'Failed to fetch',
      'batch dashboard',
      'dashboard-data',
      'admin/authenticate',
      'make-server-4d80a1b0',
      'Network Error',
      'timeout'
    ]
  },

  // Logging
  LOGGING: {
    PRODUCTION_LOG_LEVEL: 'warn', // Only log warnings and errors in production
    MAX_LOG_ENTRIES: 100,
    CONSOLE_ENABLED: process.env.NODE_ENV === 'development',
    PERFORMANCE_THRESHOLD: 1000, // Log operations over 1 second
    API_SLOW_THRESHOLD: 2000, // Log API calls over 2 seconds
  },

  // Features
  FEATURES: {
    DEMO_MODE_DEFAULT: true, // Start in demo mode for instant loading
    SEO_OPTIMIZATION: true,
    ANALYTICS_ENABLED: process.env.NODE_ENV === 'production',
    ERROR_REPORTING: process.env.NODE_ENV === 'production',
    ACCESSIBILITY_TOOLS: process.env.NODE_ENV === 'development',
  },

  // API Configuration
  API: {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://ugyhqxxevikymkhmaqir.supabase.co/functions/v1/make-server-4d80a1b0'
      : 'http://localhost:54321/functions/v1/make-server-4d80a1b0',
    DEFAULT_HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    RETRY_CONFIG: {
      retries: 3,
      retryDelay: 1000,
      retryCondition: (error: any) => {
        return error.response?.status >= 500 || !error.response;
      }
    }
  },

  // Security
  SECURITY: {
    ADMIN_TOKEN: 'herman_admin_2024_secure_token',
    SESSION_STORAGE_KEY: 'herman_admin_session',
    CSRF_PROTECTION: true,
    SECURE_HEADERS: true,
  },

  // UI/UX
  UI: {
    ANIMATION_DURATION: 300,
    LOADING_DELAY: 200,
    TOAST_DURATION: 5000,
    PAGE_TRANSITION_DELAY: 100,
    SKELETON_LOADING: true,
  },

  // SEO
  SEO: {
    ENABLE_SITEMAP: true,
    ENABLE_ROBOTS: true,
    ENABLE_STRUCTURED_DATA: true,
    META_REFRESH_INTERVAL: 30000, // 30 seconds
  }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  // Production-specific settings
  PRODUCTION_CONFIG.LOGGING.CONSOLE_ENABLED = false;
  PRODUCTION_CONFIG.FEATURES.ACCESSIBILITY_TOOLS = false;
}

// Helper functions
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';

// Get configuration value with fallback
export const getConfig = (path: string, fallback?: any) => {
  try {
    const keys = path.split('.');
    let value = PRODUCTION_CONFIG as any;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return fallback;
      }
    }
    
    return value;
  } catch {
    return fallback;
  }
};

export default PRODUCTION_CONFIG;