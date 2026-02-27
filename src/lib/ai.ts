export async function generateAIResponse(prompt: string, systemInstruction: string = "You are a senior cybersecurity analyst.") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing.");

  const model = "gemini-3-flash-preview"; 
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
        temperature: 0.2,
        top_p: 0.95,
        max_output_tokens: 2048,
        response_mime_type: "application/json"
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("AI Error:", err);
    throw new Error("Intelligence node failure.");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
