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

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY') || "";
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    const systemPrompt = `You are a medical myth-busting and health advisory expert for rural India named Sehat Saathi. 
    Analyze the following user query about health.
    
    Output Format strictly:
    Status: [TRUE if true/beneficial, FALSE if myth/harmful, or ADVICE if general inquiry]
    English: [Simple english explanation, max 2-3 sentences]
    Hindi: [Hindi translation of the explanation in Devanagari script, max 2-3 sentences]

    Query: ${message}`;

    let aiReply = "";

    if (GROQ_API_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.2
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        aiReply = groqData.choices?.[0]?.message?.content || "";
      }
    }

    if (!aiReply && GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        }
      );
      if (response.ok) {
        const data = await response.json();
        aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }
    }

    if (!aiReply) {
      aiReply = "Status: ADVICE\nEnglish: I could not process your request right now. Please consult a doctor.\nHindi: मैं अभी आपका अनुरोध संसाधित नहीं कर सका। कृपया डॉक्टर से सलाह लें।";
    }

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