'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { HubSpace } from '@/content/hub';
import { cn } from '@/lib/utils';

type HubImageProps = {
  space: Pick<HubSpace, 'id' | 'image' | 'fallbackImage'>;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function HubImage({ space, alt, sizes, priority, className }: HubImageProps) {
  const [src, setSrc] = useState<string>(space.image);

  useEffect(() => {
    setSrc(space.image);
  }, [space.image]);

  return (
    <div className={cn('relative overflow-hidden bg-surface-sunken', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => {
          setSrc((current) => (current === space.image ? space.fallbackImage : current));
        }}
      />
    </div>
  );
}
