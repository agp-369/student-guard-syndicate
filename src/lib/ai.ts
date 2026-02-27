export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Configuration Error: GEMINI_API_KEY is missing.");
  }

  // Modern Gemini 2.0 Flash Model
  const model = "gemini-2.0-flash"; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{ 
        parts: [{ text: prompt }] 
      }],
      generation_config: {
        temperature: 0.1,
        top_p: 0.95,
        max_output_tokens: 2048,
        response_mime_type: "application/json"
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`AI Node Failure [${res.status}]:`, errText);
    throw new Error(`AI Node Rejected Connection (${res.status}).`);
  }

  const data = await res.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!output) throw new Error("Intelligence node returned empty candidates.");

  return output;
}
