'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AsteriskLogo } from '@/components/brand/asterisk-logo';
import { TrackEmblem } from '@/components/brand/track-emblem';
import type { CourseId, CourseTrack } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import { buildLocaleHref, type Locale, locales } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export type ProgrammeLink = {
  id: CourseId;
  track: CourseTrack;
  title: string;
  ageLabel: string;
};

type SiteNavbarProps = {
  locale: Locale;
  nav: Dictionary['nav'];
  programmes: readonly ProgrammeLink[];
};

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR'
};

const programmeColumns: readonly CourseTrack[] = ['tech', 'arts', 'languages'];

const CLOSE_DELAY = 180;

type ProgrammeColumnProps = {
  track: CourseTrack;
  heading: string;
  programmes: readonly ProgrammeLink[];
  locale: Locale;
  onNavigate: () => void;
};

function ProgrammeColumn({
  track,
  heading,
  programmes,
  locale,
  onNavigate
}: ProgrammeColumnProps) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
        {track === 'arts' ? <TrackEmblem track="arts" className="h-3.5 w-3.5" /> : null}
        {heading}
      </h2>
      <ul className="mt-5 space-y-4">
        {programmes.map((programme) => (
          <li key={programme.id}>
            <Link
              href={routes.course(locale, programme.id)}
              onClick={onNavigate}
              className="group block"
            >
              <span className="block font-serif text-lg leading-snug text-ink transition group-hover:text-accent">
                {programme.title}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                {programme.ageLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteNavbar({ locale, nav, programmes }: SiteNavbarProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgrammesOpen, setMobileProgrammesOpen] = useState(false);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const contactPath = routes.contact(locale);
  const isContactActive = pathname === contactPath;
  const isProgrammesActive = pathname.startsWith(`/${locale}/courses`);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openProgrammes() {
    clearCloseTimer();
    setProgrammesOpen(true);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setProgrammesOpen(false), CLOSE_DELAY);
  }

  function closeProgrammes() {
    clearCloseTimer();
    setProgrammesOpen(false);
  }

  function closeMobile() {
    setMobileOpen(false);
    setMobileProgrammesOpen(false);
  }

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    clearCloseTimer();
    const willOpen = !programmesOpen;
    setProgrammesOpen(willOpen);

    // `detail === 0` means keyboard activation: move into the panel.
    if (willOpen && event.detail === 0) {
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
      });
    }
  }

  function handleWrapperBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      scheduleClose();
    }
  }

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  useEffect(() => {
    closeProgrammes();
    closeMobile();
    // Close both menus whenever the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!programmesOpen) return;

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        closeProgrammes();
        triggerRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      closeProgrammes();
    }

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programmesOpen]);

  const navLinkClass = (active: boolean) =>
    cn(
      'font-mono text-[9px] uppercase tracking-[0.18em] transition',
      active ? 'text-accent' : 'text-ink-muted hover:text-accent'
    );

  const groupedProgrammes = (track: CourseTrack) =>
    programmes.filter((programme) => programme.track === track);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-surface/90 backdrop-blur-md">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link href={routes.home(locale)} className="group flex items-center gap-3">
          <AsteriskLogo decorative animated className="h-8 w-8 shrink-0" />
          <span className="font-serif text-lg leading-none text-ink">Kennedy Academy</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={nav.aria.main}>
          <Link href={routes.section(locale, 'hub')} className={navLinkClass(false)}>
            {nav.hub}
          </Link>

          <div onMouseEnter={clearCloseTimer} onMouseLeave={scheduleClose} onBlur={handleWrapperBlur}>
            <button
              ref={triggerRef}
              type="button"
              aria-expanded={programmesOpen}
              aria-controls="programmes-mega"
              aria-haspopup="true"
              onClick={handleTriggerClick}
              onMouseEnter={openProgrammes}
              className={cn(
                'inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition',
                programmesOpen || isProgrammesActive
                  ? 'text-accent'
                  : 'text-ink-muted hover:text-accent'
              )}
            >
              {nav.programmes}
              <svg
                className={cn('h-2.5 w-2.5 transition-transform', programmesOpen && 'rotate-180')}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
              </svg>
            </button>

            <AnimatePresence>
              {programmesOpen ? (
                <motion.div
                  id="programmes-mega"
                  ref={panelRef}
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-full z-50 border-y border-line/60 bg-surface shadow-soft"
                >
                  <div className="section-shell py-8">
                    <div className="grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-line/40">
                      {programmeColumns.map((track) => (
                        <div key={track} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
                          <ProgrammeColumn
                            track={track}
                            heading={nav.mega.tracks[track]}
                            programmes={groupedProgrammes(track)}
                            locale={locale}
                            onNavigate={closeProgrammes}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 border-t border-line/50 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                        {nav.mega.intro}
                      </p>
                      <Link
                        href={routes.section(locale, 'courses')}
                        onClick={closeProgrammes}
                        className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent transition hover:text-accent/80"
                      >
                        {nav.mega.all}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <Link href={routes.section(locale, 'method')} className={navLinkClass(false)}>
            {nav.method}
          </Link>
          <Link
            href={contactPath}
            aria-current={isContactActive ? 'page' : undefined}
            className={navLinkClass(isContactActive)}
          >
            {nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 rounded-none border border-line/70 p-1"
            role="group"
            aria-label={nav.aria.switchLanguage}
          >
            {locales.map((loc) => (
              <Link
                key={loc}
                href={buildLocaleHref(pathname, loc)}
                aria-current={loc === locale ? 'page' : undefined}
                className={cn(
                  'rounded-none px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition',
                  loc === locale
                    ? 'bg-accent text-accent-ink'
                    : 'text-ink-muted hover:text-accent'
                )}
              >
                {localeLabels[loc]}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-none border border-line/70 p-2 text-ink lg:hidden"
            aria-label={mobileOpen ? nav.aria.closeMenu : nav.aria.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((open) => !open);
              setMobileProgrammesOpen(false);
            }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line/60 bg-surface px-6 py-4 lg:hidden"
          aria-label={nav.aria.mobile}
        >
          <ul className="flex flex-col">
            <li>
              <Link
                href={routes.section(locale, 'hub')}
                className="block border-b border-line/50 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
                onClick={closeMobile}
              >
                {nav.hub}
              </Link>
            </li>
            <li>
              <button
                type="button"
                aria-expanded={mobileProgrammesOpen}
                aria-controls="mobile-programmes"
                onClick={() => setMobileProgrammesOpen((open) => !open)}
                className="flex w-full items-center justify-between border-b border-line/50 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
              >
                {nav.programmes}
                <svg
                  className={cn(
                    'h-3 w-3 transition-transform',
                    mobileProgrammesOpen && 'rotate-180'
                  )}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 8l5 5 5-5" />
                </svg>
              </button>

              {mobileProgrammesOpen ? (
                <div id="mobile-programmes" className="space-y-6 border-b border-line/50 py-5 pl-4">
                  {programmeColumns.map((track) => (
                    <ProgrammeColumn
                      key={track}
                      track={track}
                      heading={nav.mega.tracks[track]}
                      programmes={groupedProgrammes(track)}
                      locale={locale}
                      onNavigate={closeMobile}
                    />
                  ))}
                  <Link
                    href={routes.section(locale, 'courses')}
                    onClick={closeMobile}
                    className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent"
                  >
                    {nav.mega.all}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : null}
            </li>
            <li>
              <Link
                href={routes.section(locale, 'method')}
                className="block border-b border-line/50 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
                onClick={closeMobile}
              >
                {nav.method}
              </Link>
            </li>
            <li>
              <Link
                href={contactPath}
                aria-current={isContactActive ? 'page' : undefined}
                className="block py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
                onClick={closeMobile}
              >
                {nav.contact}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
