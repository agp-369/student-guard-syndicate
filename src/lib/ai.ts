export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("AI Node Critical: GEMINI_API_KEY is missing from environment.");
    throw new Error("AI Configuration Missing (GEMINI_API_KEY).");
  }

  // Using the most stable production model string to prevent 404/429 issues
  const model = "gemini-1.5-flash-latest"; 
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
  
  if (!output) {
    throw new Error("Analysis node returned an empty result.");
  }

  return output;
}
