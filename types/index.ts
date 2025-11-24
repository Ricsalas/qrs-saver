export interface Offer {
  id: string;
  chain: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  description?: string;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  purchaseUrl?: string;
}

export interface Recommendation {
  offerId: string;
  reason: string;
}

export interface RecommendResponse {
  recommendations: Recommendation[];
}

