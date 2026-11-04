'use client';

import type { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const POLL_INTERVAL_MS = 20_000;
const DEBOUNCE_MS = 400;

/**
 * Realtime-first lead sync with a polling fallback. Events only trigger a
 * server refresh; rows are always re-read through RLS.
 */
export function LeadsLiveSync({ paused }: { paused: boolean }) {
  const router = useRouter();
  const pausedRef = useRef(paused);
  const wasPaused = useRef(paused);

  pausedRef.current = paused;

  useEffect(() => {
    if (wasPaused.current && !paused) {
      router.refresh();
    }

    wasPaused.current = paused;
  }, [paused, router]);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let channel: RealtimeChannel | null = null;
    let supabase: ReturnType<typeof createClient> | null = null;

    const schedule = () => {
      if (pausedRef.current || disposed) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        if (!pausedRef.current && !disposed) router.refresh();
      }, DEBOUNCE_MS);
    };

    try {
      supabase = createClient();
      channel = supabase
        .channel('admin-waitlist-leads')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'waitlist_leads' },
          schedule
        )
        .subscribe();
    } catch (error) {
      console.warn('[admin] realtime unavailable; falling back to polling', error);
    }

    const poll = setInterval(() => {
      if (document.hidden || pausedRef.current) return;
      router.refresh();
    }, POLL_INTERVAL_MS);

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      clearInterval(poll);

      if (supabase && channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [router]);

  return null;
}
