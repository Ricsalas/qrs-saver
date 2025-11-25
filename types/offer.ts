// Normalized offer type used by fetchers and database operations
// This type matches the database schema

export type OfferSource = 'uber_eats' | 'rappi' | 'pedidos_ya' | 'direct';

export interface NormalizedOffer {
  externalId: string; // ID from the aggregator/restaurant
  source: OfferSource;
  chain: string;
  name: string;
  price: number;
  currency?: string; // Defaults to "CLP"
  originalPrice?: number;
  discountPercentage?: number;
  description?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  url: string; // Link to the offer
  locationLat?: number;
  locationLng?: number;
  locationAddress?: string;
  city?: string;
  validUntil?: Date;
}

