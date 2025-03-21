import React from 'react';
import { cn } from '@/lib/utils';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
};

/**
 * Composant d'indicateur de chargement
 */
export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-6", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-primary border-t-transparent",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}