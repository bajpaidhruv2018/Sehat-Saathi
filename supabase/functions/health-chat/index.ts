import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const apiKey = Deno.env.get('HEALTH_CHATBOT_API_KEY');
    if (!apiKey) {
      console.error('HEALTH_CHATBOT_API_KEY is not set');
      throw new Error('API configuration error');
    }

    console.log('Sending message to health chatbot API');

    // Call the health chatbot API
    const response = await fetch('https://reel-check-web.vercel.app/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from health chatbot API');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in health-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        reply: 'Sorry, I encountered an error. Please try again later.'
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
