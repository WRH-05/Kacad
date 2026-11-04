'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { AsteriskLogo } from './asterisk-logo';

const MOBILE_QUERY = '(max-width: 767px)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Mobile-only scroll rotation. The outer motion element owns the scroll
 * transform while the logo keeps its weighted hover rotation, so the two
 * compose instead of fighting over `rotate`.
 */
export function HeroAsterisk({ className }: { className?: string }) {
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 500], [0, 180]);

  return (
    <motion.div
      className={className}
      style={isMobile && !reduceMotion ? { rotate } : undefined}
    >
      <AsteriskLogo animated decorative className="h-full w-full" />
    </motion.div>
  );
}
