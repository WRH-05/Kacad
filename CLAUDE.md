# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Next.js 15** (App Router) with `typedRoutes: true` — use `Route` from `next` for href typing
- **React 19**, **TypeScript** (strict, ESNext modules, Bundler resolution)
- **Tailwind CSS 3** with `@tailwindcss/forms` and `@tailwindcss/typography` plugins
- **Radix UI** primitives (navigation-menu, icons) + `class-variance-authority`

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (next/core-web-vitals)
```

No test runner is configured yet.

## Architecture

### i18n (English & French)

Locales are defined in `lib/i18n.ts`. The middleware (`middleware.ts`) inspects the URL path prefix (`/en`, `/fr`) and:

1. Skips `/_next`, `/api`, static files, and `favicon`/`robots.txt`/`sitemap.xml`
2. Extracts the locale from the first URL segment
3. If missing, falls back to the `NEXT_LOCALE` cookie → `defaultLocale` ('en'), then redirects to the prefixed URL
4. Sets `x-locale` header for downstream server components to read

Translations live in `messages/` as JSON files. The `Dictionary` type is derived from `messages/en.json` (the canonical shape). Server components load translations via `getDictionary(locale)` in `lib/dictionaries.ts`, which dynamically imports the appropriate JSON.

### Routing

```
app/
  layout.tsx          → Root layout: fonts (DM Sans, Fraunces), global CSS, reads x-locale header → <html lang>
  page.tsx            → Redirects / → /en (defaultLocale)
  [locale]/
    layout.tsx        → Locale shell: generateStaticParams for all locales, validates locale,
                        validates locale, loads dictionary, wraps children in SiteNavbar + SiteFooter
    page.tsx          → Home page composed of sections: Hero, Courses, Testimonials, WhyUs
    become-a-tutor/
      page.tsx        → Tutor recruitment page
```

### Data flow

- **Content data** (`content/courses.ts`, `content/testimonials.ts`): typed TypeScript arrays keyed by string IDs. Courses include category, age range, and tag metadata.
- **Translations** (`messages/`): all user-facing text, keyed to match the English JSON shape. Components receive dictionary slices as props (e.g., `hero={dictionary.hero}`, `nav={dictionary.nav}`).

### Component conventions

- **Server components by default** — only `'use client'` when needed (currently only `site-navbar.tsx` for `usePathname` and local state)
- **`components/ui/`**: Radix primitives wrapped with `cn()` from `lib/utils.ts` and `cva` variants
- **`components/sections/`**: page-level sections that receive their text via dictionary props
- **`section-shell` class** (Tailwind `@layer components` in `globals.css`): the standard content wrapper (`max-w-7xl mx-auto px-6 lg:px-8`)

### Design tokens

Custom brand colors (`navy`, `gold`, `paper`, `ink`, `sand`, `terracotta`, `cream`), font families (`font-sans` = DM Sans, `font-display` = Fraunces), and shadow utilities (`shadow-glow`, `shadow-soft`, `shadow-card`) are defined in `tailwind.config.ts`. CSS custom properties in `globals.css` mirror the brand palette as RGB channels.

### Path aliases

`@/*` maps to `./*` (via `tsconfig.json` `paths`). Imports from project root use `@/lib/...`, `@/components/...`, etc.

### Arabic locale

The README mentions three locales including Arabic, but only `en` and `fr` are currently implemented in `lib/i18n.ts`. Adding a third locale requires: adding it to the `locales` array, creating `messages/ar.json`, updating the `getDictionary` switch, and setting `dir="rtl"` conditionally in the root layout.
