'use client';

import { useEffect, useState } from 'react';
import { contactInfo, timeZone } from '@/content/contact';
import type { Dictionary } from '@/lib/dictionaries';
import { getOpenState, type OpenState } from '@/lib/hours';
import { cn, interpolate } from '@/lib/utils';

type SpaceStatusBadgeProps = {
  labels: Dictionary['hub']['status'];
  initial: OpenState;
  className?: string;
};

function describe(state: OpenState, labels: Dictionary['hub']['status']): string {
  if (state.isOpen) {
    if (state.nextChange?.kind === 'closes') {
      return interpolate(labels.openUntil, { time: state.nextChange.at });
    }
    return labels.open;
  }

  if (state.nextChange?.kind === 'opens') {
    if (state.nextChange.dayOffset === 0) {
      return interpolate(labels.opensAt, { time: state.nextChange.at });
    }
    if (state.nextChange.dayOffset === 1) {
      return interpolate(labels.opensTomorrow, { time: state.nextChange.at });
    }
    return interpolate(labels.opensAt, { time: state.nextChange.at });
  }

  return labels.closed;
}

export function SpaceStatusBadge({ labels, initial, className }: SpaceStatusBadgeProps) {
  const [state, setState] = useState<OpenState>(initial);

  useEffect(() => {
    const tick = () => setState(getOpenState(new Date(), contactInfo.hours, timeZone));
    tick();
    const interval = window.setInterval(tick, 60_000);
    document.addEventListener('visibilitychange', tick);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]',
        state.isOpen ? 'text-accent' : 'text-ink-muted',
        className
      )}
      role="status"
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          state.isOpen ? 'bg-highlight' : 'bg-ink-muted/60'
        )}
        aria-hidden="true"
      />
      {describe(state, labels)}
    </span>
  );
}
