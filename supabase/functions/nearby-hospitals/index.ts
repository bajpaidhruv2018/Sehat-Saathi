import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, radius = 5000, specialty, rankBy } = await req.json();

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    // Use Google Places API to find nearby hospitals
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;

    // Add specialty as keyword if provided
    if (specialty) {
      placesUrl += `&keyword=${encodeURIComponent(specialty)}`;
    }

    // Handle ranking logic
    if (rankBy === 'distance') {
      placesUrl += `&rankby=distance`;
      // Note: radius must NOT be included when rankby=distance
    } else {
      placesUrl += `&radius=${radius}`;
    }

    const response = await fetch(placesUrl);

    if (!response.ok) {
      const error = await response.text();
      console.error('Google Places API error:', error);
      throw new Error('Failed to fetch nearby hospitals');
    }

    const data = await response.json();

    // Transform the data to a simpler format
    const hospitals = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      rating: place.rating || 0,
      isOpen: place.opening_hours?.open_now,
    }));

    return new Response(
      JSON.stringify({ hospitals }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in nearby-hospitals:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
