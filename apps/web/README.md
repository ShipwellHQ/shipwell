# @shipwell/web

Next.js 15 web application for Shipwell. Real-time streaming analysis with a polished dark UI.

## Setup

1. Create `apps/web/.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

2. Start the dev server:

```bash
pnpm dev:web
```

3. Open [http://localhost:3000](http://localhost:3000)

## Features

- **Google sign-in** via Firebase Authentication
- **Real-time streaming** — findings appear as Claude discovers them
- **Activity log** with Claude Code-style thinking indicator (`✶ Crafting...`)
- **Severity-coded finding cards** with cross-file badges
- **Before/after metric cards** with trend detection
- **Diff viewer** for code changes
- **Model selector** — switch between Sonnet, Opus, and Haiku
- **SVG ship logo loader** with draw animation
- **Dark theme** with accent colors and subtle animations

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (redirects to /analysis if logged in) |
| `/login` | Google sign-in |
| `/analysis` | Main analysis interface |
| `/settings` | API key and model configuration |
| `/profile` | User profile |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/analyze` | POST | SSE streaming analysis endpoint |

## Tech

- Next.js 15 with App Router and Turbopack
- React 19
- Tailwind CSS v4
- Framer Motion for animations
- Firebase for auth
- SSE streaming via fetch + ReadableStream
