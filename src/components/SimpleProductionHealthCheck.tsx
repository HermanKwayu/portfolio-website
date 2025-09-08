import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'error';
  details: string[];
}

export function SimpleProductionHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>({ overall: 'healthy', details: [] });
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Simple environment check function
  const checkEnvironment = (): HealthStatus => {
    const details: string[] = [];
    let hasWarnings = false;

    try {
      // Basic environment detection
      const isDev = process?.env?.NODE_ENV === 'development';
      details.push(isDev ? 'Development mode' : 'Production mode');

      // Check if we're in browser
      if (typeof window !== 'undefined') {
        details.push('Browser environment detected');
      } else {
        details.push('Server environment detected');
      }

      // Check basic APIs
      if (typeof fetch !== 'undefined') {
        details.push('Fetch API available');
      } else {
        details.push('Fetch API unavailable');
        hasWarnings = true;
      }

      // Check localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          details.push('Local storage available');
        } else {
          details.push('Local storage unavailable');
          hasWarnings = true;
        }
      } catch {
        details.push('Local storage check failed');
        hasWarnings = true;
      }

    } catch (error) {
      details.push('Environment check failed');
      hasWarnings = true;
    }

    return {
      overall: hasWarnings ? 'warning' : 'healthy',
      details
    };
  };

  useEffect(() => {
    // Show only in development or with URL parameter
    let shouldShow = false;
    
    try {
      shouldShow = process?.env?.NODE_ENV === 'development';
    } catch {
      // If we can't check environment, default to false
    }

    // Check URL parameter if available
    if (!shouldShow && typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        shouldShow = params.has('health-check');
      } catch {
        // URL check failed, stay with current shouldShow value
      }
    }

    setIsVisible(shouldShow);

    if (shouldShow) {
      performCheck();
    }
  }, []);

  const performCheck = () => {
    setIsChecking(true);
    
    // Simulate async check
    setTimeout(() => {
      const result = checkEnvironment();
      setStatus(result);
      setIsChecking(false);
    }, 500);
  };

  const getStatusIcon = (status: string, isChecking: boolean) => {
    if (isChecking) {
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string, isChecking: boolean) => {
    if (isChecking) {
      return <Badge variant="outline">Checking...</Badge>;
    }

    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500">Healthy</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            {getStatusIcon(status.overall, isChecking)}
            Health Check
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
          <div className="flex items-center justify-between">
            <span className="text-sm">Overall Status</span>
            {getStatusBadge(status.overall, isChecking)}
          </div>
          
          {status.details.length > 0 && (
            <div className="mt-3 pt-3 border-t space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Details:</div>
              {status.details.map((detail, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {detail}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={performCheck}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? 'Checking...' : 'Refresh Check'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}