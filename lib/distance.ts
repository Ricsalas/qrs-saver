/**
 * Calcula la distancia en kilómetros entre dos puntos usando la fórmula de Haversine
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Redondear a 1 decimal
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Filtra ofertas por distancia máxima
 */
export function filterByDistance<T extends { location?: { lat: number; lng: number } }>(
  items: T[],
  userLat: number,
  userLng: number,
  maxDistanceKm: number
): T[] {
  return items.filter((item) => {
    if (!item.location) return false;
    const distance = calculateDistance(
      userLat,
      userLng,
      item.location.lat,
      item.location.lng
    );
    return distance <= maxDistanceKm;
  });
}

/**
 * Ordena ofertas por distancia (más cercanas primero)
 */
export function sortByDistance<T extends { location?: { lat: number; lng: number } }>(
  items: T[],
  userLat: number,
  userLng: number
): Array<T & { distance?: number }> {
  return items
    .map((item) => {
      if (!item.location) return { ...item, distance: Infinity };
      const distance = calculateDistance(
        userLat,
        userLng,
        item.location.lat,
        item.location.lng
      );
      return { ...item, distance };
    })
    .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
}

