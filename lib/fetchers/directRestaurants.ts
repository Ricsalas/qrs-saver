import { NormalizedOffer } from '@/types/offer';

/**
 * Fetches offers directly from restaurant websites
 * 
 * WARNING: This fetcher should respect restaurant Terms of Service.
 * Prefer using official APIs or partnerships when available.
 * 
 * TODO: Implement real integration for each restaurant
 * - Check if restaurants have official APIs or RSS feeds
 * - Use respectful scraping practices with proper rate limiting
 * - Consider using headless browsers (Puppeteer/Playwright) only if necessary
 * - Always check robots.txt and Terms of Service
 * - Use RESTAURANT_API_KEYS or similar env vars if APIs are available
 * - Implement per-restaurant parsers/fetchers if needed
 * 
 * Note: For restaurants without APIs, we may need to:
 * - Parse HTML carefully and infrequently
 * - Use official social media feeds if available
 * - Consider manual curation for important chains
 */
export async function fetchDirectRestaurantOffers(): Promise<NormalizedOffer[]> {
  // TODO: Implement fetchers for each restaurant chain
  // Example structure:
  // const mcdonaldsOffers = await fetchMcDonaldsOffers();
  // const burgerKingOffers = await fetchBurgerKingOffers();
  // return [...mcdonaldsOffers, ...burgerKingOffers];

  // Mock data for now - representing offers found directly on restaurant websites
  return [
    {
      externalId: 'direct_mcd_mcnuggets_001',
      source: 'direct',
      chain: "McDonald's",
      name: 'McNuggets 10 unidades',
      price: 4990,
      originalPrice: 5736,
      discountPercentage: 13,
      description: '10 nuggets de pollo con salsas a elección',
      category: 'Pollo',
      tags: ['nuggets', 'pollo'],
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
      url: 'https://www.mcdonalds.cl/menu',
      locationLat: -33.511,
      locationLng: -70.758,
      locationAddress: 'Maipú, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'direct_starbucks_frappuccino_002',
      source: 'direct',
      chain: 'Starbucks',
      name: 'Frappuccino 2x1',
      price: 5990,
      originalPrice: 11980,
      discountPercentage: 50,
      description: 'Frappuccino de cualquier sabor 2x1',
      category: 'Bebidas',
      tags: ['bebida', 'café', '2x1'],
      url: 'https://www.starbucks.cl/menu',
      locationLat: -33.417,
      locationLng: -70.606,
      locationAddress: 'Providencia, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'direct_sushi_itamae_combo_003',
      source: 'direct',
      chain: 'Sushi Itamae',
      name: 'Combo Sushi 20 Piezas',
      price: 12990,
      originalPrice: 15990,
      discountPercentage: 19,
      description: 'Combo con 20 piezas de sushi variado',
      category: 'Sushi',
      tags: ['sushi', 'combo', 'japonés'],
      url: 'https://www.sushiitamae.cl/promociones',
      locationLat: -33.4569,
      locationLng: -70.6483,
      locationAddress: 'Las Condes, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
  ];
}

