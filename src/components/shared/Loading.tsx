'use client';

import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

export default function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}: LoadingProps) {
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

  if (variant === 'spinner') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center space-y-2">
          <div className={cn(
            "animate-spin rounded-full border-2 border-gray-600 border-t-blue-400",
            sizeClasses[size]
          )} />
          {text && (
            <p className={cn("text-gray-400", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "bg-blue-400 rounded-full animate-pulse",
                  size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
          {text && (
            <p className={cn("text-gray-400", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="flex flex-col items-center space-y-2">
          <div className={cn(
            "bg-blue-400 rounded-full animate-pulse",
            sizeClasses[size]
          )} />
          {text && (
            <p className={cn("text-gray-400", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Full screen loading overlay
export function LoadingOverlay({ 
  text = "Loading...",
  variant = 'spinner',
  size = 'lg'
}: Omit<LoadingProps, 'className'>) {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading variant={variant} size={size} text={text} />
    </div>
  );
}

// Page loading component
export function PageLoading({ 
  text = "Loading...",
  variant = 'spinner',
  size = 'lg'
}: Omit<LoadingProps, 'className'>) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Loading variant={variant} size={size} text={text} />
    </div>
  );
}