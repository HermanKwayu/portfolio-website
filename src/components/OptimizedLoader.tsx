/**
 * Optimized Loader - Non-blocking loading component
 */

import React from 'react';

interface OptimizedLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function OptimizedLoader({ size = 'md', message }: OptimizedLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4" role="status" aria-live="polite">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary/20 border-t-primary`} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}