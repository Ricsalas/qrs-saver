import { NextRequest, NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/openai';
import { offers } from '@/data/offers';
import { Recommendation } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput } = body;

    if (!userInput || typeof userInput !== 'string' || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: 'userInput is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Get recommendations from OpenAI
    const recommendations: Recommendation[] = await getRecommendations(
      userInput.trim(),
      offers
    );

    // Validate that all recommended offerIds exist
    const validRecommendations = recommendations.filter((rec) =>
      offers.some((offer) => offer.id === rec.offerId)
    );

    if (validRecommendations.length === 0) {
      return NextResponse.json(
        { error: 'No valid recommendations found' },
        { status: 500 }
      );
    }

    // Get full offer details for each recommendation
    const recommendationsWithOffers = validRecommendations.map((rec) => {
      const offer = offers.find((o) => o.id === rec.offerId);
      if (!offer) {
        throw new Error(`Offer ${rec.offerId} not found`);
      }
      return {
        offer,
        reason: rec.reason,
      };
    });

    return NextResponse.json({
      recommendations: recommendationsWithOffers,
    });
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    
    if (error instanceof Error) {
      // Don't expose internal error details in production
      return NextResponse.json(
        { error: 'Failed to get recommendations. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

