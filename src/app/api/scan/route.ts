import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Payload missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', a Senior Cybersecurity Analyst.
      TASK: Analyze the provided content for student recruitment fraud.
      
      OUTPUT FORMAT: Return a valid JSON object.
      {
        "verdict": "SAFE" | "CAUTION" | "SCAM",
        "confidence": number (0-100),
        "red_flags": ["Reason 1", "Reason 2"],
        "analysis": "Short reasoning",
        "recommendation": "What to do",
        "category": "Fraud Category"
      }
    `;

    const response = await generateAIResponse(content, systemInstruction);
    let result;
    
    try {
      result = JSON.parse(response || "{}");
    } catch (parseErr) {
      console.error("AI Output Parse Error:", response);
      throw new Error("Malformed analysis received.");
    }

    // 🛡️ SYNDICATE LOGIC: Save to community if SCAM
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('community_threats').insert({
        brand_name: brandName || "Unknown Entity",
        domain: content.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)?.[0] || "Undisclosed Node",
        category: result.category || "General Fraud"
      });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Scan API Operational Failure:", error);
    return new NextResponse(error.message || "Internal Node Failure", { status: 500 });
  }
}
