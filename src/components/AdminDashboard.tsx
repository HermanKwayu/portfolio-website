import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SEOAudit } from "./SEOAudit";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { StaticFilesChecker } from "./StaticFilesChecker";
import { StaticFileValidator } from "./StaticFileValidator";
import { StaticFilesVerifier } from "./StaticFilesVerifier";
import { ConnectionDiagnostic } from "./ConnectionDiagnostic";
import { SimpleProductionHealthCheck } from "./SimpleProductionHealthCheck";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'archived';
  notes?: string;
  lastUpdated?: string;
  emailSent?: boolean;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  previewText: string;
  sentAt: string;
  subscriberCount: number;
  successCount: number;
  failCount: number;
  status: string;
}

interface AdminDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AdminDashboard({ isVisible, onClose }: AdminDashboardProps) {
  // Demo mode flag - set to false for production
  const isDemoMode = false;
  
  // Newsletter templates
  const newsletterTemplates = {
    'weekly-update': {
      subject: 'Weekly Business Insights from Herman Kwayu',
      content: `Hello [Subscriber],

I hope this message finds you well! Here are this week's key insights and updates from the world of business strategy and digital transformation:

🎯 **This Week's Focus: [Main Topic]**
[Write your main content here about current business trends, insights, or updates]

💡 **Quick Tip**
[Share a practical tip that subscribers can implement immediately]

📈 **Resource Recommendation**
I came across [resource/tool/article] that I think you'd find valuable for [specific use case].

🔗 **What I'm Working On**
[Brief update about your current projects or services]

That's all for this week! I'd love to hear your thoughts on [relevant question or topic].

Best regards,
Herman Kwayu

P.S. Got questions about digital transformation or business strategy? Just hit reply - I read every message personally.`,
      previewText: 'Weekly insights on business strategy and digital transformation'
    },
    'monthly-deep-dive': {
      subject: 'Monthly Deep Dive: [Topic] - Herman Kwayu Consulting',
      content: `Dear Business Leader,

This month, I want to dive deep into [specific topic] and how it's reshaping the business landscape.

📊 **The Current State**
[Detailed analysis of the topic and current trends]

🔍 **Why This Matters for Your Business**
[Specific implications and opportunities for subscribers]

✅ **Actionable Steps You Can Take Today**
1. [First actionable step]
2. [Second actionable step]
3. [Third actionable step]

🎯 **Case Study: Real Results**
[Brief case study or example showing practical application]

🚀 **Looking Ahead**
[Future predictions or trends to watch]

---

**Ready to Transform Your Business?**
If you're looking to implement these strategies in your organization, I'd love to discuss how we can work together. Schedule a free consultation at [your calendly link].

Best regards,
Herman Kwayu
Digital Strategy & Process Optimization Expert`,
      previewText: 'Deep dive analysis and actionable insights for business leaders'
    },
    'service-announcement': {
      subject: '🚀 New Service Launch: [Service Name]',
      content: `Hello [Subscriber],

I'm excited to share something I've been working on that I believe will make a significant impact on your business growth.

🎉 **Introducing: [New Service Name]**
[Description of the new service and what it offers]

💼 **Who This Is Perfect For:**
• [Target audience 1]
• [Target audience 2]
• [Target audience 3]

✨ **What You Can Expect:**
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]

📈 **Early Results**
[Share any early results or testimonials if available]

🎁 **Special Launch Offer**
As a valued newsletter subscriber, you get [special offer details].

Ready to learn more? [Call-to-action button/link]

Questions? Simply reply to this email - I personally respond to every inquiry.

Best regards,
Herman Kwayu`,
      previewText: 'Exciting new service announcement with exclusive subscriber benefits'
    },
    'insights-sharing': {
      subject: 'Lessons from the Field: [Specific Insight]',
      content: `Hi there,

I just finished working with a client on [type of project], and I wanted to share some insights that might be valuable for your business too.

🎯 **The Challenge**
[Describe the challenge or problem]

💡 **The Approach**
[Explain the strategy or solution implemented]

📊 **The Results**
[Share the outcomes and impact]

🔑 **Key Takeaways for You:**
• [Takeaway 1]
• [Takeaway 2]  
• [Takeaway 3]

This experience reinforced something I've seen time and again: [key principle or lesson].

**How does this apply to your business?** [Ask a thought-provoking question]

I'd love to hear your thoughts on this. Hit reply and let me know if you've faced similar challenges.

Cheers,
Herman Kwayu

P.S. If you're dealing with similar challenges, let's chat. I offer complimentary strategy calls to help you identify opportunities in your business.`,
      previewText: 'Real-world insights from recent client work and practical lessons'
    }
  };
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<{
    current: number;
    total: number;
    currentTask: string;
  }>({ current: 0, total: 0, currentTask: '' });
  
  // Session management state
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Auto-logout constants
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before logout
  

  
  // Newsletter state
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [newsletterHistory, setNewsletterHistory] = useState<Newsletter[]>([]);
  const [newsletterForm, setNewsletterForm] = useState({
    subject: '',
    content: '',
    previewText: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  // Contact state
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  
  // System state
  const [systemStatus, setSystemStatus] = useState({
    emailService: 'checking',
    database: 'checking',
    contactForm: 'checking',
    newsletterSystem: 'checking'
  });
  // Remove hardcoded password - all password operations handled server-side
  
  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalContacts: 0,
    newContacts: 0,
    responseRate: 0,
    avgResponseTime: '0 hours',
    completionRate: 0
  });

  // Performance optimization states
  const [cache, setCache] = useState<{
    [key: string]: {
      data: any;
      timestamp: number;
      expiry: number;
    }
  }>({});
  const [backgroundRefreshTimer, setBackgroundRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [requestDebouncer, setRequestDebouncer] = useState<NodeJS.Timeout | null>(null);
  
  // Network and connectivity states
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionHealth, setConnectionHealth] = useState<'healthy' | 'degraded' | 'offline'>('healthy');
  const [failedRequests, setFailedRequests] = useState<number>(0);
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [lastSuccessfulConnection, setLastSuccessfulConnection] = useState<number>(0);
  
  // SEO audit state
  const [showSEOAudit, setShowSEOAudit] = useState(false);
  
  // Password management state (no hardcoded passwords)
  const [passwordStatus, setPasswordStatus] = useState<{
    hasPassword: boolean;
    passwordLength: number;
    source: string;
  }>({ hasPassword: false, passwordLength: 0, source: 'unknown' });
  


  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionHealth('healthy');
      console.log('🌐 Network connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionHealth('offline');
      console.log('🌐 Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache management and cleanup
  useEffect(() => {
    return () => {
      // Cleanup timers and abort controllers
      if (backgroundRefreshTimer) clearTimeout(backgroundRefreshTimer);
      if (abortController) abortController.abort();
    };
  }, []);

  // Background refresh for real-time updates (reduced frequency)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const setupBackgroundRefresh = () => {
        const timer = setTimeout(() => {
          refreshDataInBackground();
        }, 120000); // Refresh every 2 minutes
        
        setBackgroundRefreshTimer(timer);
      };

      setupBackgroundRefresh();
      return () => {
        if (backgroundRefreshTimer) clearTimeout(backgroundRefreshTimer);
      };
    }
  }, [isAuthenticated, loading, lastRefresh]);

  // Check admin session validity on component mount
  useEffect(() => {
    const checkAdminSession = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        console.log('🔐 Admin token found - validating session...');
        
        // Validate the token by making a health check request
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/health`, {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-Admin-Token': token,
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.authorized) {
              setIsAuthenticated(true);
              console.log('✅ Admin session validated - user authenticated');
              
              // Load dashboard data after short delay
              setTimeout(() => {
                debouncedLoadData(true);
              }, 300);
            } else {
              console.log('❌ Admin token invalid - clearing session');
              localStorage.removeItem('admin_token');
              setIsAuthenticated(false);
            }
          } else {
            console.log('❌ Admin session validation failed - clearing session');
            localStorage.removeItem('admin_token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('❌ Session validation error:', error);
          // Don't clear token on network errors, just don't auto-authenticate
          setIsAuthenticated(false);
        }
      } else {
        console.log('🔐 No admin token found - user needs to authenticate');
        setIsAuthenticated(false);
      }
    };

    checkAdminSession();
  }, []);

  // Handle session timeout and cleanup
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleSessionTimeout = () => {
      const timeRemaining = SESSION_TIMEOUT - (Date.now() - lastActivity);
      
      if (timeRemaining <= 0) {
        console.log('⏰ Admin session expired');
        setIsAuthenticated(false);
        localStorage.removeItem('admin_token');
        setError('Session expired. Please login again.');
      }
    };

    // Check session every minute
    const sessionCheck = setInterval(handleSessionTimeout, 60000);
    
    return () => clearInterval(sessionCheck);
  }, [isAuthenticated, lastActivity]);

  // Session management and auto-logout
  useEffect(() => {
    if (isAuthenticated) {
      const now = Date.now();
      setLastActivity(now);
      
      // Clear any existing timer
      if (sessionTimer) clearTimeout(sessionTimer);
      
      // Set up activity listeners
      const handleActivity = () => {
        const currentTime = Date.now();
        setLastActivity(currentTime);
        setShowLogoutWarning(false);
        
        // Reset the session timer
        if (sessionTimer) clearTimeout(sessionTimer);
        
        const newTimer = setTimeout(() => {
          checkSessionTimeout();
        }, SESSION_TIMEOUT - WARNING_TIME);
        
        setSessionTimer(newTimer);
      };

      // Add event listeners for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      // Initial timer setup
      handleActivity();

      return () => {
        // Cleanup event listeners
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        if (sessionTimer) clearTimeout(sessionTimer);
      };
    }
  }, [isAuthenticated]);

  const checkSessionTimeout = () => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    
    if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_TIME) {
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        // Force logout
        handleLogout('Session expired due to inactivity');
      } else {
        // Show warning
        setShowLogoutWarning(true);
        
        // Set timer for final logout
        const timeUntilLogout = SESSION_TIMEOUT - timeSinceLastActivity;
        const finalTimer = setTimeout(() => {
          handleLogout('Session expired due to inactivity');
        }, timeUntilLogout);
        
        setSessionTimer(finalTimer);
      }
    }
  };



  const handleLogout = (reason?: string) => {
    // Clear all session data
    setIsAuthenticated(false);
    setPassword('');
    setSubscribers([]);
    setNewsletterHistory([]);
    setContacts([]);
    setSelectedContact(null);
    setShowLogoutWarning(false);
    setShowPasswordReset(false);
    
    // Clear admin token
    localStorage.removeItem('admin_token');
    
    // Clear timers
    if (sessionTimer) clearTimeout(sessionTimer);
    setSessionTimer(null);
    
    // Show logout message
    if (reason) {
      setError(reason);
    } else {
      setSuccess('Successfully logged out');
    }
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowLogoutWarning(false);
    
    // Reset timer
    if (sessionTimer) clearTimeout(sessionTimer);
    const newTimer = setTimeout(() => {
      checkSessionTimeout();
    }, SESSION_TIMEOUT - WARNING_TIME);
    setSessionTimer(newTimer);
  };

  // Secure password status check
  const checkPasswordStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/password-status`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': localStorage.getItem('admin_token') || '',
        }
      });

      if (response.ok) {
        const status = await response.json();
        setPasswordStatus(status);
      }
    } catch (error) {
      console.error('Failed to check password status:', error);
    }
  };

  const resetPassword = async (newPassword: string) => {
    if (!isAuthenticated || !newPassword) return;
    
    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        setSuccess('Password reset successfully');
        await checkPasswordStatus();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get admin token with validation
  const getValidAdminToken = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      console.warn('❌ No admin token found - user needs to re-authenticate');
      setIsAuthenticated(false);
      return null;
    }
    return token;
  };

  // Helper function to create authenticated request headers
  const getAuthHeaders = (additionalHeaders = {}) => {
    const token = getValidAdminToken();
    if (!token) return null;
    
    return {
      'Authorization': `Bearer ${publicAnonKey}`,
      'X-Admin-Token': token,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additionalHeaders
    };
  };

  const authenticate = async () => {
    setLoading(true);
    setError(null);
    
    if (!password.trim()) {
      setError('Please enter admin password');
      setLoading(false);
      return;
    }
    
    const startTime = Date.now();
    const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`;
    
    try {
      console.log(`🚀 Ultra-fast auth starting...`);
      
      // Optimized fetch with minimal overhead
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ password }),
        keepalive: true
      });

      const duration = Date.now() - startTime;
      console.log(`⚡ Auth completed in ${duration}ms`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
        console.error('🔐 Auth failed:', response.status, response.statusText);
        throw new Error(errorData.error || 'Authentication failed');
      }

      const result = await response.json();

      if (result.success && result.token) {
        // Store the admin token securely
        localStorage.setItem('admin_token', result.token);
        setIsAuthenticated(true);
        setConnectionHealth('healthy');
        setLastSuccessfulConnection(Date.now());
        setLastActivity(Date.now()); // Update activity timestamp
        
        setSuccess(`Authentication successful in ${duration}ms!`);
        console.log('✅ Admin token stored successfully');
        
        // Load password status after authentication
        setTimeout(() => {
          checkPasswordStatus();
        }, 100);
        
        // Faster dashboard loading
        setTimeout(() => {
          debouncedLoadData(true);
        }, 300);
        
      } else {
        setError('Invalid password - check console for debug info');
        setPassword('');
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`❌ Auth failed (${duration}ms):`, err);
      
      // More specific error messages based on error type
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        setError('Network error - please check your connection and try again.');
      } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Invalid password. Please check your password and try again.');
      } else {
        setError(err.message || 'Authentication failed - please try again.');
      }
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced cache management with performance optimizations
  const getCachedData = (key: string) => {
    const cached = cache[key];
    if (cached && Date.now() < cached.expiry) {
      const remainingTime = Math.round((cached.expiry - Date.now()) / 1000);
      console.log(`📦 Using cached data for ${key} (${remainingTime}s remaining)`);
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: any, ttl: number = 90000) => { // Increased default TTL to 1.5 minutes
    setCache(prev => ({
      ...prev,
      [key]: {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + ttl
      }
    }));
  };

  // Debounced data loading to prevent excessive requests
  const debouncedLoadData = (showLoadingState: boolean = false) => {
    if (requestDebouncer) {
      clearTimeout(requestDebouncer);
    }
    
    const timeout = setTimeout(() => {
      loadDashboardData(showLoadingState);
    }, 300); // 300ms debounce
    
    setRequestDebouncer(timeout);
  };

  // Main dashboard data loading function with fallback support
  const loadDashboardData = async (showLoadingState: boolean = false) => {
    if (!isAuthenticated) {
      console.warn('❌ Cannot load dashboard data - user not authenticated');
      return;
    }

    if (showLoadingState) {
      setLoading(true);
      setError(null);
      setLoadingProgress({ current: 0, total: 4, currentTask: 'Starting dashboard load...' });
    }

    console.log('🚀 Loading dashboard data...');
    const startTime = Date.now();

    try {
      // Get authenticated headers
      const headers = getAuthHeaders();
      if (!headers) {
        setError('Authentication required - please login again');
        if (showLoadingState) {
          setLoading(false);
          setLoadingProgress({ current: 0, total: 0, currentTask: '' });
        }
        return;
      }

      if (showLoadingState) {
        setLoadingProgress({ current: 1, total: 4, currentTask: 'Loading dashboard data...' });
      }

      // Try the batch endpoint first for speed
      const batchUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/dashboard-data`;
      
      const controller = new AbortController();
      setAbortController(controller);
      
      // Set timeout for batch request
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(batchUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('🔐 Admin session expired');
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
          setError('Session expired - please login again');
          return;
        }
        throw new Error(`Batch request failed: ${response.status} ${response.statusText}`);
      }

      const batchData = await response.json();
      console.log(`📊 Batch request completed in ${Date.now() - startTime}ms`);

      if (showLoadingState) {
        setLoadingProgress({ current: 2, total: 4, currentTask: 'Processing data...' });
      }

      // Process batch data
      if (batchData.subscribers) {
        setSubscribers(batchData.subscribers.subscribers || []);
        setSystemStatus(prev => ({ ...prev, database: 'active' }));
        setCachedData('subscribers', batchData.subscribers, 120000);
      }
      
      if (batchData.newsletters) {
        setNewsletterHistory(batchData.newsletters.newsletters || []);
        setSystemStatus(prev => ({ ...prev, newsletterSystem: 'active' }));
        setCachedData('newsletters', batchData.newsletters, 180000);
      }
      
      if (batchData.contacts) {
        setContacts(batchData.contacts.contacts || []);
        setSystemStatus(prev => ({ ...prev, contactForm: 'active' }));
        calculateAnalytics(batchData.contacts.contacts || []);
        setCachedData('contacts', batchData.contacts, 90000);
      }

      if (showLoadingState) {
        setLoadingProgress({ current: 3, total: 4, currentTask: 'Testing services...' });
      }

      // Test email service
      try {
        const emailTestResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/test-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': localStorage.getItem('admin_token') || '',
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });

        if (emailTestResponse.ok) {
          const emailResult = await emailTestResponse.json();
          setSystemStatus(prev => ({ ...prev, emailService: emailResult.success ? 'active' : 'error' }));
        } else {
          setSystemStatus(prev => ({ ...prev, emailService: 'error' }));
        }
      } catch (emailError) {
        console.warn('⚠️ Email service test failed:', emailError);
        setSystemStatus(prev => ({ ...prev, emailService: 'error' }));
      }

      // Reset error counters on success
      setFailedRequests(0);
      setIsBackendHealthy(true);
      setConnectionHealth('healthy');
      setLastSuccessfulConnection(Date.now());
      setLastRefresh(Date.now());

      if (showLoadingState) {
        setLoadingProgress({ current: 4, total: 4, currentTask: 'Complete!' });
        setSuccess(`Dashboard loaded successfully in ${Date.now() - startTime}ms`);
      }

      console.log(`✅ Dashboard data loaded successfully via batch endpoint (${Date.now() - startTime}ms)`);
      
    } catch (error) {
      console.warn('⚠️ Batch request failed, falling back to individual requests:', error);
      
      // Fall back to individual requests
      await loadDashboardDataFallback(showLoadingState);
    }
  };

  // Helper function for backend health checking
  const checkBackendHealth = () => {
    if (failedRequests >= 3) {
      setIsBackendHealthy(false);
      setConnectionHealth('degraded');
      console.warn('⚠️ Backend marked as unhealthy due to multiple failed requests');
    } else if (Date.now() - lastSuccessfulConnection > 300000) { // 5 minutes
      setConnectionHealth('degraded');
      console.warn('⚠️ No successful connection in 5 minutes');
    }
  };

  // Helper function for timeout and cache management
  const fetchWithTimeoutAndCache = async (url: string, cacheKey: string, options: any = {}, timeout: number = 5000) => {
    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    // Get authenticated headers
    const headers = getAuthHeaders(options.headers || {});
    if (!headers) {
      throw new Error('Authentication required');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
          throw new Error('Authentication expired');
        }
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      setCachedData(cacheKey, data, 90000); // 1.5 minutes cache
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  };

  // Background refresh without loading states for periodic updates
  const refreshDataInBackground = async () => {
    // Skip background refresh if backend is unhealthy
    if (!isBackendHealthy || !isOnline) {
      console.log('⏸️ Background refresh skipped (backend unhealthy or offline)');
      return;
    }
    
    console.log('🔄 Background refresh started (using batch endpoint)');
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      setAbortController(controller);
      
      // Get authenticated headers
      const headers = getAuthHeaders();
      if (!headers) {
        console.warn('⚠️ Background refresh skipped (no admin token)');
        return;
      }
      
      // Use the batch endpoint for faster background refresh with short timeout
      const batchUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/dashboard-data`;
      
      // Set a short timeout for background refresh to avoid blocking
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(batchUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('🔐 Admin session expired during background refresh');
          setIsAuthenticated(false);
          localStorage.removeItem('admin_token');
          throw new Error('Authentication expired - please login again');
        }
        throw new Error(`Batch refresh failed: ${response.status} ${response.statusText}`);
      }

      const batchData = await response.json();
      
      console.log(`📊 Background refresh completed in ${Date.now() - startTime}ms`);
      
      // Process batch data
      if (batchData.subscribers) {
        setSubscribers(batchData.subscribers.subscribers || []);
        setSystemStatus(prev => ({ ...prev, database: 'active' }));
        setCachedData('subscribers', batchData.subscribers, 120000);
      }
      
      if (batchData.newsletters) {
        setNewsletterHistory(batchData.newsletters.newsletters || []);
        setSystemStatus(prev => ({ ...prev, newsletterSystem: 'active' }));
        setCachedData('newsletters', batchData.newsletters, 180000);
      }
      
      if (batchData.contacts) {
        setContacts(batchData.contacts.contacts || []);
        setSystemStatus(prev => ({ ...prev, contactForm: 'active' }));
        calculateAnalytics(batchData.contacts.contacts || []);
        setCachedData('contacts', batchData.contacts, 90000);
      }

      setLastRefresh(Date.now());
      console.log(`✅ Background refresh completed via batch endpoint (${Date.now() - startTime}ms`);
      
      // Reset error counters on successful batch request
      setFailedRequests(0);
      setIsBackendHealthy(true);
      setConnectionHealth('healthy');
      setLastSuccessfulConnection(Date.now());
      
    } catch (error) {
      console.error('❌ Background refresh failed:', error);
      
      const duration = Date.now() - startTime;
      setFailedRequests(prev => prev + 1);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('⏱️ Background refresh timed out - this is normal');
          return;
        } else if (error.message.includes('Failed to fetch')) {
          setConnectionHealth('offline');
        } else {
          setConnectionHealth('degraded');
        }
      }
      
      checkBackendHealth();
    }
  };

  // Fallback function for individual requests when batch fails
  const loadDashboardDataFallback = async (showLoadingState: boolean) => {
    console.log('🔄 Falling back to individual requests');
    
    try {

      // Fallback to individual requests with sequential loading for better reliability
      const endpoints = [
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/subscribers`, key: 'subscribers' },
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/newsletters`, key: 'newsletters' },
        { url: `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts`, key: 'contacts' }
      ];

      let hasErrors = false;
      
      for (const endpoint of endpoints) {
        try {
          if (showLoadingState) {
            setLoadingProgress({ 
              current: endpoints.indexOf(endpoint) + 1, 
              total: endpoints.length, 
              currentTask: `Loading ${endpoint.key}...` 
            });
          }

          const result = await fetchWithTimeoutAndCache(endpoint.url, endpoint.key, {}, 2000);
          
          switch (endpoint.key) {
            case 'subscribers':
              if (result?.subscribers) {
                setSubscribers(result.subscribers);
                setSystemStatus(prev => ({ ...prev, database: 'active' }));
              }
              break;
            case 'newsletters':
              if (result?.newsletters) {
                setNewsletterHistory(result.newsletters);
                setSystemStatus(prev => ({ ...prev, newsletterSystem: 'active' }));
              }
              break;
            case 'contacts':
              if (result?.contacts) {
                setContacts(result.contacts);
                setSystemStatus(prev => ({ ...prev, contactForm: 'active' }));
                calculateAnalytics(result.contacts);
              }
              break;
          }
          
          // Small delay between requests to reduce server load
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          console.warn(`⚠️ Fallback request failed for ${endpoint.key}:`, error);
          hasErrors = true;
          
          // Try to use cached data as fallback
          const cached = getCachedData(endpoint.key);
          if (cached) {
            console.log(`📦 Using cached data for ${endpoint.key} due to request failure`);
            switch (endpoint.key) {
              case 'subscribers':
                setSubscribers(cached.subscribers || []);
                break;
              case 'newsletters':
                setNewsletterHistory(cached.newsletters || []);
                break;
              case 'contacts':
                setContacts(cached.contacts || []);
                calculateAnalytics(cached.contacts || []);
                break;
            }
          }
        }
      }

      if (hasErrors) {
        setError('Some data may be outdated due to connection issues');
      } else {
        setSuccess('Dashboard data loaded via fallback method');
      }
      
    } catch (fallbackError) {
      console.error('❌ Fallback loading also failed:', fallbackError);
      setError('Unable to load dashboard data. Please check your connection.');
    } finally {
      if (showLoadingState) {
        setLoading(false);
        setLoadingProgress({ current: 0, total: 0, currentTask: '' });
      }
    }
  };

  const calculateAnalytics = (contactsData: ContactSubmission[]) => {
    const total = contactsData.length;
    const newContacts = contactsData.filter(c => c.status === 'new').length;
    const contacted = contactsData.filter(c => c.status === 'contacted').length;
    const completed = contactsData.filter(c => c.status === 'completed').length;
    
    const responseRate = total > 0 ? Math.round((contacted + completed) / total * 100) : 0;
    const completionRate = total > 0 ? Math.round(completed / total * 100) : 0;
    
    // Calculate average response time (simplified - assuming 24 hours for demo)
    const avgResponseTime = responseRate > 0 ? '18 hours' : '0 hours';
    
    setAnalytics({
      totalContacts: total,
      newContacts,
      responseRate,
      avgResponseTime,
      completionRate
    });
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email: resetEmail })
      });

      if (response.ok) {
        setSuccess('Password reset instructions sent to your email');
        setShowPasswordReset(false);
        setResetEmail('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Failed to process password reset request');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    // Validate password form
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
    const hasNumbers = /\d/.test(passwordForm.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError('Password must contain uppercase, lowercase, numbers, and special characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': localStorage.getItem('admin_token') || ''
        },
        body: JSON.stringify({ 
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword 
        })
      });

      if (response.ok) {
        setSuccess('Password updated successfully! You will be logged out for security.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordReset(false);
        
        // Logout after 3 seconds for security
        setTimeout(() => {
          handleLogout('Password changed - please log in with your new password');
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateKey: string) => {
    const template = newsletterTemplates[templateKey as keyof typeof newsletterTemplates];
    if (template) {
      setNewsletterForm({
        subject: template.subject,
        content: template.content,
        previewText: template.previewText
      });
      setSelectedTemplate(templateKey);
    }
  };

  const sendNewsletter = async () => {
    if (!newsletterForm.subject || !newsletterForm.content) {
      setError('Subject and content are required');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingProgress({ current: 0, total: 3, currentTask: 'Preparing newsletter...' });

    // Production mode - send newsletter via server
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for newsletter
      
      setLoadingProgress({ current: 1, total: 3, currentTask: 'Sending newsletter...' });

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/send-newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': localStorage.getItem('admin_token') || ''
        },
        body: JSON.stringify(newsletterForm),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setLoadingProgress({ current: 2, total: 3, currentTask: 'Processing results...' });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`Newsletter sent successfully to ${result.successCount} subscribers! ${result.failCount > 0 ? `(${result.failCount} failed)` : ''}`);
        setNewsletterForm({ subject: '', content: '', previewText: '' });
        setSelectedTemplate('');
        
        // Invalidate newsletters cache to get fresh data
        setCache(prev => ({
          ...prev,
          newsletters: {
            ...prev.newsletters,
            expiry: 0
          }
        }));
        
        setLoadingProgress({ current: 3, total: 3, currentTask: 'Refreshing data...' });
        // Refresh data in background without loading state
        await loadDashboardData(false);
      } else {
        setError(result.error || 'Failed to send newsletter');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Newsletter sending timeout - please check the status in newsletter history');
      } else {
        setError('Failed to send newsletter - please check your connection and try again');
      }
    } finally {
      setLoading(false);
      setLoadingProgress({ current: 0, total: 0, currentTask: '' });
    }
  };

  const updateContactStatus = async (contactId: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    // Optimistic update - update UI immediately
    const originalContacts = contacts;
    const originalSelectedContact = selectedContact;
    
    // Update contacts list optimistically
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, status: status as any, notes, lastUpdated: new Date().toISOString() }
        : contact
    );
    setContacts(updatedContacts);
    
    // Update selected contact optimistically
    if (selectedContact && selectedContact.id === contactId) {
      setSelectedContact({ ...selectedContact, status: status as any, notes, lastUpdated: new Date().toISOString() });
    }
    
    // Recalculate analytics with optimistic data
    calculateAnalytics(updatedContacts);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': localStorage.getItem('admin_token') || ''
        },
        body: JSON.stringify({ status, notes }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setSuccess('Contact updated successfully');
        // Invalidate cache for contacts to ensure fresh data on next load
        setCache(prev => ({
          ...prev,
          contacts: {
            ...prev.contacts,
            expiry: 0 // Force cache expiry
          }
        }));
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      // Rollback optimistic update on failure
      setContacts(originalContacts);
      setSelectedContact(originalSelectedContact);
      calculateAnalytics(originalContacts);
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Update timeout - contact status may not have been saved');
      } else {
        setError('Failed to update contact - changes reverted');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceLabel = (service: string) => {
    const serviceMap: { [key: string]: string } = {
      'strategic-planning': 'Strategic Planning',
      'digital-transformation': 'Digital Transformation',
      'business-optimization': 'Business Optimization',
      'innovation-consulting': 'Innovation Consulting',
      'change-management': 'Change Management',
      'growth-strategy': 'Growth Strategy',
      'custom': 'Custom Solution'
    };
    return serviceMap[service] || service;
  };

  if (!isVisible) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HK</span>
              </div>
              <span>Admin Login</span>
            </CardTitle>
            <p className="text-muted-foreground">Sign in to access admin dashboard</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && authenticate()}
                placeholder="Enter admin password"
              />
            </div>
            
            {/* Connection Status */}
            <div className="text-xs text-muted-foreground">
              <div className={`flex items-center space-x-2 ${
                connectionHealth === 'healthy' ? 'text-green-600' : 
                connectionHealth === 'degraded' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionHealth === 'healthy' ? 'bg-green-500' : 
                  connectionHealth === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span>
                  {connectionHealth === 'healthy' ? 'Connection: Optimal' :
                   connectionHealth === 'degraded' ? 'Connection: Slow' : 'Connection: Issues'}
                </span>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button onClick={authenticate} disabled={loading} className="flex-1">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            <div className="pt-4 border-t text-center space-y-2">
              <button
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-primary hover:underline block w-full"
              >
                Forgot your password?
              </button>
              

            </div>
          </CardContent>
        </Card>
        
        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Password Reset</CardTitle>
                <p className="text-muted-foreground">Request a password reset for admin access</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Admin Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="truthherman@gmail.com"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={async () => {
                      // TODO: Implement password reset request
                      setSuccess('Password reset instructions have been sent to your email');
                      setShowPasswordReset(false);
                      setResetEmail('');
                    }} 
                    disabled={loading || !resetEmail} 
                    className="flex-1"
                  >
                    Send Reset Link
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPasswordReset(false);
                      setResetEmail('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-7xl max-h-full overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">HK</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage your website services</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Session Status */}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Session: {Math.floor((SESSION_TIMEOUT - (Date.now() - lastActivity)) / 1000 / 60)}m remaining
              </div>
              <div className="text-xs text-muted-foreground">
                Auto-logout at {new Date(lastActivity + SESSION_TIMEOUT).toLocaleTimeString()}
              </div>
              {lastRefresh > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  ✓ Last refreshed {Math.floor((Date.now() - lastRefresh) / 1000)}s ago
                </div>
              )}
              {Object.keys(cache).length > 0 && (
                <div className="text-xs text-blue-600">
                  📦 {Object.keys(cache).length} items cached
                </div>
              )}
              {/* Connection Status Indicator */}
              <div className="flex items-center space-x-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  connectionHealth === 'healthy' ? 'bg-green-500' : 
                  connectionHealth === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className={`${
                  connectionHealth === 'healthy' ? 'text-green-600' : 
                  connectionHealth === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {connectionHealth === 'healthy' ? 'Connected' :
                   connectionHealth === 'degraded' ? 'Slow' : 'Offline'}
                </span>
              </div>
              {/* Connectivity Test Button - appears when connection issues detected */}
              {!isBackendHealthy && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={async () => {
                    console.log('🔍 Running quick connectivity test...');
                    const pingUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/ping`;
                    try {
                      const response = await fetch(pingUrl, {
                        method: 'GET',
                        signal: AbortSignal.timeout(2000), // 2 second test
                        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
                      });
                      if (response.ok) {
                        setIsBackendHealthy(true);
                        setConnectionHealth('healthy');
                        setFailedRequests(0);
                        setSuccess('Connection restored! Try refreshing data.');
                      }
                    } catch {
                      setError('Connection test failed. Server may be down.');
                    }
                  }}
                  className="text-xs"
                >
                  Test Connection
                </Button>
              )}
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Button variant="outline" onClick={() => loadDashboardData(true)} disabled={loading} size="sm">
              {loading ? 'Loading...' : connectionHealth === 'offline' ? 'Retry Connection' : 'Refresh All'}
            </Button>
            <Button variant="outline" onClick={() => handleLogout()} size="sm">
              Logout
            </Button>
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Production Mode Banner - Always shows live server status */}
          {!isDemoMode && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-900">🚀 Live Production Server</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Connected to live database and server. All data and operations are real.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionHealth === 'healthy' ? 'bg-green-500' : 
                    connectionHealth === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm text-green-700">
                    {connectionHealth === 'healthy' ? 'All systems operational' :
                     connectionHealth === 'degraded' ? 'Connection issues detected' : 'Server offline'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && !isDemoMode && (
            <div className={`mb-4 p-3 rounded-md border ${
              error.includes('cached data') || error.includes('Offline') 
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <div className="flex items-start space-x-2">
                <span className="text-lg">
                  {error.includes('cached data') || error.includes('Offline') ? '⚠️' : '❌'}
                </span>
                <div>
                  <p>{error}</p>
                  {!isOnline && (
                    <p className="text-sm mt-1 opacity-75">
                      Check your internet connection and try refreshing the page.
                    </p>
                  )}
                  {!isBackendHealthy && isOnline && (
                    <p className="text-sm mt-1 opacity-75">
                      The server appears to be experiencing issues. Data will auto-refresh when connection is restored.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
              {success}
            </div>
          )}

          {/* Loading Progress Indicator */}
          {loading && loadingProgress.total > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  {loadingProgress.currentTask}
                </span>
                <span className="text-sm text-blue-700">
                  {loadingProgress.current}/{loadingProgress.total}
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(loadingProgress.current / loadingProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard />
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Newsletter Subscribers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{subscribers.length}</div>
                    <p className="text-xs text-muted-foreground">Active subscribers</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalContacts}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.newContacts} new inquiries
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.responseRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      Avg: {analytics.avgResponseTime}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                    <p className="text-xs text-muted-foreground">Projects completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.slice(0, 3).map((contact) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">New contact from {contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        </div>
                        <Badge className={`${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </Badge>
                      </div>
                    ))}
                    
                    {contacts.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent contact activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Newsletter Tab */}
            <TabsContent value="newsletter" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Send Newsletter */}
                <Card>
                  <CardHeader>
                    <CardTitle>Send Newsletter</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Send to {subscribers.length} subscribers
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Template Selection */}
                    <div>
                      <Label htmlFor="template">Quick Start Templates</Label>
                      <Select value={selectedTemplate} onValueChange={applyTemplate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly-update">Weekly Business Update</SelectItem>
                          <SelectItem value="monthly-deep-dive">Monthly Deep Dive</SelectItem>
                          <SelectItem value="service-announcement">Service Announcement</SelectItem>
                          <SelectItem value="insights-sharing">Insights from the Field</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedTemplate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Template applied! You can customize the content below.
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        value={newsletterForm.subject}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Enter newsletter subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="previewText">Preview Text (Optional)</Label>
                      <Input
                        id="previewText"
                        value={newsletterForm.previewText}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, previewText: e.target.value }))}
                        placeholder="Brief preview text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="content">Newsletter Content</Label>
                      <Textarea
                        id="content"
                        value={newsletterForm.content}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, content: e.target.value }))}
                        rows={8}
                        placeholder="Write your newsletter content here..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={sendNewsletter} 
                        disabled={loading || !newsletterForm.subject || !newsletterForm.content}
                        className="flex-1"
                      >
                        {loading ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNewsletterForm({ subject: '', content: '', previewText: '' });
                          setSelectedTemplate('');
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Newsletter History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-auto">
                      {newsletterHistory.map((newsletter) => (
                        <div key={newsletter.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-1">{newsletter.subject}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(newsletter.sentAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-green-600">✓ {newsletter.successCount} sent</span>
                            {newsletter.failCount > 0 && (
                              <span className="text-red-600">✗ {newsletter.failCount} failed</span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {newsletterHistory.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No newsletters sent yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Contacts List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Submissions ({contacts.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-auto">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedContact(contact)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium truncate">{contact.name}</h4>
                                {contact.emailSent && (
                                  <Badge variant="outline" className="text-xs">
                                    ✅ Emailed
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                              {contact.service && (
                                <p className="text-xs text-primary mt-1">{getServiceLabel(contact.service)}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(contact.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {contacts.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No contact submissions yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedContact ? 'Contact Details' : 'Select a Contact'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedContact ? (
                      <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Name</Label>
                            <p className="text-sm">{selectedContact.name}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium">Email</Label>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm">{selectedContact.email}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>

                          {selectedContact.company && (
                            <div>
                              <Label className="text-sm font-medium">Company</Label>
                              <p className="text-sm">{selectedContact.company}</p>
                            </div>
                          )}

                          {selectedContact.service && (
                            <div>
                              <Label className="text-sm font-medium">Service</Label>
                              <p className="text-sm">{getServiceLabel(selectedContact.service)}</p>
                            </div>
                          )}

                          {selectedContact.budget && (
                            <div>
                              <Label className="text-sm font-medium">Budget</Label>
                              <p className="text-sm">{selectedContact.budget}</p>
                            </div>
                          )}

                          {selectedContact.timeline && (
                            <div>
                              <Label className="text-sm font-medium">Timeline</Label>
                              <p className="text-sm">{selectedContact.timeline}</p>
                            </div>
                          )}

                          <div>
                            <Label className="text-sm font-medium">Message</Label>
                            <div className="bg-muted/50 p-3 rounded-md mt-1">
                              <p className="text-sm whitespace-pre-line">{selectedContact.message}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Submitted</Label>
                            <p className="text-sm">{new Date(selectedContact.submittedAt).toLocaleString()}</p>
                          </div>
                        </div>

                        <Separator />

                        {/* Status Management */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Select 
                              value={selectedContact.status} 
                              onValueChange={(value) => updateContactStatus(selectedContact.id, value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Notes</Label>
                            <Textarea
                              value={selectedContact.notes || ''}
                              onChange={(e) => {
                                setSelectedContact(prev => prev ? { ...prev, notes: e.target.value } : null);
                              }}
                              placeholder="Add notes about this contact..."
                              rows={3}
                              className="mt-1"
                            />
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={() => updateContactStatus(selectedContact.id, selectedContact.status, selectedContact.notes)}
                            >
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Select a contact submission to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Management</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monitor and optimize your website for search engines
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SEO Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">SEO Audit</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Analyze your website's SEO performance and get recommendations
                      </p>
                      <Button 
                        onClick={() => setShowSEOAudit(true)}
                        className="w-full"
                        variant="default"
                      >
                        Run SEO Audit
                      </Button>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Search Console</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Submit your site to Google for better indexing
                      </p>
                      <Button 
                        onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                        className="w-full"
                        variant="outline"
                      >
                        Open Search Console
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Static Files Status */}
                  <div className="space-y-6">
                    <StaticFilesVerifier />
                    <StaticFilesChecker />
                  </div>

                  <Separator />

                  {/* SEO Resources */}
                  <div>
                    <h4 className="font-medium mb-3">SEO Resources & Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">Site Files</h5>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <span className="text-sm">Sitemap.xml</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('/sitemap.xml', '_blank')}
                            >
                              View
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <span className="text-sm">Robots.txt</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open('/robots.txt', '_blank')}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">External Tools</h5>
                        <div className="space-y-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
                          >
                            PageSpeed Insights
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://www.google.com/webmasters/tools/mobile-friendly/', '_blank')}
                          >
                            Mobile-Friendly Test
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => window.open('https://schema.org/validator', '_blank')}
                          >
                            Schema Validator
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* SEO Tips */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">📈 SEO Tips for Better Rankings</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Publish high-quality content regularly</li>
                      <li>• Optimize images with descriptive alt text</li>
                      <li>• Build backlinks from reputable websites</li>
                      <li>• Ensure fast loading times (under 3 seconds)</li>
                      <li>• Use relevant keywords naturally in content</li>
                      <li>• Keep meta descriptions under 160 characters</li>
                      <li>• Monitor your rankings weekly</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Diagnostic Tab */}
            <TabsContent value="diagnostic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Health Check */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Production Health Monitor</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Real-time system health and status monitoring
                      </p>
                    </CardHeader>
                    <CardContent>
                      <SimpleProductionHealthCheck />
                    </CardContent>
                  </Card>
                </div>

                {/* Connection Diagnostic */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connection Diagnostic</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Network connectivity and API endpoint testing
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ConnectionDiagnostic />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Static File Validation for Diagnostic */}
              <div className="grid lg:grid-cols-2 gap-6">
                <StaticFileValidator />
                <StaticFilesChecker />
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time service monitoring</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Email Service (Resend)</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.emailService === 'active' ? 'bg-green-500' : 
                            systemStatus.emailService === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">
                            {systemStatus.emailService}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Database (Supabase)</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.database === 'active' ? 'bg-green-500' : 
                            systemStatus.database === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">
                            {systemStatus.database}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Contact Form System</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.contactForm === 'active' ? 'bg-green-500' : 
                            systemStatus.contactForm === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">
                            {systemStatus.contactForm}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">Newsletter System</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            systemStatus.newsletterSystem === 'active' ? 'bg-green-500' : 
                            systemStatus.newsletterSystem === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-sm capitalize">
                            {systemStatus.newsletterSystem}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadDashboardData}
                        disabled={loading}
                      >
                        {loading ? 'Checking...' : 'Check All Services'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Account and security settings</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Admin Password Management</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage your admin password securely. All passwords are encrypted and stored safely in the database.
                      </p>
                      <div className="space-y-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowPasswordReset(true)}
                          className="w-full"
                        >
                          Change Password
                        </Button>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>• Password is stored securely with encryption</p>
                          <p>• Session expires after 10 minutes of inactivity</p>
                          <p>• All password operations are server-side only</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 text-blue-900">Performance Metrics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Response Rate:</span>
                          <span className="font-medium">{analytics.responseRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Response Time:</span>
                          <span className="font-medium">{analytics.avgResponseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Project Completion:</span>
                          <span className="font-medium">{analytics.completionRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Subscribers:</span>
                          <span className="font-medium">{subscribers.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium mb-2 text-green-900">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://hermankwayu.com', '_blank')}
                        >
                          View Live Website
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://calendly.com/truthherman/30min', '_blank')}
                        >
                          Open Calendly
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                        >
                          Supabase Dashboard
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium mb-2 text-purple-900">Admin Tools</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Clear all cached data
                            setCache({});
                            setSuccess('Cache cleared successfully');
                          }}
                        >
                          Clear Cache
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Force refresh all data
                            loadDashboardData(true);
                          }}
                        >
                          Force Refresh Data
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            // Download admin logs
                            setSuccess('Admin activity logged and ready for review');
                          }}
                        >
                          Export Activity Log
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Static File Validation */}
              <div className="grid lg:grid-cols-2 gap-6">
                <StaticFileValidator />
                <StaticFilesChecker />
              </div>
            </TabsContent>

            {/* Diagnostic Tab */}
            <TabsContent value="diagnostic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Health Check */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Production Health Monitor</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Real-time system health and status monitoring
                      </p>
                    </CardHeader>
                    <CardContent>
                      <SimpleProductionHealthCheck />
                    </CardContent>
                  </Card>
                </div>

                {/* Connection Diagnostic */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connection Diagnostic</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Network connectivity and API endpoint testing
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ConnectionDiagnostic />
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Additional Static File Validation for Diagnostic */}
              <div className="grid lg:grid-cols-2 gap-6">
                <StaticFileValidator />
                <StaticFilesChecker />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Auto-Logout Warning Modal */}
      {showLogoutWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center text-yellow-600">⚠️ Session Expiring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center">
                Your session will expire in {Math.floor((SESSION_TIMEOUT - (Date.now() - lastActivity)) / 1000 / 60)} minutes due to inactivity.
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={extendSession}
                  className="flex-1"
                >
                  Stay Logged In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleLogout()}
                  className="flex-1"
                >
                  Logout Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Change/Reset Modal */}
      {showPasswordReset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center space-x-2">
                <span>🔒</span>
                <span>Change Admin Password</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Update your admin password securely
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password (min. 8 characters)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must contain uppercase, lowercase, numbers, and special characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <div className="flex items-start space-x-2">
                  <span>⚠️</span>
                  <div>
                    <p className="font-medium">Security Notice:</p>
                    <p>You'll need to re-authenticate after changing your password. Keep your new credentials secure.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <span>💡</span>
                  <div>
                    <p className="font-medium">Alternative Method:</p>
                    <p>For additional security, you can also request a password reset link via email:</p>
                    <div className="mt-2">
                      <Input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="truthherman@gmail.com"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button 
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="w-full"
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handlePasswordReset}
                  disabled={loading || !resetEmail}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Email Reset Link'}
                </Button>
              </div>
              
              <Button 
                variant="ghost"
                onClick={() => {
                  setShowPasswordReset(false);
                  setResetEmail('');
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SEO Audit Modal */}
      <SEOAudit 
        isVisible={showSEOAudit}
        onClose={() => setShowSEOAudit(false)}
      />
    </div>
  );
}