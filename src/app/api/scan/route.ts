import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Scanning Payload Missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', a Senior Cybersecurity Analyst.
      TASK: Analyze the provided content for recruitment fraud.
      OUTPUT: Return ONLY valid JSON with: verdict, confidence, red_flags, analysis, recommendation, category.
    `;

    const response = await generateAIResponse(content, systemInstruction);
    
    let result;
    try {
      // Clean the response in case the AI includes markdown backticks
      const cleanJson = response.replace(/```json/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("AI Node Output Error:", response);
      return new NextResponse("Intelligence Node produced malformed data.", { status: 500 });
    }

    // 🛡️ SYNDICATE LOGIC: Attempt community share
    try {
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
    } catch (syncErr) {
      console.warn("Community sync node bypassed:", syncErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Critical Node Failure:", error.message);
    return new NextResponse(error.message || "Internal Node Failure", { status: 500 });
  }
}
