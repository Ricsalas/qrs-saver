import { NormalizedOffer } from '@/types/offer';

/**
 * Fetches offers from Uber Eats
 * 
 * TODO: Implement real API integration
 * - Check Uber Eats Partner API or public API documentation
 * - Use UBER_EATS_API_KEY from environment variables
 * - Respect rate limits and Terms of Service
 * - Handle pagination if needed
 * - Map API response to NormalizedOffer format
 */
export async function fetchUberEatsOffers(): Promise<NormalizedOffer[]> {
  const apiKey = process.env.UBER_EATS_API_KEY;

  // TODO: Replace this mock with real API call
  // Example structure for future implementation:
  // const response = await fetch('https://api.ubereats.com/v1/offers', {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return normalizeUberEatsOffers(data);

  // Mock data for now - will be replaced with real API calls
  return [
    {
      externalId: 'ue_mcd_bigmac_001',
      source: 'uber_eats',
      chain: "McDonald's",
      name: 'Big Mac',
      price: 5990,
      originalPrice: 7582,
      discountPercentage: 21,
      description: 'Hamburguesa clásica con dos carnes, queso, lechuga, cebolla, pepinillos y salsa especial',
      category: 'Burgers',
      tags: ['hamburguesa', 'combo', 'popular'],
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      url: 'https://www.ubereats.com/cl/store/mcdonalds',
      locationLat: -33.4489,
      locationLng: -70.6693,
      locationAddress: 'Centro, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'ue_mcd_mcchicken_002',
      source: 'uber_eats',
      chain: "McDonald's",
      name: 'McChicken',
      price: 3990,
      originalPrice: 4988,
      discountPercentage: 20,
      description: 'Hamburguesa de pollo crispy con lechuga y mayonesa',
      category: 'Burgers',
      tags: ['pollo', 'hamburguesa'],
      imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
      url: 'https://www.ubereats.com/cl/store/mcdonalds',
      locationLat: -33.417,
      locationLng: -70.606,
      locationAddress: 'Providencia, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'ue_bk_whopper_003',
      source: 'uber_eats',
      chain: 'Burger King',
      name: 'Whopper',
      price: 6490,
      originalPrice: 7490,
      discountPercentage: 13,
      description: 'La hamburguesa más grande de Burger King',
      category: 'Burgers',
      tags: ['hamburguesa', 'grande'],
      url: 'https://www.ubereats.com/cl/store/burger-king',
      locationLat: -33.4569,
      locationLng: -70.6483,
      locationAddress: 'Las Condes, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
  ];
}

