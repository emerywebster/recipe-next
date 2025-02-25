'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = '',
  priority = false,
  objectFit = 'cover',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handle external URLs that might not be optimizable
  const isExternal = src?.startsWith('http') || src?.startsWith('https');

  // Fallback image for errors
  const fallbackSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c';

  // Handle loading and error states
  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {isExternal ? (
        // For external images, use a regular img tag with loading optimization
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : `object-${objectFit}`}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        // For internal images, use Next.js Image component
        <Image
          src={error ? fallbackSrc : src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          style={{ objectFit }}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
