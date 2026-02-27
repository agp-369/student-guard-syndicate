import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // 1. Environment Health Check
    if (!process.env.GEMINI_API_KEY) return new NextResponse("Configuration Error: GEMINI_API_KEY is missing on server.", { status: 500 });

    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Input Error: Content is required.", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', a Senior Cybersecurity Analyst.
      TASK: Analyze the provided content for recruitment fraud.
      OUTPUT: Return ONLY valid JSON with these exact keys: verdict, confidence, red_flags, analysis, recommendation, category.
      Values for verdict: "SAFE", "CAUTION", "SCAM".
    `;

    const response = await generateAIResponse(content, systemInstruction);
    
    // 2. Robust JSON Extraction (Heuristic)
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      result = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("Malformed AI Response:", response);
      return new NextResponse(`Intelligence Node Error: Received invalid data format. Check server logs.`, { status: 500 });
    }

    // 3. Community Sync (Non-Blocking)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Anonymous Node",
          domain: content.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)?.[0] || "Unknown Node",
          category: result.category || "General Threat"
        });
      } catch (dbErr) {
        console.warn("Syndicate Uplink Offline:", dbErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Critical API Failure:", error);
    return new NextResponse(`Node Sync Failure: ${error.message}`, { status: 500 });
  }
}
