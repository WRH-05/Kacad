# Kennedy Academy — Architecture & Design Guide

## 1. Project Context & Purpose
Kennedy Academy (El Biar, Algiers) is an elite modern academy and collaborative creative hub:
- Pillars: Technology (AI, robotics, coding, electronics, 3D modelling), Digital Arts, and Specialized Languages (Technical English, German).
- Beyond a school: Functions as an open studio, hardware lab, and cafe/coworking hub for young creators, founders, and students when classes are not in session.
- Logo concept: An 8-pointed starburst created by 4 intersecting "K" letterforms.

## 2. Technical Stack & Routing Structure
- Framework: Next.js 15 (App Router), React 19, TypeScript
- Routing: Internationalized via `app/[locale]/` (DO NOT place root pages outside `[locale]`)
- Translations: Stored under `messages/` (supports EN and FR)
- Styling: Tailwind CSS v3.4 (configured via `tailwind.config.js`), `@tailwindcss/typography`, `@tailwindcss/forms`
- Icons: `lucide-react` and `@radix-ui/react-icons`
- Animation: `framer-motion`

## 3. Strict Design Rules (Preventing Generic Templates)
- Base Surface: Porcelain / warm chalk white (`#FBFBF9`), NOT sterile pure `#FFFFFF` and NOT heavy yellow-beige. Dark ink text (`#111116`) for crisp editorial hierarchy.
- Color System (Eras via CSS variables):
  - Primary Default: Ultramarine Blue (`#0D00A4`) + Saffron/Marigold (`#FDB851`).
  - Keep colors customizable via variables so future seasonal "eras" can swap accents.
- Typography:
  - Headings: High-contrast luxury editorial serif (`font-serif`).
  - Body & UI: Clean, modern neo-grotesque sans (`font-sans`).
  - Labels & Badges: Monospace uppercase with tracking (`font-mono tracking-wider`).
- Layout Philosophy:
  - NO generic purple SaaS gradients.
  - NO uniform grid of cards with centered icons.
  - Generous architectural white space, asymmetrical layouts, and editorial framing.

## 4. Key Sections & Components to Implement
- `AsteriskLogo`: Kinetic SVG featuring the 4-K intersection story.
- `Hero`: High-impact editorial headline, campus location tag (El Biar), live space status badge, and dual CTAs.
- `CampusHub`: Interactive showcase of the physical space (Robotics lab, media studio, cafe/coworking).
- `CourseMatrix`: Filterable catalog by category (Tech, Arts, Languages) and age bracket.
- `CourseDrawerModal`: Slide-out syllabus details with a gate for brochure download & waitlist capture (Name, WhatsApp/Email, Age Group).
- `EraSwitcher`: Micro-pill to toggle color eras seamlessly via CSS variables.

## 5. Development Commands
- Dev Server: `npm run dev`
- Build: `npm run build`