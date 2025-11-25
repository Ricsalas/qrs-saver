import { prisma } from '@/lib/prisma';
import { NormalizedOffer, OfferSource } from '@/types/offer';
import { Offer } from '@/types';

/**
 * Data access layer for offers stored in the database
 */

/**
 * Upsert offers for a given source
 * - If an offer with the same externalId + source exists, it will be updated
 * - If it doesn't exist, it will be created
 * - Offers from the same source that are not in the new list will be marked as inactive
 */
export async function upsertOffers(
  source: OfferSource,
  newOffers: NormalizedOffer[]
): Promise<{ created: number; updated: number; deactivated: number }> {
  let created = 0;
  let updated = 0;

  // Get all existing external IDs for this source (for deactivation tracking)
  const existingOffers = await prisma.offer.findMany({
    where: { source, isActive: true },
    select: { externalId: true },
  });
  const existingExternalIds = new Set(existingOffers.map((o) => o.externalId));
  const newExternalIds = new Set(newOffers.map((o) => o.externalId));

  // Upsert each new offer using Prisma's upsert for atomicity
  for (const offer of newOffers) {
    const baseData = {
      chain: offer.chain,
      name: offer.name,
      price: offer.price,
      currency: offer.currency || 'CLP',
      originalPrice: offer.originalPrice ?? null,
      discountPercentage:
        offer.discountPercentage ??
        (offer.originalPrice && offer.originalPrice > offer.price
          ? ((offer.originalPrice - offer.price) / offer.originalPrice) * 100
          : null),
      description: offer.description || null,
      category: offer.category || null,
      tags: offer.tags || [],
      imageUrl: offer.imageUrl || null,
      url: offer.url,
      locationLat: offer.locationLat ?? null,
      locationLng: offer.locationLng ?? null,
      locationAddress: offer.locationAddress || null,
      city: offer.city || null,
      validUntil: offer.validUntil || null,
      isActive: true,
    };

    const wasExisting = existingExternalIds.has(offer.externalId);
    
    await prisma.offer.upsert({
      where: {
        externalId_source: {
          externalId: offer.externalId,
          source: offer.source,
        },
      },
      update: {
        ...baseData,
        updatedAt: new Date(),
      },
      create: {
        externalId: offer.externalId,
        source: offer.source,
        ...baseData,
      },
    });

    if (wasExisting) {
      updated++;
    } else {
      created++;
    }
  }

  // Mark offers that no longer appear as inactive
  const toDeactivate = Array.from(existingExternalIds).filter(
    (id) => !newExternalIds.has(id)
  );
  let deactivated = 0;
  if (toDeactivate.length > 0) {
    const result = await prisma.offer.updateMany({
      where: {
        source,
        externalId: { in: toDeactivate },
        isActive: true,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
    deactivated = result.count;
  }

  return { created, updated, deactivated };
}

/**
 * Get all active offers from the database
 * Returns offers in the format expected by the API endpoints
 */
export async function getActiveOffers(): Promise<Offer[]> {
  const dbOffers = await prisma.offer.findMany({
    where: {
      isActive: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Transform database offers to the API format
  return dbOffers.map((dbOffer) => ({
    id: dbOffer.id, // Use database ID as the API ID
    chain: dbOffer.chain,
    name: dbOffer.name,
    price: dbOffer.price,
    originalPrice: dbOffer.originalPrice ?? dbOffer.price,
    discountPercentage:
      dbOffer.discountPercentage ??
      (dbOffer.originalPrice && dbOffer.originalPrice > dbOffer.price
        ? ((dbOffer.originalPrice - dbOffer.price) / dbOffer.originalPrice) * 100
        : 0),
    description: dbOffer.description || undefined,
    imageUrl: dbOffer.imageUrl || undefined,
    location:
      dbOffer.locationLat && dbOffer.locationLng
        ? {
            lat: dbOffer.locationLat,
            lng: dbOffer.locationLng,
            address: dbOffer.locationAddress || undefined,
          }
        : undefined,
    purchaseUrl: dbOffer.url,
  }));
}

/**
 * Get the count of active offers by source
 */
export async function getOfferCountsBySource(): Promise<
  Record<OfferSource, number>
> {
  const counts = await prisma.offer.groupBy({
    by: ['source'],
    where: {
      isActive: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ],
    },
    _count: {
      id: true,
    },
  });

  const result: Record<OfferSource, number> = {
    uber_eats: 0,
    rappi: 0,
    pedidos_ya: 0,
    direct: 0,
  };

  for (const count of counts) {
    result[count.source as OfferSource] = count._count.id;
  }

  return result;
}

