'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type AsteriskLogoProps = {
  className?: string;
  title?: string;
  animated?: boolean;
  /** Play the one-time bar-docking animation (hero only). */
  dock?: boolean;
  decorative?: boolean;
};

const BLUE = '#0A0099';
const SAFFRON = '#FCB351';
const DOCK_EASE: [number, number, number, number] = [0.12, 1, 0.2, 1];
const DOCK_DELAY = 0.4;
const DOCK_DURATION = 1.6;
const LAYER_STAGGER = 0.12;

/**
 * The reference mark: three continuous overlapping bars.
 * Paint order is vertical → saffron X → horizontal, so the horizontal bar
 * caps the centre cleanly with no chevrons or centre joints.
 */
export function AsteriskLogo({
  className,
  title = 'Kennedy Academy',
  animated = false,
  dock = false,
  decorative = false
}: AsteriskLogoProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const dockTransition = (stagger: number) =>
    reduceMotion
      ? { duration: 0 }
      : {
          duration: DOCK_DURATION,
          ease: DOCK_EASE,
          delay: DOCK_DELAY + stagger
        };

  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      className={cn('origin-center overflow-visible', className)}
      style={{ transformOrigin: '50% 50%' }}
      whileHover={animated && !reduceMotion ? { rotate: 45 } : undefined}
      transition={{ type: 'spring', stiffness: 120, damping: 18, mass: 1.1 }}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      {!decorative ? <title>{title}</title> : null}

      {/* Base layer: vertical blue bar, entering from the top. */}
      <motion.g
        initial={dock ? { y: -64, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={dockTransition(0)}
      >
        <line
          x1="100"
          y1="20"
          x2="100"
          y2="180"
          stroke={BLUE}
          strokeWidth="16"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Middle layer: saffron diagonal X, fading in. */}
      <motion.g
        initial={dock ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={dockTransition(LAYER_STAGGER)}
      >
        <line
          x1="38"
          y1="38"
          x2="162"
          y2="162"
          stroke={SAFFRON}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <line
          x1="162"
          y1="38"
          x2="38"
          y2="162"
          stroke={SAFFRON}
          strokeWidth="16"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Top layer: horizontal blue bar, entering from the right. */}
      <motion.g
        initial={dock ? { x: 64, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        transition={dockTransition(LAYER_STAGGER * 2)}
      >
        <line
          x1="20"
          y1="100"
          x2="180"
          y2="100"
          stroke={BLUE}
          strokeWidth="16"
          strokeLinecap="round"
        />
      </motion.g>
    </motion.svg>
  );
}
