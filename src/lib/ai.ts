const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Configuration Error: GEMINI_API_KEY is missing.");

  // MIGRATED TO INDUSTRY STANDARD: Gemini 2.5 Flash
  const model = "gemini-2.5-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let lastError = "";
  
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
      if (i === 2) break; 
      await sleep(1000);
    }
  }

  throw new Error(`Syndicate Node Exhausted: ${lastError}.`);
}
