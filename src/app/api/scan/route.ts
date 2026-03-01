import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, brandName, fileMeta } = await req.json();
    if (!content) return new NextResponse("PAYLOAD_NULL", { status: 400 });

    const systemInstruction = `
      You are 'Sentinel-1', the Syndicate's lead Forensic Analyst.
      TASK: Verify a job lead.
      OUTPUT: Return ONLY valid JSON with: verdict ("CLEAR", "CAUTION", "SCAM"), trust_score (1-100), red_flags, analysis, recommendation, category.
    `;

    const response = await generateAIResponse(`DATA:\n${content}`, systemInstruction);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      if (!result.trust_score) result.trust_score = result.confidence || 50;
    } catch (e) { 
      return new NextResponse("INTEL_PARSE_ERROR", { status: 500 }); 
    }

    // 🛡️ SUPABASE INTEGRITY SYNC
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // LOG TO COMMUNITY LEDGER
      // We log EVERYTHING to ensure the feed and dashboard move
      const { error: dbError } = await supabase.from('community_threats').insert({
        brand_name: brandName || result.category || "UNSPECIFIED_ENTITY",
        domain: content.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g)?.[0] || "SOCIAL_ENGINEERING",
        category: result.category || "General Inquiry",
        user_id: userId || "anonymous",
        verdict: result.verdict // IMPORTANT: Make sure this column exists in SQL
      });

      if (dbError) {
        console.error("SUPABASE_SYNC_ERROR:", dbError.message);
      } else {
        console.log("LEDGER_UPDATE_SUCCESS");
      }
    }

    return NextResponse.json(result);
  } catch (error: any) { 
    console.error("SCAN_CRITICAL_FAILURE:", error);
    return new NextResponse("NODE_SYNC_FAILURE", { status: 500 }); 
  }
}
