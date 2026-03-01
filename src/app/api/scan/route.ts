import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

function extractDomains(text: string) {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
  const matches = [...text.matchAll(urlRegex)];
  return [...new Set(matches.map(m => m[1]))];
}

async function checkDomainAge(domain: string) {
  if (["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"].includes(domain.toLowerCase())) {
    return { age: 9999, raw: `Domain: ${domain} | Public Mail Provider Detected (IMPERSONATION RISK).` };
  }
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { age: null, raw: `RDAP_PROBE: ${domain} (Registry Hidden)` };
    const data = await res.json();
    const regEvent = data.events?.find((e: any) => e.eventAction === "registration");
    if (regEvent && regEvent.eventDate) {
      const regDate = new Date(regEvent.eventDate);
      const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return { age: ageDays, raw: `Domain: ${domain} | Registered: ${regDate.toISOString().split('T')[0]} (${ageDays} days ago)` };
    }
    return { age: null, raw: `Domain: ${domain} | History Cloaked.` };
  } catch (e) { return { age: null, raw: `PROBE_ERROR: ${domain}` }; }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, brandName, fileMeta } = await req.json();
    if (!content) return new NextResponse("PAYLOAD_NULL", { status: 400 });

    const domains = extractDomains(content);
    const domainResults = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d)));
    const forensicText = domainResults.map(r => r.raw).join("\n") || "NO_URLS_DETECTED";

    const systemInstruction = `
      You are 'Sentinel-1', the Syndicate's lead Forensic Analyst.
      TASK: Verify a job lead.
      
      CORE LOGIC:
      - BRAND NEW DOMAINS (<180 days) = SCAM.
      - GMAIL/OUTLOOK for large corps = SCAM.
      - SCAM MARKERS: Asking for 'Training Fees', 'Equipment Checks', 'Kindly', 'Immediate Start'.
      
      OUTPUT: Return ONLY valid JSON with:
      - verdict: "CLEAR", "CAUTION", or "SCAM"
      - trust_score: integer between 1 and 100 (NEVER 0. For high risk scams, use 1-10. For clear offers, use 90-100).
      - red_flags: array of strings
      - analysis: 1-2 sentence explanation
      - recommendation: actionable advice
      - category: short category name
    `;

    const response = await generateAIResponse(`DATA:\n${content}\n\nFORENSICS:\n${forensicText}`, systemInstruction);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      result.forensic_data = forensicText;
      
      // ENSURE trust_score IS A NUMBER AND NOT ZERO
      if (typeof result.trust_score !== 'number' || result.trust_score === 0) {
        result.trust_score = result.confidence || 50;
      }
    } catch (e) { 
      console.error("AI Parse Error:", response);
      return new NextResponse("INTEL_PARSE_ERROR", { status: 500 }); 
    }

    // COMMUNITY SYNC
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Always log the scan metadata if it's a SCAM to the community_threats table
        if (result.verdict === "SCAM") {
          const { error } = await supabase.from('community_threats').insert({
            brand_name: brandName || result.category || "UNKNOWN_THREAT",
            domain: domains[0] || "BEHAVIORAL_THREAT",
            category: result.category || "GENERAL_FRAUD",
            user_id: userId || "anonymous"
          });
          if (error) console.error("SUPABASE_INSERT_ERROR:", error.message);
        }
      }
    } catch (syncErr) {
      console.error("SUPABASE_SYNC_EXCEPTION:", syncErr);
    }

    return NextResponse.json(result);
  } catch (error: any) { 
    console.error("SCAN_ROUTE_CRITICAL_FAILURE:", error);
    return new NextResponse("NODE_SYNC_FAILURE", { status: 500 }); 
  }
}
