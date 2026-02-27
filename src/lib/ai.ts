export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("AI Node Critical: GEMINI_API_KEY is missing from environment.");
    throw new Error("API configuration missing.");
  }

  // Use the latest stable preview model
  const model = "gemini-2.0-flash-exp"; 
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
        temperature: 0.1, // Lower temperature for more factual analysis
        top_p: 0.95,
        max_output_tokens: 2048,
        response_mime_type: "application/json"
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`AI Node Failure [${res.status}]:`, errText);
    throw new Error(`Analysis node rejected request (${res.status}).`);
  }

  const data = await res.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!output) {
    console.error("AI Node Error: Empty response candidates.");
    throw new Error("No analysis generated.");
  }

  return output;
}
