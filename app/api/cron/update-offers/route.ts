import { NextRequest, NextResponse } from 'next/server';
import { fetchUberEatsOffers } from '@/lib/fetchers/uberEats';
import { fetchRappiOffers } from '@/lib/fetchers/rappi';
import { fetchPedidosYaOffers } from '@/lib/fetchers/pedidosYa';
import { fetchDirectRestaurantOffers } from '@/lib/fetchers/directRestaurants';
import { upsertOffers, getOfferCountsBySource } from '@/lib/db/offers';
import { OfferSource } from '@/types/offer';

/**
 * Cron endpoint to update offers from all sources
 * 
 * This endpoint is called by Vercel Cron Jobs every hour.
 * 
 * Security: Protected by CRON_SECRET environment variable.
 * Vercel Cron Jobs automatically add this header, but we validate it for extra security.
 * 
 * For local testing, you can call this endpoint with:
 * curl -X POST http://localhost:3000/api/cron/update-offers \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Security: Verify the request is from Vercel Cron or has the correct secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret) {
    const expectedAuth = `Bearer ${cronSecret}`;
    if (authHeader !== expectedAuth) {
      console.warn('Unauthorized cron request - invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  } else {
    // In development, log a warning if CRON_SECRET is not set
    if (process.env.NODE_ENV === 'development') {
      console.warn('CRON_SECRET not set - cron endpoint is unprotected');
    }
  }

  const results: {
    source: OfferSource;
    success: boolean;
    count: number;
    error?: string;
    upsertResult?: {
      created: number;
      updated: number;
      deactivated: number;
    };
  }[] = [];

  // Fetch from all sources in parallel
  const fetchers = [
    { source: 'uber_eats' as OfferSource, fetch: fetchUberEatsOffers },
    { source: 'rappi' as OfferSource, fetch: fetchRappiOffers },
    { source: 'pedidos_ya' as OfferSource, fetch: fetchPedidosYaOffers },
    { source: 'direct' as OfferSource, fetch: fetchDirectRestaurantOffers },
  ];

  // Process each fetcher independently so one failure doesn't break others
  for (const { source, fetch } of fetchers) {
    try {
      console.log(`[Cron] Fetching offers from ${source}...`);
      
      // Check if required environment variables are set (optional check)
      // This is just a safeguard - fetchers will handle missing keys gracefully
      const offers = await fetch();
      
      if (!Array.isArray(offers) || offers.length === 0) {
        console.warn(`[Cron] No offers returned from ${source}`);
        results.push({
          source,
          success: true,
          count: 0,
        });
        continue;
      }

      console.log(`[Cron] Found ${offers.length} offers from ${source}`);
      
      // Upsert offers into database
      const upsertResult = await upsertOffers(source, offers);
      
      console.log(
        `[Cron] ${source}: created=${upsertResult.created}, ` +
        `updated=${upsertResult.updated}, deactivated=${upsertResult.deactivated}`
      );

      results.push({
        source,
        success: true,
        count: offers.length,
        upsertResult,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Cron] Error fetching offers from ${source}:`, errorMessage);
      
      results.push({
        source,
        success: false,
        count: 0,
        error: errorMessage,
      });
    }
  }

  // Get current offer counts by source
  let currentCounts: Record<OfferSource, number> | null = null;
  try {
    currentCounts = await getOfferCountsBySource();
  } catch (error) {
    console.error('[Cron] Error getting offer counts:', error);
  }

  const duration = Date.now() - startTime;
  const totalUpdated = results.reduce((sum, r) => sum + (r.upsertResult?.created || 0) + (r.upsertResult?.updated || 0), 0);
  const totalCreated = results.reduce((sum, r) => sum + (r.upsertResult?.created || 0), 0);
  const totalDeactivated = results.reduce((sum, r) => sum + (r.upsertResult?.deactivated || 0), 0);

  console.log(`[Cron] Update completed in ${duration}ms. Total: ${totalUpdated} offers processed`);

  const response = {
    success: true,
    timestamp: new Date().toISOString(),
    duration: `${duration}ms`,
    summary: {
      totalCreated,
      totalUpdated,
      totalDeactivated,
    },
    sourceBreakdown: results.reduce(
      (acc, r) => ({
        ...acc,
        [r.source]: {
          success: r.success,
          count: r.count,
          created: r.upsertResult?.created || 0,
          updated: r.upsertResult?.updated || 0,
          deactivated: r.upsertResult?.deactivated || 0,
          error: r.error || null,
        },
      }),
      {} as Record<string, any>
    ),
    currentCounts: currentCounts || undefined,
  };

  return NextResponse.json(response, { status: 200 });
}

