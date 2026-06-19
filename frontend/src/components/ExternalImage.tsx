'use client';

import Image, { type ImageLoaderProps, type ImageProps } from 'next/image';
import { useState } from 'react';

type ExternalImageProps = Omit<ImageProps, 'alt' | 'loader' | 'onError' | 'onLoad' | 'src' | 'unoptimized'> & {
  alt: string;
  fallbackSrc?: string;
  src?: string | null;
};

const fallbackPosterUrl = 'https://placehold.co/300x400/1C1C1E/FFFFFF?text=No+Image';

function passthroughLoader({ src }: ImageLoaderProps) {
  return src;
}

export default function ExternalImage({ src, fallbackSrc = fallbackPosterUrl, alt, ...props }: ExternalImageProps) {
  const [didError, setDidError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const trimmedSrc = src?.trim();
  const imageSrc = didError || !trimmedSrc ? fallbackSrc : trimmedSrc;

  return (
    <>
      {!isLoaded && (
        <span className="absolute inset-0 animate-pulse bg-white/10" aria-hidden="true" />
      )}
      <Image
        {...props}
        alt={alt}
        loader={passthroughLoader}
        src={imageSrc}
        unoptimized
        onError={() => {
          if (imageSrc !== fallbackSrc) {
            setDidError(true);
            setIsLoaded(false);
          }
        }}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
}
