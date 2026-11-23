# Infimum Consulting — website

A premium single-page website for Infimum Consulting, built with the Next.js App Router. The site covers the six existing service lines, the four-stage consulting approach, and the two published contact regions.

## Stack

- Next.js 16 (App Router) and React 19
- TypeScript, Tailwind CSS 4
- Motion for React (reveals and the infinite gallery)
- Radix Dialog (mobile navigation)
- Zod (shared contact validation)
- Microsoft Graph API (contact delivery)
- `next/font` with local font files

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run typecheck
npx eslint src scripts
npm run build
npm start
```

## Content and structure

- `src/data/services.ts` — the six services and their capabilities
- `src/data/site-config.ts` — contact numbers, locations and site metadata
- `src/data/navigation.ts` — primary navigation
- `src/components/sections/` — page sections
- `src/app/page.tsx` — section composition and JSON-LD

The published phone numbers are Australia `+61 405 364 625` and the United States `+1 970 387 8989`. The site intentionally does not invent an email address, social profiles, testimonials, statistics or certifications.

## Hero technology carousel

The infinite carousel is integrated into the right column of the hero:

- `src/data/gallery.ts` — curated image array, captions, alt text and `galleryConfig.durationSeconds` (44 seconds per sequence)
- `src/components/gallery/InfiniteImageMarquee.tsx` — reusable Motion-based continuous track
- `src/components/sections/HeroSection.tsx` — hero copy, CTAs and carousel placement

The track renders the sequence twice. The duplicate is `aria-hidden`, its images have empty alt text, and the animation wraps by the measured distance between the two group origins, so the seam uses the same gap as every other card. The carousel pauses on hover and keyboard focus, supports mouse/touch drag and arrow keys, and stops automatic movement under `prefers-reduced-motion`. Images use `next/image` with a reserved 4:5 card, explicit `sizes`, three eager above-the-fold images and lazy loading for the rest.

### Replacing the placeholders

The gallery now uses four client-supplied images from `public/branding/` only. See `src/data/gallery.ts` for alt text and captions; no third-party placeholder photography is used.

## Contact email

The form is wired to `src/app/api/contact/route.ts` and Microsoft Graph. Copy `.env.example` to `.env.local` and set:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
MICROSOFT_TENANT_ID=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_SENDER_EMAIL=...
CONTACT_TO_EMAIL=...
```

Without the Microsoft Graph values, the endpoint returns `503` with `NOT_CONFIGURED`; the UI reports that the form is not connected and offers the Australian phone number. It never displays a fake success. The in-memory rate limit is a single-instance safeguard; a shared store is needed for a multi-instance deployment.

## QA

The repository includes `scripts/qa.mjs` (Puppeteer + axe-core). Build to an isolated directory when another dev server is using `.next`:

```bash
NEXT_DIST_DIR=.next-qa npm run build
NEXT_DIST_DIR=.next-qa npm run start -- -p 4321
QA_BASE=http://localhost:4321 node scripts/qa.mjs
```

The latest run covered 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px with no horizontal overflow; confirmed 18 rendered hero carousel cards (nine + hidden duplicate), equal group widths, a 20px seam gap matching the track gap, autoplay movement, hover/focus pause, keyboard stepping and reduced-motion stop; checked navigation, the mobile menu, contact validation and the unconfigured email path; and recorded zero axe WCAG 2.2 A/AA violations on desktop and with the mobile menu open. A separate touch-emulated mobile drag moved the carousel while reduced motion was active. The only console error was the intentional `503` from the unconfigured form test.

Screenshots and the machine-readable report are written to `_screenshots/` (gitignored).

## Before launch

- Configure the Microsoft Entra app registration, grant admin consent for Mail.Send, and restrict it to the sending mailbox.
- Confirm the canonical production domain in `NEXT_PUBLIC_SITE_URL`.
- Confirm the phone numbers and any legal/consent requirements; privacy policy URL is still a launch dependency.
- Replace the raster logo with a vector version if available.
- Confirm carousel image rights/captions for the four client-supplied images.
- Decide whether a privacy policy and consent copy are required.
- A nonce-based Content Security Policy is not enabled because it would force dynamic rendering; add it if the deployment model allows.
- Lighthouse was not run as part of this pass; no score is claimed.
