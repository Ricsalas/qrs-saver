'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
  reason: string;
  distance?: number;
}

export function OfferCard({ offer, reason, distance }: OfferCardProps) {
  const [imgError, setImgError] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop';

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden relative">
      {/* Imagen */}
      {offer.imageUrl && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden relative">
          <Image
            src={imgError ? fallbackImage : offer.imageUrl}
            alt={offer.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          {/* Badge de descuento sobre la imagen */}
          {offer.discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-1">
              <span>-{offer.discountPercentage}%</span>
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{offer.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 font-medium">{offer.chain}</p>
              {distance !== undefined && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {distance.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="flex flex-col items-end">
              {offer.originalPrice > offer.price && (
                <p className="text-sm text-gray-400 line-through mb-1">
                  ${offer.originalPrice.toLocaleString('es-CL')}
                </p>
              )}
              <p className="text-2xl font-bold text-green-600">
                ${offer.price.toLocaleString('es-CL')}
              </p>
              <p className="text-xs text-gray-500">CLP</p>
            </div>
          </div>
        </div>
        {offer.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{offer.description}</p>
        )}
        <div className="pt-3 border-t border-gray-100 mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-semibold">Recomendación</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">"{reason}"</p>
        </div>
        {/* Botón de compra */}
        {offer.purchaseUrl && (
          <a
            href={offer.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Comprar ahora
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

