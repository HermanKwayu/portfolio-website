/**
 * Production Wrapper - Ensures safe initialization of all production components
 */

import React, { Suspense } from 'react';
import { ErrorHandler } from './ErrorHandler';
import { FetchErrorSuppressor } from './FetchErrorSuppressor';

// Safely import SimplePerformanceMonitor with fallback
const SafePerformanceMonitor = React.lazy(() => 
  import('./SimplePerformanceMonitor')
    .then(module => ({ default: module.SimplePerformanceMonitor }))
    .catch(() => ({
      default: () => null
    }))
);

// Safely import development tools with fallbacks
const SafeAccessibilityEnhancer = React.lazy(() =>
  import('./AccessibilityEnhancer')
    .then(module => ({ default: module.AccessibilityEnhancer }))
    .catch(() => ({
      default: () => null
    }))
);

const SafeSEOValidator = React.lazy(() =>
  import('./SEOValidator')
    .then(module => ({ default: module.SEOValidator }))
    .catch(() => ({
      default: () => null
    }))
);

// Check if we're in development mode safely
const isDevelopment = (() => {
  try {
    return process?.env?.NODE_ENV === 'development';
  } catch {
    return false;
  }
})();

interface ProductionWrapperProps {
  children: React.ReactNode;
}

export function ProductionWrapper({ children }: ProductionWrapperProps) {
  return (
    <>
      {/* Global error handler - always load first */}
      <ErrorHandler />
      
      {/* Fetch error suppressor - handles API failures gracefully */}
      <FetchErrorSuppressor />
      

      
      {/* Development tools - only in development */}
      {isDevelopment && (
        <Suspense fallback={null}>
          <SafePerformanceMonitor />
          <SafeAccessibilityEnhancer />
          <SafeSEOValidator />
        </Suspense>
      )}
      
      {/* Main app content */}
      {children}
    </>
  );
}