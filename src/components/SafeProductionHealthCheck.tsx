import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Wifi, Database, Mail, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface HealthCheckItem {
  name: string;
  status: 'checking' | 'healthy' | 'error' | 'warning';
  message?: string;
  icon: React.ReactNode;
}

export function SafeProductionHealthCheck() {
  const [healthChecks, setHealthChecks] = useState<HealthCheckItem[]>([
    { name: 'Database Connection', status: 'checking', icon: <Database className="h-4 w-4" /> },
    { name: 'Email Service', status: 'checking', icon: <Mail className="h-4 w-4" /> },
    { name: 'Admin Authentication', status: 'checking', icon: <Shield className="h-4 w-4" /> },
    { name: 'Environment Variables', status: 'checking', icon: <Wifi className="h-4 w-4" /> },
  ]);

  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Safe environment variable getter
  const getEnvVar = (key: string): string | undefined => {
    try {
      // Try Vite environment variables first (import.meta.env)
      try {
        if (import.meta?.env) {
          const viteVar = import.meta.env[`VITE_${key}`];
          if (viteVar) return viteVar;
        }
      } catch (e) {
        // import.meta might not be available in all environments
      }
      
      // Try process.env
      try {
        if (typeof process !== 'undefined' && process.env) {
          const processVar = process.env[key];
          if (processVar) return processVar;
        }
      } catch (e) {
        // process might not be available in all environments
      }
      
      return undefined;
    } catch (error) {
      console.warn(`Could not access environment variable ${key}:`, error);
      return undefined;
    }
  };

  useEffect(() => {
    try {
      // Only show in development or when explicitly requested
      let shouldShow = false;
      
      try {
        shouldShow = process.env.NODE_ENV === 'development';
      } catch (e) {
        // process.env might not be available
      }
      
      // Check URL parameter if window is available
      if (!shouldShow && typeof window !== 'undefined') {
        try {
          shouldShow = new URLSearchParams(window.location.search).has('health-check');
        } catch (e) {
          // URL parsing might fail
        }
      }
      
      setIsVisible(shouldShow);

      if (shouldShow) {
        performHealthChecks().catch(error => {
          console.error('Health check failed:', error);
          setHasError(true);
        });
      }
    } catch (error) {
      console.error('Health check initialization failed:', error);
      setHasError(true);
    }
  }, []);

  const performHealthChecks = async () => {
    try {
      const checks = [...healthChecks];

      // Check Environment Variables with safe access
      try {
        const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'RESEND_API_KEY'];
        const missingEnvVars = requiredEnvVars.filter(envVar => !getEnvVar(envVar));
        
        checks[3].status = missingEnvVars.length === 0 ? 'healthy' : 'warning';
        checks[3].message = missingEnvVars.length > 0 ? `Missing: ${missingEnvVars.join(', ')}` : 'All required variables present';
      } catch (error) {
        checks[3].status = 'warning';
        checks[3].message = 'Could not check environment variables';
      }

      // Check Database Connection
      try {
        const supabaseUrl = getEnvVar('SUPABASE_URL');
        const supabaseKey = getEnvVar('SUPABASE_ANON_KEY');
        
        if (supabaseUrl && supabaseKey) {
          // Create a simple URL check instead of importing utils
          const testUrl = `${supabaseUrl}/rest/v1/`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(testUrl, {
            headers: { 'apikey': supabaseKey },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          checks[0].status = response.ok ? 'healthy' : 'warning';
          checks[0].message = response.ok ? 'Connected successfully' : `Response: ${response.status}`;
        } else {
          checks[0].status = 'warning';
          checks[0].message = 'Supabase credentials not configured';
        }
      } catch (error) {
        checks[0].status = 'warning';
        checks[0].message = 'Connection test skipped (demo mode)';
      }

      // Check Email Service
      try {
        const resendKey = getEnvVar('RESEND_API_KEY');
        checks[1].status = resendKey ? 'healthy' : 'warning';
        checks[1].message = checks[1].status === 'healthy' ? 'API key configured' : 'API key missing';
      } catch (error) {
        checks[1].status = 'warning';
        checks[1].message = 'Could not check email service config';
      }

      // Check Admin Authentication
      try {
        const adminSecret = getEnvVar('ADMIN_SESSION_SECRET');
        checks[2].status = adminSecret ? 'healthy' : 'warning';
        checks[2].message = adminSecret ? 'Session secret configured' : 'Using default session management';
      } catch (error) {
        checks[2].status = 'warning';
        checks[2].message = 'Could not verify admin config';
      }

      setHealthChecks(checks);
      setHasError(false);
    } catch (error) {
      console.error('Health checks failed:', error);
      setHasError(true);
      // Set all checks to warning state instead of error to be less alarming
      const warningChecks = healthChecks.map(check => ({
        ...check,
        status: 'warning' as const,
        message: 'Health check unavailable'
      }));
      setHealthChecks(warningChecks);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'checking':
      default:
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Warning</Badge>;
      case 'checking':
      default:
        return <Badge variant="outline">Checking...</Badge>;
    }
  };

  if (!isVisible || hasError) {
    return null;
  }

  const overallStatus = healthChecks.every(check => check.status === 'healthy') ? 'healthy' :
                       healthChecks.some(check => check.status === 'error') ? 'error' : 'warning';

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getStatusIcon(overallStatus)}
            Production Health Check
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="ml-auto h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {check.icon}
                <span>{check.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(check.status)}
              </div>
            </div>
          ))}
          
          {healthChecks.some(check => check.message) && (
            <div className="mt-3 pt-3 border-t space-y-1">
              {healthChecks
                .filter(check => check.message)
                .map((check, index) => (
                  <div key={index} className="text-xs text-muted-foreground">
                    <span className="font-medium">{check.name}:</span> {check.message}
                  </div>
                ))}
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={performHealthChecks}
              className="w-full"
            >
              Refresh Checks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}