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

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY is not set');
      throw new Error('API configuration error');
    }

    console.log('Sending message to Lovable AI health assistant');

    // Call the Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a Health Myth Checker for rural India. Your purpose is to verify if health beliefs are true or false.

RESPONSE FORMAT (STRICTLY FOLLOW):
Status: [TRUE or FALSE]
English: [Simple 1-2 sentence explanation in English]
Hindi: [Clear translation in Hindi]

Example:
Status: FALSE
English: Drinking milk at night does not cause weight gain. Weight gain depends on total calorie intake, not timing.
Hindi: रात में दूध पीने से वजन नहीं बढ़ता है। वजन बढ़ना कुल कैलोरी पर निर्भर करता है, समय पर नहीं।

Keep responses concise, culturally sensitive, and easy to understand. Always encourage users to consult qualified healthcare professionals for serious medical issues.`
          },
          {
            role: 'user',
            content: message
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            reply: 'I am receiving too many requests right now. Please try again in a moment.'
          }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: 'Payment required',
            reply: 'The AI service needs additional credits. Please contact support.'
          }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || 'I received your message but could not generate a response.';
    
    console.log('Successfully received response from Lovable AI');

    return new Response(
      JSON.stringify({ reply: aiReply }), {
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
