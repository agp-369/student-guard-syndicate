import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

// Non-auth client for public community sharing
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Payload missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', an autonomous analyst.
      TASK: Analyze content for recruitment fraud.
      OUTPUT: Return ONLY valid JSON with: verdict, confidence, red_flags, analysis, recommendation, category.
    `;

    const response = await generateAIResponse(content, systemInstruction);
    const result = JSON.parse(response || "{}");

    // 🛡️ SYNDICATE LOGIC: If it's a scam, share it with the community
    if (result.verdict === "SCAM") {
      await supabase.from('community_threats').insert({
        brand_name: brandName || "Unknown Entity",
        domain: content.match(/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g)?.[0] || "Undisclosed Node",
        category: result.category || "General Fraud"
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scan Error:", error);
    return new NextResponse("Analysis Node Failure", { status: 500 });
  }
}
