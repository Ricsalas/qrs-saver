import { NormalizedOffer } from '@/types/offer';

/**
 * Fetches offers from PedidosYa
 * 
 * TODO: Implement real API integration
 * - Check PedidosYa Partner API or merchant API documentation
 * - Use PEDIDOS_YA_API_KEY from environment variables
 * - Respect rate limits and Terms of Service
 * - Handle pagination if needed
 * - Map API response to NormalizedOffer format
 * - Note: PedidosYa may have different endpoints for different regions
 */
export async function fetchPedidosYaOffers(): Promise<NormalizedOffer[]> {
  const apiKey = process.env.PEDIDOS_YA_API_KEY;
  const country = process.env.PEDIDOS_YA_COUNTRY || 'CL'; // Default to Chile

  // TODO: Replace this mock with real API call
  // Example structure for future implementation:
  // const response = await fetch(`https://api.pedidosya.com/v1/${country}/offers`, {
  //   headers: {
  //     'Authorization': `Bearer ${apiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  // });
  // const data = await response.json();
  // return normalizePedidosYaOffers(data);

  // Mock data for now - will be replaced with real API calls
  return [
    {
      externalId: 'py_pizza_hut_large_001',
      source: 'pedidos_ya',
      chain: "Pizza Hut",
      name: 'Pizza Grande Especial',
      price: 11990,
      originalPrice: 14990,
      discountPercentage: 20,
      description: 'Pizza grande con pepperoni, jamón, pimientos y champiñones',
      category: 'Pizza',
      tags: ['pizza', 'grande', 'especial'],
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      url: 'https://www.pedidosya.cl/restaurantes/santiago/pizza-hut',
      locationLat: -33.4489,
      locationLng: -70.6693,
      locationAddress: 'Centro, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'py_taco_bell_box_002',
      source: 'pedidos_ya',
      chain: 'Taco Bell',
      name: 'Combo Taco Box',
      price: 6990,
      originalPrice: 8990,
      discountPercentage: 22,
      description: 'Combo con 4 tacos, nachos y bebida',
      category: 'Mexicana',
      tags: ['tacos', 'combo', 'mexicana'],
      url: 'https://www.pedidosya.cl/restaurantes/santiago/taco-bell',
      locationLat: -33.4,
      locationLng: -70.7,
      locationAddress: 'San Miguel, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
    {
      externalId: 'py_papajohns_medium_003',
      source: 'pedidos_ya',
      chain: "Papa John's",
      name: 'Pizza Mediana 2x1',
      price: 8990,
      originalPrice: 17980,
      discountPercentage: 50,
      description: 'Pizza mediana 2x1 en cualquier sabor',
      category: 'Pizza',
      tags: ['pizza', '2x1', 'oferta'],
      url: 'https://www.pedidosya.cl/restaurantes/santiago/papa-johns',
      locationLat: -33.511,
      locationLng: -70.758,
      locationAddress: 'Maipú, Santiago',
      city: 'Santiago',
      currency: 'CLP',
    },
  ];
}

