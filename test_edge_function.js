
async function testEdgeFunction() {
    const SUPABASE_URL = "https://nqiyyailhxmavrcokrmv.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXl5YWlsaHhtYXZyY29rcm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTMzNzQsImV4cCI6MjA4NTUyOTM3NH0.py8zZIE91mqXq3SDw6BIDJEFw5qCLuCMAISTZrnzt7M";

    const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/health-chat`;

    console.log(`Testing connection to: ${FUNCTION_URL}`);

    try {
        const response = await fetch(FUNCTION_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Hello" })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success! Response:", data);
        } else {
            const text = await response.text();
            console.error("Error:", response.status, response.statusText);
            console.error("Response body:", text);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testEdgeFunction();
