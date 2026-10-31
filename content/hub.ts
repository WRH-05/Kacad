export const hubSpaceIds = ['robotics-lab', 'media-studio', 'cafe-coworking'] as const;
export type HubSpaceId = (typeof hubSpaceIds)[number];

export type HubSpace = {
  id: HubSpaceId;
  /** Local primary asset. */
  image: `/images/hub/${string}.webp`;
  /** Local fallback used if the primary file is missing or fails to load. */
  fallbackImage: `/images/hub/${string}.webp`;
  orientation: 'landscape' | 'portrait' | 'square';
  credit: { name: string; url: string };
};

export const hubSpaces: readonly HubSpace[] = [
  {
    id: 'robotics-lab',
    image: '/images/hub/robotics-lab.webp',
    fallbackImage: '/images/hub/fallback.webp',
    orientation: 'landscape',
    credit: { name: 'Unsplash', url: 'https://unsplash.com' }
  },
  {
    id: 'media-studio',
    image: '/images/hub/media-studio.webp',
    fallbackImage: '/images/hub/fallback.webp',
    orientation: 'landscape',
    credit: { name: 'Unsplash', url: 'https://unsplash.com' }
  },
  {
    id: 'cafe-coworking',
    image: '/images/hub/cafe-coworking.webp',
    fallbackImage: '/images/hub/fallback.webp',
    orientation: 'landscape',
    credit: { name: 'Unsplash', url: 'https://unsplash.com' }
  }
];
