
async function testEdgeFunction() {
    const SUPABASE_URL = "https://ymcejzgkvlxepjaihqzs.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY2Vqemdrdmx4ZXBqYWlocXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTEwNDUsImV4cCI6MjA3NzU2NzA0NX0.hn6zvDSSvg0Nn5vCyzia-bEOwChxrY88V53dCm5Jek4";

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
