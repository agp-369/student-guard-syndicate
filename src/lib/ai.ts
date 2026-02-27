const sleep = (ms: number) => new Promise(res => setTimeout(ms, res));

export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Configuration Error: GEMINI_API_KEY is missing.");

  const model = "gemini-2.0-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let lastError = "";
  
  // RETRY PROTOCOL: 3 Attempts with Exponential Backoff
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ parts: [{ text: prompt }] }],
          generation_config: {
            temperature: 0.1,
            top_p: 0.95,
            max_output_tokens: 2048,
            response_mime_type: "application/json"
          }
        })
      });

      if (res.status === 429) {
        console.warn(`AI Node Congested (Attempt ${i + 1}/3). Retrying in ${2 * (i + 1)}s...`);
        await sleep(2000 * (i + 1));
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Node Error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!output) throw new Error("Intelligence node returned empty candidates.");
      
      return output;

    } catch (err: any) {
      lastError = err.message;
      if (i === 2) break; // Final attempt failed
      await sleep(1000);
    }
  }

  throw new Error(`AI Node Exhausted: ${lastError}. Please wait 60 seconds before scanning again.`);
}
