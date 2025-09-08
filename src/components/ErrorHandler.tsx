/**
 * Global Error Handler - Catches and logs runtime errors
 */

import React, { useEffect } from 'react';

export function ErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const isDevelopment = process?.env?.NODE_ENV === 'development';
      
      // Log error details (production logs will be less verbose)
      if (isDevelopment) {
        console.error('🚨 Runtime Error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error
        });
      } else {
        // In production, log simplified error
        console.error('Runtime Error:', event.message);
      }

      // Suppress known development-only errors
      const suppressedPatterns = [
        'analytics', 'tracking', 'Failed to fetch', 
        'batch dashboard', 'dashboard-data', 'admin/authenticate',
        'make-server-4d80a1b0'
      ];
      
      const shouldSuppress = suppressedPatterns.some(pattern => 
        event.message.includes(pattern) || 
        event.filename?.includes(pattern)
      );

      if (shouldSuppress) {
        event.preventDefault();
        if (isDevelopment) {
          console.log('🚫 Suppressed known error:', event.message);
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const isDevelopment = process?.env?.NODE_ENV === 'development';
      const reasonStr = String(event.reason);
      
      if (isDevelopment) {
        console.error('🚨 Unhandled Promise Rejection:', event.reason);
      } else {
        console.error('Promise Rejection:', reasonStr);
      }
      
      // Suppress API and analytics errors
      const suppressedPatterns = [
        'analytics', 'tracking', 'batch dashboard', 
        'Failed to fetch', 'dashboard-data', 'admin/authenticate',
        'make-server-4d80a1b0', 'Network Error', 'timeout'
      ];
      
      const shouldSuppress = suppressedPatterns.some(pattern => 
        reasonStr.includes(pattern)
      );

      if (shouldSuppress) {
        event.preventDefault();
        if (isDevelopment) {
          console.log('🚫 Suppressed API/analytics error:', reasonStr);
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}