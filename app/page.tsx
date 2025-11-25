'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChatInput } from '@/components/ChatInput';
import { OfferCard } from '@/components/OfferCard';
import { Offer } from '@/types';
import { calculateDistance } from '@/lib/distance';
import { offers } from '@/data/offers';

interface RecommendationWithOffer {
  offer: Offer;
  reason: string;
}

const exampleQueries = [
  'algo barato con pollo crispy',
  'hamburguesa económica',
  'pizza barata',
  'comida bajo 5000 pesos',
  'sushi económico',
  'algo con pollo',
];

type SortOption = 'discount' | 'price-low' | 'price-high' | 'distance' | 'default';

interface UserLocation {
  lat: number;
  lng: number;
}

export default function Home() {
  const [recommendations, setRecommendations] = useState<RecommendationWithOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(10); // 10 km por defecto

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(message);
    setRecommendations([]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: message }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
      setSortBy('default');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (query: string) => {
    handleSend(query);
  };

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('No se pudo obtener tu ubicación');
          // Usar ubicación por defecto (Santiago, Chile)
          setUserLocation({
            lat: -33.4489,
            lng: -70.6693,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocalización no está disponible');
      // Usar ubicación por defecto (Santiago, Chile)
      setUserLocation({
        lat: -33.4489,
        lng: -70.6693,
      });
    }
  }, []);

  // Ofertas destacadas basadas en ubicación
  const featuredOffers = useMemo(() => {
    if (!userLocation) return [];

    // Filtrar ofertas por distancia (hasta 15 km)
    const nearbyOffers = offers
      .filter((offer) => {
        if (!offer.location) return false;
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          offer.location.lat,
          offer.location.lng
        );
        return distance <= 15;
      })
      .map((offer) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          offer.location!.lat,
          offer.location!.lng
        );
        return { offer, distance };
      })
      // Ordenar por descuento (mayor primero) y luego por distancia
      .sort((a, b) => {
        const discountDiff = b.offer.discountPercentage - a.offer.discountPercentage;
        if (Math.abs(discountDiff) > 5) return discountDiff;
        return a.distance - b.distance;
      })
      .slice(0, 6) // Top 6 ofertas
      .map((item) => item.offer);

    return nearbyOffers;
  }, [userLocation]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-pink-400/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-4xl">🍔</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              QRS Saver
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-6">
              Encuentra las mejores ofertas cerca de ti
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <span className="text-xs text-gray-500">IA</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">📍</span>
                </div>
                <span className="text-xs text-gray-500">Cerca</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <span className="text-xs text-gray-500">Descuentos</span>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mb-8 max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>

          {/* Cómo funciona - Versión simplificada */}
          {!isLoading && recommendations.length === 0 && !error && (
            <div className="max-w-3xl mx-auto mt-8 mb-6">
              <div className="flex items-center justify-center gap-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <span className="text-sm font-medium">Escribe</span>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-300 to-red-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <span className="text-sm font-medium">IA recomienda</span>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-300 to-red-300"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <span className="text-sm font-medium">Compra</span>
                </div>
              </div>
            </div>
          )}

          {/* Example Queries */}
          {!isLoading && recommendations.length === 0 && !error && (
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-gray-500 text-center mb-3">
                Ejemplos:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {exampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(query)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-white hover:border-orange-300 hover:text-orange-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Ofertas Destacadas */}
        {userLocation && featuredOffers.length > 0 && recommendations.length === 0 && !isLoading && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Ofertas destacadas cerca de ti
                </h2>
                <p className="text-gray-600">
                  Las mejores ofertas con descuento en un radio de 15 km
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredOffers.map((offer, index) => {
                const distance = calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  offer.location!.lat,
                  offer.location!.lng
                );
                return (
                  <div
                    key={offer.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OfferCard
                      offer={offer}
                      reason={`Oferta destacada con ${offer.discountPercentage}% de descuento`}
                      distance={distance}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🍕</span>
                </div>
              </div>
              <p className="mt-6 text-lg font-medium text-gray-700">
                Buscando las mejores ofertas para ti...
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Analizando más de 60 ofertas disponibles
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-red-800 font-semibold text-lg">Error</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-sm text-red-700 hover:text-red-900 underline"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && recommendations.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Recomendaciones para ti
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Búsqueda: &quot;<span className="font-semibold text-gray-800">{lastQuery}</span>&quot;
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {recommendations.length} {recommendations.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'} de más de 60 disponibles
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="default">Ordenar por...</option>
                  <option value="discount">Mayor descuento</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                  {userLocation && <option value="distance">Más cercano</option>}
                </select>
                <button
                  onClick={() => {
                    setRecommendations([]);
                    setLastQuery('');
                    setError(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                >
                  Nueva búsqueda
                </button>
              </div>
            </div>
            {/* Filtro de distancia */}
            {userLocation && (
              <div className="mb-4 flex items-center gap-4 flex-wrap bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">
                    Filtrar por distancia:
                  </span>
                </div>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
                {locationError && (
                  <span className="text-xs text-orange-600">
                    {locationError} (usando ubicación por defecto)
                  </span>
                )}
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(() => {
                let sortedRecs = [...recommendations];
                let filteredRecs = [...recommendations];
                
                // Filtrar por distancia si hay ubicación
                if (userLocation) {
                  filteredRecs = sortedRecs.filter((rec) => {
                    if (!rec.offer.location) return true; // Mostrar ofertas sin ubicación
                    const distance = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      rec.offer.location.lat,
                      rec.offer.location.lng
                    );
                    return distance <= maxDistance;
                  });
                } else {
                  filteredRecs = sortedRecs;
                }
                
                // Mostrar mensaje si no hay ofertas en el rango
                if (userLocation && filteredRecs.length === 0 && sortedRecs.length > 0) {
                  return (
                    <div className="col-span-full text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-lg font-medium text-yellow-800 mb-2">
                        No hay ofertas disponibles en un radio de {maxDistance} km
                      </p>
                      <p className="text-sm text-yellow-600 mb-4">
                        Intenta aumentar el rango de distancia o busca otra cosa
                      </p>
                      <button
                        onClick={() => setMaxDistance(50)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Ver ofertas hasta 50 km
                      </button>
                    </div>
                  );
                }
                
                // Ordenar
                if (sortBy === 'discount') {
                  filteredRecs.sort((a, b) => b.offer.discountPercentage - a.offer.discountPercentage);
                } else if (sortBy === 'price-low') {
                  filteredRecs.sort((a, b) => a.offer.price - b.offer.price);
                } else if (sortBy === 'price-high') {
                  filteredRecs.sort((a, b) => b.offer.price - a.offer.price);
                } else if (sortBy === 'distance' && userLocation) {
                  filteredRecs.sort((a, b) => {
                    if (!a.offer.location) return 1;
                    if (!b.offer.location) return -1;
                    const distA = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      a.offer.location.lat,
                      a.offer.location.lng
                    );
                    const distB = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      b.offer.location.lat,
                      b.offer.location.lng
                    );
                    return distA - distB;
                  });
                }
                
                return filteredRecs.map((rec, index) => {
                  let distance: number | undefined;
                  if (userLocation && rec.offer.location) {
                    distance = calculateDistance(
                      userLocation.lat,
                      userLocation.lng,
                      rec.offer.location.lat,
                      rec.offer.location.lng
                    );
                  }
                  return (
                    <div
                      key={`${rec.offer.id}-${index}`}
                      className="animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <OfferCard
                        offer={rec.offer}
                        reason={rec.reason}
                        distance={distance}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recommendations.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-6">
              <span className="text-5xl">🔍</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Qué quieres comer hoy?
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Escribe arriba lo que buscas
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

