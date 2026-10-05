export interface ChatReply {
    status?: 'TRUE' | 'FALSE' | 'ADVICE';
    english: string;
    hindi?: string;
    rawText: string;
}

function getGroqKey(): string {
    let raw = (import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || "").trim();
    // Remove surrounding quotes if pasted with quotes
    raw = raw.replace(/^["']|["']$/g, '').trim();
    // Auto-strip accidental leading 'A' (e.g. Agsk_...)
    if (raw.startsWith('Agsk_')) {
        raw = raw.substring(1);
    }
    return raw;
}

export function parseHealthChatResponse(text: string): {
    status?: 'TRUE' | 'FALSE' | 'ADVICE';
    english: string;
    hindi?: string;
} {
    const cleanText = text.replace(/[*_#]/g, '');

    const statusMatch = cleanText.match(/(?:Status|Verdict):\s*(.*?)(?:\n|$)/i);
    const englishMatch = cleanText.match(/English:\s*([\s\S]*?)(?=\n\s*Hindi:|$)/i);
    const hindiMatch = cleanText.match(/Hindi:\s*([\s\S]*?)$/i);

    const statusText = statusMatch?.[1]?.toLowerCase() || '';

    let status: 'TRUE' | 'FALSE' | 'ADVICE' | undefined = undefined;
    if (statusText.includes('true')) status = 'TRUE';
    else if (statusText.includes('false')) status = 'FALSE';
    else if (statusText.includes('advice')) status = 'ADVICE';

    const english = englishMatch?.[1]?.trim() || cleanText;
    const hindi = hindiMatch?.[1]?.trim() || undefined;

    return { status, english, hindi };
}

export async function askHealthChatbot(message: string): Promise<ChatReply> {
    const apiKey = getGroqKey();
    if (!apiKey) {
        throw new Error(
            "Missing Groq API Key on production. Please add 'VITE_GROQ_API_KEY' in your Vercel Project Settings > Environment Variables, then click 'Redeploy' to rebuild with the new key."
        );
    }

    const systemPrompt = `You are Sehat Saathi, a caring and knowledgeable medical and health advisor for rural India.
Analyze the user's health query or myth carefully.

Output Format strictly:
Status: [TRUE if beneficial/accurate, FALSE if harmful/myth, or ADVICE for general advice]
English: [Clear, compassionate advice in 2-3 sentences max]
Hindi: [Simple, natural Hindi translation of the advice in Devanagari script, 2-3 sentences max]`;

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
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

        if (!res.ok) {
            // Fallback to fast openai/gpt-oss-20b model
            const fallbackRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-20b',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: message }
                    ],
                    temperature: 0.2
                })
            });


            if (!fallbackRes.ok) {
                const errData = await fallbackRes.text();
                throw new Error(`AI service error: ${errData}`);
            }

            const fallbackData = await fallbackRes.json();
            const content = fallbackData.choices?.[0]?.message?.content || '';
            const parsed = parseHealthChatResponse(content);
            return { ...parsed, rawText: content };
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        const parsed = parseHealthChatResponse(content);
        return { ...parsed, rawText: content };
    } catch (err: any) {
        console.error('ChatService error:', err);
        throw err;
    }
}
