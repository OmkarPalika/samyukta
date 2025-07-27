'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

// Generate a simple blur placeholder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateBlurDataURL = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.toDataURL();
};

export function OptimizedImage({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  className, 
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/placeholder-image.jpg'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
    onError?.();
  };

  // Default blur data URL if none provided
  const defaultBlurDataURL = blurDataURL || 
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  const imageProps = {
    ref: imgRef,
    src: imgSrc,
    alt,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    priority,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL: defaultBlurDataURL,
    }),
    ...(fill ? {
      fill: true,
      sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    } : {
      width,
      height,
    }),
  };

  return (
    <div className={cn('relative overflow-hidden', fill && 'w-full h-full')}>
      <Image {...imageProps} alt={alt || ''} />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse',
            fill ? 'w-full h-full' : `w-[${width}px] h-[${height}px]`
          )}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}

// Progressive image component with multiple sources
export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className,
  ...props
}: OptimizedImageProps & { lowQualitySrc?: string }) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  // Preload high quality image
  useState(() => {
    if (lowQualitySrc && src !== lowQualitySrc) {
      const img = new window.Image();
      img.onload = () => {
        setCurrentSrc(src);
        setIsHighQualityLoaded(true);
      };
      img.src = src;
    }
  });

  return (
    <OptimizedImage
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(
        'transition-all duration-500',
        !isHighQualityLoaded && lowQualitySrc && 'filter blur-sm',
        className
      )}
    />
  );
}