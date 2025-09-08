import { useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthCache {
  token: string;
  timestamp: number;
  password: string; // Always empty for security - never store passwords
}

interface FastAdminAuthProps {
  onAuthenticated: (token: string) => void;
  onError: (error: string) => void;
  children: (props: {
    authenticate: (password: string) => Promise<void>;
    isLoading: boolean;
    isCached: boolean;
  }) => React.ReactNode;
}

const CACHE_KEY = 'admin_auth_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const WARM_UP_INTERVAL = 2 * 60 * 1000; // 2 minutes

export function FastAdminAuth({ onAuthenticated, onError, children }: FastAdminAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const warmUpIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const authCacheRef = useRef<AuthCache | null>(null);

  // Initialize auth cache and warm-up system
  useEffect(() => {
    initializeAuthCache();
    startWarmUpSystem();
    
    return () => {
      if (warmUpIntervalRef.current) {
        clearInterval(warmUpIntervalRef.current);
      }
    };
  }, []);

  const initializeAuthCache = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const authCache: AuthCache = JSON.parse(cached);
        const isValid = Date.now() - authCache.timestamp < CACHE_DURATION;
        
        if (isValid) {
          authCacheRef.current = authCache;
          setIsCached(true);
          console.log('🚀 Auth cache loaded');
        } else {
          localStorage.removeItem(CACHE_KEY);
          console.log('🗑️ Expired auth cache removed');
        }
      }
    } catch (error) {
      console.warn('Auth cache error:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  };

  const startWarmUpSystem = () => {
    // Immediate warm-up
    warmUpServer();
    
    // Periodic warm-up to prevent cold starts
    warmUpIntervalRef.current = setInterval(() => {
      warmUpServer();
    }, WARM_UP_INTERVAL);
  };

  const warmUpServer = async () => {
    try {
      const warmUpUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/warm`;
      
      // Use fetch with very short timeout for warm-up
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 1000);
      
      await fetch(warmUpUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        }
      });
      
      console.log('🔥 Server warmed up');
    } catch (error) {
      // Ignore warm-up errors - they're expected
    }
  };

  const authenticate = async (password: string) => {
    // Check if we have a valid cached token (but never cache passwords)
    if (authCacheRef.current && authCacheRef.current.token) {
      console.log('⚡ Using cached authentication token');
      onAuthenticated(authCacheRef.current.token);
      return;
    }

    setIsLoading(true);
    setIsCached(false);
    
    const startTime = Date.now();
    const authUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4d80a1b0/admin/authenticate`;
    
    try {
      // Use keepalive and optimized headers
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'Accept': 'application/json',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify({ password }),
        keepalive: true,
        // No timeout - let it complete
      });

      const duration = Date.now() - startTime;
      console.log(`🔐 Auth completed in ${duration}ms`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const result = await response.json();

      if (result.success && result.token) {
        // Cache the successful authentication (token only, never store password)
        const authCache: AuthCache = {
          token: result.token,
          timestamp: Date.now(),
          password: '' // Never cache passwords for security
        };
        
        authCacheRef.current = authCache;
        localStorage.setItem(CACHE_KEY, JSON.stringify(authCache));
        localStorage.setItem('admin_token', result.token);
        
        setIsCached(true);
        onAuthenticated(result.token);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Auth failed after ${duration}ms:`, error);
      
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = () => {
    authCacheRef.current = null;
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem('admin_token');
    setIsCached(false);
  };

  // Expose cache clearing for logout
  useEffect(() => {
    const handleClearAuth = () => clearCache();
    window.addEventListener('admin-logout', handleClearAuth);
    
    return () => {
      window.removeEventListener('admin-logout', handleClearAuth);
    };
  }, []);

  return (
    <>
      {children({
        authenticate,
        isLoading,
        isCached
      })}
    </>
  );
}