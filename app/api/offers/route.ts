import { NextResponse } from 'next/server';
import { getActiveOffers } from '@/lib/db/offers';
import { offers as fallbackOffers } from '@/data/offers';

/**
 * GET /api/offers
 * 
 * Returns all active offers from the database.
 * If the database is empty (e.g., during initial development), falls back to hardcoded offers.
 */
export async function GET() {
  try {
    const dbOffers = await getActiveOffers();
    
    // Fallback to hardcoded offers if database is empty (useful for initial development)
    // TODO: Remove this fallback once the database is populated via cron jobs
    const offers = dbOffers.length > 0 ? dbOffers : fallbackOffers;
    
    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Error fetching offers from database:', error);
    
    // If database query fails, fall back to hardcoded offers as a safety net
    // TODO: Remove this fallback once database stability is ensured
    return NextResponse.json({ offers: fallbackOffers });
  }
}

