import React from 'react';
import { cn } from './ui/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className={cn(
          "text-muted-foreground animate-pulse",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}