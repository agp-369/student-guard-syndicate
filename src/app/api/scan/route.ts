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

    // 1. FORENSIC PROBING (Domain + Behavior)
    const domains = extractDomains(content);
    const domainResults = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d)));
    const forensicText = domainResults.map(r => r.raw).join("\n");

    // 2. INTELLIGENCE SYNTHESIS (Gemini 2.5 Flash)
    const systemInstruction = `
      You are 'Sentinel-1', the Syndicate's lead Forensic Analyst.
      TASK: Verify a job lead.
      
      CORE LOGIC:
      - NO DOMAIN? Look for 'Off-Platform Redirection' (Telegram, WhatsApp, Signal).
      - LEGIT DOMAIN? (e.g. gmail.com) Check if they are claiming to be a large corp. Real corps don't use Gmail.
      - SCAM MARKERS: Asking for 'Training Fees', 'Equipment Checks', 'Kindly', 'Immediate Start'.
      
      OUTPUT: Return ONLY JSON with: verdict ("CLEAR", "CAUTION", "SCAM"), trust_score, red_flags, analysis (explain behavior + forensics), recommendation, category.
    `;

    const response = await generateAIResponse(`DATA:\n${content}\n\nFORENSICS:\n${forensicText}`, systemInstruction);
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      result.forensic_data = forensicText || "NO_DOMAIN_DETECTED: ANALYZING_SOCIAL_BEHAVIOR_PATTERNS...";
    } catch (e) { return new NextResponse("INTEL_PARSE_ERROR", { status: 500 }); }

    // 3. COMMUNITY SYNC
    if (result.verdict === "SCAM") {
      try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "UNDISCLOSED_ENTITY",
          domain: domains[0] || "BEHAVIORAL_THREAT",
          category: result.category || "GENERAL_FRAUD",
          user_id: userId || "ANONYMOUS_NODE"
        });
      } catch (syncErr) {}
    }

    return NextResponse.json(result);
  } catch (error: any) { return new NextResponse("NODE_SYNC_FAILURE", { status: 500 }); }
}
