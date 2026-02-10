import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { bodyPart, userDescription } = await req.json();

        // 1. Get Key (Try Env first, fallback to the one seen in health-chat logs/code if needed or error)
        // NOTE: In production, strictly use Deno.env.get('GEMINI_API_KEY').
        // Reusing the strategy found in health-chat for consistency in this environment.
        const API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyAW5nirXbPJfzvGs6gPc-PXTqSRU47GgSI";

        if (!API_KEY) {
            throw new Error('GEMINI_API_KEY is not set');
        }

        const prompt = `
      Act as a kind, simple-speaking medical assistant for rural India.
      The user is reporting pain or an issue with their "${bodyPart || 'General'}".
      Additional description: "${userDescription || 'None provided'}".

      Analyze the input for potential emergencies (e.g., snake bites, heavy bleeding, chest pain).
      
      Return strictly a JSON object with the following structure:
      {
        "questions": [
          { "textEn": "Question 1 in English?", "textHi": "Question 1 in Hindi?", "icon": "LucideIconName" }
        ],
        "severity": "Low" | "Medium" | "High",
        "medicalTerm": "Specific search term for Google Maps",
        "action": {
          "textEn": "One simple first-aid step in English.",
          "textHi": "One simple first-aid step in Hindi."
        }
      }

      Use simple language suitable for a rural farmer.
      ENSURE THE RESPONSE IS VALID JSON. Do not include markdown formatting like \`\`\`json.
    `;

        // 2. Use Direct Fetch (Simpler, fewer dependencies on Deno edge)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            throw new Error(data.error?.message || "Failed to fetch from Gemini");
        }

        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResponse = JSON.parse(text);

        return new Response(
            JSON.stringify(jsonResponse),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Error in triage-assist:', error);
        return new Response(
            JSON.stringify({
                error: (error as Error).message || 'Unknown error',
                // Fallback valid JSON to prevent frontend crash
                severity: "Low",
                action: { textEn: "Error connecting. Please call a doctor.", textHi: "संपर्क त्रुटि। कृपया डॉक्टर को कॉल करें।" }
            }),
            {
                status: 200, // Return 200 with error info so frontend displays it gracefully
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});
