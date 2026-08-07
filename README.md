# URL Shortener

A URL shortener built with Next.js. Paste a long URL, get a short code back plus a downloadable QR code — links expire automatically after 24 hours.

**Live:** [url-shortener-sepia-six.vercel.app](https://url-shortener-sepia-six.vercel.app)

## Features

- Shorten any URL into a random short code
- Auto-expiring links (24-hour TTL) backed by Upstash Redis
- QR code generation for the shortened link, downloadable as PNG
- Per-IP rate limiting (10 requests / 10s) via `@upstash/ratelimit`
- Form validation with `react-hook-form` + `zod`
- UI built with shadcn/ui, Radix primitives, and Tailwind CSS

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Data:** Upstash Redis (key-value store with TTL)
- **Validation:** Zod + React Hook Form
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Deployment:** Vercel

## How It Works

1. The client form (`app/page.tsx`) submits a long URL through a Next.js Server Action (`app/actions.ts`).
2. The action calls an internal API route (`app/api/route.ts`), which rate-limits the request by IP, generates a random short code, and stores `{ longUrl, shortUrl, createdAt }` in Redis with a 24-hour expiry (`lib/url-store.ts`).
3. The client renders the short URL and a QR code (via the `qrcode` package) pointing to it.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Requires Upstash Redis credentials (used by both rate limiting and URL storage) and a base URL for the internal API call:

```bash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
BASE_URL=http://localhost:3000
```

## Deploy

Deployed on [Vercel](https://vercel.com).
