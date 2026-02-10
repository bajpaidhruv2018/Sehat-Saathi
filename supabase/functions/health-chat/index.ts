import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Fix for "Cannot find name 'Deno'"
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Processing message:', message);

    // IMPORTANT: In production, use Deno.env.get('GEMINI_API_KEY')
    // For now, using the provided key to fix the immediate issue.
    // GUIDANCE: Move this to Supabase Secrets before pushing to public repo!
    const API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyAW5nirXbPJfzvGs6gPc-PXTqSRU47GgSI";

    if (!API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const systemPrompt = `You are a medical myth-busting expert for rural India. 
    Analyze the following user query about health.
    
    Output Format strictly:
    Status: [TRUE if true/beneficial, FALSE if myth/harmful]
    English: [Simple english explanation, max 2 sentences]
    Hindi: [Hindi translation of the explanation, simple language]

    Query: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      throw new Error(data.error?.message || "Failed to fetch from Gemini");
    }

    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not understand that.";

    return new Response(
      JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in health-chat function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred',
        reply: 'Status: FALSE\nEnglish: I encountered an error connecting to the expert system.\nHindi: मुझे विशेषज्ञ प्रणाली से जुड़ने में त्रुटि का सामना करना पड़ा।'
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});