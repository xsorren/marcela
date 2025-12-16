'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'gold', 
  className,
  text = null 
}) {
  const baseClasses = 'animate-spin rounded-full border-transparent';
  
  // Define colores para el borde
  let borderColor;
  switch (color) {
    case 'gold':
      borderColor = 'border-t-gold';
      break;
    case 'primary':
      borderColor = 'border-t-primary';
      break;
    case 'white':
      borderColor = 'border-t-white';
      break;
    default:
      borderColor = 'border-t-gold';
  }

  const spinnerClasses = cn(
    baseClasses,
    sizeMap[size] || sizeMap.md,
    borderColor,
    className
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses} />
      {text && (
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
} 