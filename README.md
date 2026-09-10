# Crypto Sentry

Crypto Sentry is a full-stack crypto market monitoring prototype. It displays CoinGecko price data, detects configured price drops through a background worker, stores alert history in PostgreSQL, and lets authenticated users maintain a personal watchlist.

## Features

- NextAuth login with Google OAuth and optional email magic links
- Live dashboard for Bitcoin, Ethereum, Cardano, Tether, and Solana
- 24-hour movement, stable/critical status, and live/stale indicators
- Per-user watchlist with optimistic add/remove interaction
- Persisted global crypto alert history
- CoinGecko polling worker with retry and HTTP 429 backoff handling
- Resend alert-email attempt when a configured drop is detected
- Browser cache fallback when the local worker is unavailable
- Responsive dark dashboard UI

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js server actions, Express 5, Node.js
- **Database:** PostgreSQL, Prisma 7, `pg`
- **Authentication:** NextAuth 4, Google OAuth, optional SMTP email provider
- **External services:** CoinGecko and Resend

## Getting Started

### Prerequisites

- Node.js and npm
- Docker, or another PostgreSQL instance
- OAuth, SMTP, and Resend credentials if those features are needed

### Install and run

```bash
git clone <repository-url>
cd crypto-sentry
npm install
docker compose up -d database
```

Create a local `.env` file with the variables below, then apply the Prisma migrations:

```bash
npx prisma migrate deploy
```

Run the web app and worker in separate terminals:

```bash
npm run dev
npm run worker
```

Open [http://localhost:3000](http://localhost:3000). The worker serves market data at `http://localhost:3001/price`.

## Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=
RESEND_API_KEY=
```

Google variables enable Google sign-in. The `EMAIL_*` variables enable the passwordless email provider. `RESEND_API_KEY` enables worker alert-email attempts. Never commit secret values.

## Project Structure

```text
app/                  Next.js pages, components, auth, Prisma access, and server actions
prisma/               Schema and database migrations
server.ts             Express market-data and alert worker
compose.yaml          Local PostgreSQL service
middleware.ts         NextAuth route protection
```

## Screenshots

<!-- Add dashboard screenshot here -->

<!-- Add alert history screenshot here -->

## Status

Portfolio/demo prototype. The web app and local worker are implemented, but the worker is a separate local process and alert delivery is not a production-grade personalized notification system.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
