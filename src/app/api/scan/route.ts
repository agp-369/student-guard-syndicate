import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Scanning Payload Missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', an elite Cyber-Forensics AI.
      TASK: Analyze the provided content for recruitment fraud targeting students.
      
      OUTPUT: Return ONLY valid JSON with these exact keys: 
      verdict ("SAFE", "CAUTION", "SCAM"), 
      confidence (0-100), 
      red_flags (array of strings), 
      analysis (grounded in the provided text and domain forensics), 
      recommendation, 
      category (e.g. "Data Entry Scam", "Identity Phishing").
    `;

    // 1. ENGAGE GEMINI 2.0 FLASH
    const response = await generateAIResponse(content, systemInstruction);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (parseErr) {
      return new NextResponse("Intelligence Node Error: Malformed Data Output.", { status: 500 });
    }

    // 2. COMMUNITY DEFENSE SYNC
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Target_Node_Unknown",
          domain: content.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)?.[0] || "No_Payload_URL",
          category: result.category || "General_Fraud"
        });
      }
    } catch (syncErr) {
      console.warn("Syndicate Ledger Node Offline.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return new NextResponse(error.message || "Internal Node Failure", { status: 500 });
  }
}
