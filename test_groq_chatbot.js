import fs from 'fs';

let GROQ_KEY = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
if (!GROQ_KEY && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const match = envContent.match(/GROQ_API_KEY=([^\r\n]+)/);
  if (match) GROQ_KEY = match[1].trim();
}

function parseResponse(text) {
  const cleanText = text.replace(/[*_#]/g, '');

  const statusMatch = cleanText.match(/(?:Status|Verdict):\s*(.*?)(?:\n|$)/i);
  const englishMatch = cleanText.match(/English:\s*([\s\S]*?)(?=\n\s*Hindi:|$)/i);
  const hindiMatch = cleanText.match(/Hindi:\s*([\s\S]*?)$/i);

  const statusText = statusMatch?.[1]?.toLowerCase() || '';

  let status = undefined;
  if (statusText.includes('true')) status = 'TRUE';
  else if (statusText.includes('false')) status = 'FALSE';
  else if (statusText.includes('advice')) status = 'ADVICE';

  const english = englishMatch?.[1]?.trim() || cleanText;
  const hindi = hindiMatch?.[1]?.trim() || undefined;

  return { status, english, hindi, rawText: text };
}

async function ask(query) {
  console.log(`\n💬 Testing query: "${query}"`);
  const systemPrompt = `You are Sehat Saathi, a caring and knowledgeable medical and health advisor for rural India.
Analyze the user's health query or myth carefully.

Output Format strictly:
Status: [TRUE if beneficial/accurate, FALSE if harmful/myth, or ADVICE for general advice]
English: [Clear, compassionate advice in 2-3 sentences max]
Hindi: [Simple, natural Hindi translation of the advice in Devanagari script, 2-3 sentences max]`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + GROQ_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const content = data.choices[0].message.content;
  console.log('--- Raw Response ---');
  console.log(content);
  console.log('--- Parsed Output ---');
  console.log(parseResponse(content));
  return parseResponse(content);
}

async function runTests() {
  try {
    await ask('Should I put oil or ghee on a burn wound?');
    await ask('Can I get pregnant during periods?');
    await ask('I have fever for 2 days, what should I do?');
    console.log('\n✅ All tests passed successfully!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

runTests();
