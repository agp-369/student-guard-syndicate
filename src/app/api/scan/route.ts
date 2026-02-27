import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Scanning Payload Missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', an elite Cyber-Forensics AI using Gemini 2.5 Flash.
      TASK: Analyze the provided content for recruitment fraud targeting students.
      OUTPUT: Return ONLY valid JSON with verdict ("CLEAR", "CAUTION", "SCAM"), confidence (0-100), red_flags, analysis, recommendation, category.
    `;

    const response = await generateAIResponse(content, systemInstruction);
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
    } catch (parseErr) {
      return new NextResponse("Intelligence Node Error", { status: 500 });
    }

    // 🛡️ COMMUNITY SYNC with User Attribution
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Target_Node_Unknown",
          domain: content.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)?.[0] || "No_URL",
          category: result.category || "General_Fraud",
          user_id: userId || "anonymous"
        });
      }
    } catch (syncErr) {
      console.warn("Syndicate Ledger Node Offline.");
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
