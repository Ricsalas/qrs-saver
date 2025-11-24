import OpenAI from 'openai';
import { Offer, Recommendation } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getRecommendations(
  userInput: string,
  offers: Offer[]
): Promise<Recommendation[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const offersJson = JSON.stringify(offers, null, 2);

  const systemPrompt = `You are a helpful assistant that recommends food deals in Chile based on user preferences.

You will receive:
1. A user's request in Spanish or English
2. A JSON array of available offers with prices in Chilean Pesos (CLP)

Your task:
- Analyze the user's request
- Select 1-3 offers that best match their preferences
- Provide a short reason in Spanish for each recommendation (since this is for Chilean market)
- Return ONLY a valid JSON object with this exact structure:
{
  "recommendations": [
    {
      "offerId": "string (must match an id from the offers list)",
      "reason": "string (short explanation in 1-2 sentences in Spanish)"
    }
  ]
}

Important:
- Only recommend offers that exist in the provided list
- The offerId must exactly match an id from the offers
- Keep reasons concise and relevant (1-2 sentences max)
- Always respond in Spanish since this is for the Chilean market
- If the user asks for something cheap/barato/económico, prioritize lower prices (look for prices under 5000 CLP)
- If the user mentions specific items (like "pollo crispy", "hamburguesa", "pizza"), match those preferences
- Consider Chilean food preferences and popular chains (McDonald's, Burger King, KFC, etc.)
- Return between 1-3 recommendations`;

  const userPrompt = `User request: "${userInput}"

Available offers:
${offersJson}

Return a JSON object with a "recommendations" array containing 1-3 recommendations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsed: { recommendations?: Recommendation[] };
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || 
                       content.match(/(\{[\s\S]*?\})/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1]);
        } catch {
          throw new Error(`Failed to parse OpenAI response: ${content.substring(0, 200)}`);
        }
      } else {
        throw new Error(`Failed to parse OpenAI response: ${content.substring(0, 200)}`);
      }
    }

    // Extract recommendations array
    const recommendations: Recommendation[] = parsed.recommendations || [];

    // Validate recommendations
    const validRecommendations = recommendations
      .filter((rec): rec is Recommendation => {
        return (
          typeof rec === 'object' &&
          rec !== null &&
          typeof rec.offerId === 'string' &&
          typeof rec.reason === 'string' &&
          rec.offerId.length > 0 &&
          rec.reason.length > 0
        );
      })
      .slice(0, 3); // Limit to 3 recommendations

    if (validRecommendations.length === 0) {
      throw new Error('No valid recommendations returned from OpenAI');
    }

    return validRecommendations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
    throw new Error('Unknown error calling OpenAI API');
  }
}

