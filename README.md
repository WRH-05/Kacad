# Kennedy Academy

Editorial marketing site for Kennedy Academy — a technology, digital arts and
languages academy and open creative hub in El Biar, Algiers.

## Stack

- Next.js 15 App Router, React 19, TypeScript (strict)
- Tailwind CSS 3 with custom era tokens
- Radix Dialog, Framer Motion
- English and French dictionaries in `messages/`

## Structure

- `app/[locale]/` — localized routes (`/en`, `/fr`) and the Contact page
- `app/api/` — waitlist and contact form endpoints
- `components/sections/` — page sections (hero, hub, course matrix, method, testimonials, contact)
- `components/forms/` — waitlist and inquiry forms
- `content/` — typed course, hub and contact data
- `lib/` — i18n, opening hours, validation, webhook forwarding
- `messages/` — EN/FR translation JSON
- `public/` — hub photography, fallback image and brochure

## Development

```bash
npm run dev
npm run lint
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env.local` and configure:

- `WAITLIST_WEBHOOK_URL` — receives waitlist payloads
- `CONTACT_WEBHOOK_URL` — optional; falls back to the waitlist URL
- `BROCHURE_URL` — optional override for the bundled syllabus PDF
- `WEBHOOK_SECRET` — optional `x-kennedy-secret` header
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — optional staging override

Without a contact webhook, the inquiry form succeeds in development but returns
`503 not_configured` in production so inquiries are never silently dropped.

## Notes

- `public/brochures/kennedy-academy-syllabus.pdf` is a placeholder. Replace it
  with the final brochure or set `BROCHURE_URL`.
- Hub photos in `public/images/hub/` are Unsplash placeholders. Replace them
  with real campus photography and update credits in `content/hub.ts`.
