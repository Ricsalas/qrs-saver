import { NormalizedOffer } from '@/types/offer';

/**
 * Fetches offers from Rappi
 * 
 * TODO: Implement real API integration
 * - Check Rappi Partner API or merchant API documentation
 * - Use RAPPI_API_KEY from environment variables
 * - Respect rate limits and Terms of Service
 * - Handle pagination if needed
 * - Map API response to NormalizedOffer format
 * - Note: Rappi may require different authentication (OAuth, API keys, etc.)
 */
export async function fetchRappiOffers(): Promise<NormalizedOffer[]> {
  const apiKey = process.env.RAPPI_API_KEY;
  const apiSecret = process.env.RAPPI_API_SECRET; // If required

  // TODO: Replace this mock with real API call
  // Example structure for future implementation:
  // const response = await fetch('https://api.rappi.com/v1/offers', {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return normalizeRappiOffers(data);

  // Mock data for now - will be replaced with real API calls
  return [
    {
      externalId: 'rappi_kfc_bucket_001',
      source: 'rappi',
      chain: 'KFC',
      name: 'Bucket Familiar 8 Piezas',
      price: 8990,
      originalPrice: 10990,
      discountPercentage: 18,
      description: '8 piezas de pollo crispy original con papas fritas y bebida',
      category: 'Pollo',
      tags: ['pollo', 'combo', 'familiar'],
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
      url: 'https://www.rappi.com/cl/restaurantes/kfc',
      locationLat: -33.417,
      locationLng: -70.606,
      locationAddress: 'Providencia, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'rappi_dom_pizza_002',
      source: 'rappi',
      chain: "Domino's Pizza",
      name: 'Pizza 2x1 Familiar',
      price: 9990,
      originalPrice: 19980,
      discountPercentage: 50,
      description: 'Pizza familiar 2x1 en cualquier variedad',
      category: 'Pizza',
      tags: ['pizza', '2x1', 'oferta'],
      url: 'https://www.rappi.com/cl/restaurantes/dominos',
      locationLat: -33.4569,
      locationLng: -70.6483,
      locationAddress: 'Las Condes, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'rappi_subway_footlong_003',
      source: 'rappi',
      chain: 'Subway',
      name: 'Footlong Clásico',
      price: 5490,
      originalPrice: 6990,
      discountPercentage: 21,
      description: 'Sandwich de 30cm con carne, verduras y salsas a elección',
      category: 'Sandwiches',
      tags: ['sandwich', 'saludable'],
      url: 'https://www.rappi.com/cl/restaurantes/subway',
      locationLat: -33.52,
      locationLng: -70.6,
      locationAddress: 'Ñuñoa, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
  ];
}

