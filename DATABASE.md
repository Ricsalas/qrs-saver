# Database Setup Guide

This document explains how to set up and use the database for QRS Saver.

## Overview

QRS Saver now uses a PostgreSQL database (via Prisma) to store offers from various sources. The database is updated hourly via a cron job that fetches offers from multiple providers.

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database instance. Options:
   - **Local**: Install PostgreSQL locally
   - **Supabase**: Free PostgreSQL hosting (recommended for quick setup)
   - **Neon**: Serverless PostgreSQL (good for Vercel deployments)
   - **Vercel Postgres**: Vercel's managed PostgreSQL

2. **Environment Variables**: Create a `.env` file (see `.env.example` for reference):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/qrs_saver?schema=public"
   OPENAI_API_KEY="sk-your-key-here"
   CRON_SECRET="your-random-secret-here"
   ```

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install Prisma and @prisma/client.

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This generates the TypeScript types for your database schema.

### 3. Push Database Schema

For development (creates/updates the database schema):

```bash
npm run db:push
```

Or, for production (creates migration files):

```bash
npm run db:migrate
```

### 4. Populate Initial Data (Optional)

You can manually trigger the cron endpoint to populate the database with initial offers:

```bash
curl -X POST http://localhost:3000/api/cron/update-offers \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Database Schema

The `Offer` model includes:
- `id`: UUID primary key
- `externalId`: ID from the aggregator (e.g., Uber Eats product ID)
- `source`: One of `uber_eats`, `rappi`, `pedidos_ya`, or `direct`
- `chain`: Restaurant chain name
- `name`: Offer name
- `price`: Current price
- `currency`: Currency code (default: "CLP")
- `originalPrice`: Original price before discount
- `discountPercentage`: Calculated discount percentage
- `description`, `category`, `tags`, `imageUrl`: Additional metadata
- `url`: Link to the offer
- `locationLat`, `locationLng`, `locationAddress`, `city`: Location data
- `validUntil`: Expiration date (optional)
- `isActive`: Whether the offer is currently active
- `createdAt`, `updatedAt`: Timestamps

## Architecture

### Data Flow

1. **Fetchers** (`lib/fetchers/*.ts`): Fetch offers from different sources
   - Currently returns mocked data
   - TODO: Implement real API integrations

2. **Cron Endpoint** (`app/api/cron/update-offers/route.ts`):
   - Runs every hour (configured in `vercel.json`)
   - Calls all fetchers in parallel
   - Upserts offers into the database
   - Marks missing offers as inactive

3. **API Endpoints**:
   - `/api/offers`: Returns active offers from database
   - `/api/recommend`: Uses database offers for AI recommendations

### Key Functions

- `upsertOffers(source, offers[])`: Creates or updates offers for a source
- `getActiveOffers()`: Returns all active, non-expired offers
- `getOfferCountsBySource()`: Returns counts grouped by source

## Environment Variables

### Required

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for recommendations
- `CRON_SECRET`: Secret for protecting the cron endpoint

### Optional (for future API integrations)

- `UBER_EATS_API_KEY`: Uber Eats API key
- `RAPPI_API_KEY`: Rappi API key
- `RAPPI_API_SECRET`: Rappi API secret
- `PEDIDOS_YA_API_KEY`: PedidosYa API key
- `PEDIDOS_YA_COUNTRY`: Country code (default: "CL")

## Vercel Deployment

### 1. Add Environment Variables

In your Vercel project settings, add:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `CRON_SECRET`

### 2. Database Connection

For production, use a managed PostgreSQL service:
- **Supabase**: Get the connection string from project settings
- **Neon**: Get the connection string from dashboard
- **Vercel Postgres**: Automatically connected if using Vercel Postgres

### 3. Run Migrations

After deployment, run:
```bash
npx prisma migrate deploy
```

Or use Vercel's build command which should include:
```bash
prisma generate && next build
```

### 4. Verify Cron Job

The cron job is automatically configured via `vercel.json`. After deployment, check:
- Vercel Dashboard → Settings → Cron Jobs
- Verify `/api/cron/update-offers` is scheduled to run hourly

## Testing Locally

### Manual Cron Trigger

```bash
curl -X POST http://localhost:3000/api/cron/update-offers \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Check Database

Use Prisma Studio to inspect the database:

```bash
npm run db:studio
```

This opens a browser interface at `http://localhost:5555`.

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- For Vercel, ensure database allows connections from Vercel IPs

### Prisma Client Not Found

Run `npm run db:generate` to regenerate the Prisma client.

### Cron Job Not Running

- Check `vercel.json` is committed and deployed
- Verify cron job appears in Vercel dashboard
- Check cron endpoint logs in Vercel dashboard

## Next Steps

1. **Implement Real API Integrations**: Replace mocked data in fetchers with real API calls
2. **Add Monitoring**: Set up error tracking (e.g., Sentry) for cron jobs
3. **Optimize Queries**: Add indexes if query performance becomes an issue
4. **Add Caching**: Consider caching offer results for faster API responses

