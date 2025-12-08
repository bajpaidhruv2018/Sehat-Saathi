import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// 1. Fix for "Cannot find name 'Deno'"
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 2. Fix for "Parameter 'req' implicitly has an 'any' type"
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    // 3. MOCK RESPONSE LOGIC (Bypasses missing API Key error)
    // We simulate a response so you can test the UI without a Lovable/OpenAI key.
    
    console.log('Processing message (Mock Mode):', message);

    // Create a fake verified response
    const aiReply = `Status: TRUE
English: This is a simulated response confirming your query about "${message}" is valid. In a real app, this would be an AI analysis.
Hindi: यह एक नकली प्रतिक्रिया है जो पुष्टि करती है कि "${message}" के बारे में आपका प्रश्न मान्य है।`;

    // Return the simulated success response
    return new Response(
      JSON.stringify({ reply: aiReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in health-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        reply: 'Sorry, I encountered an error. Please try again later.'
      }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});