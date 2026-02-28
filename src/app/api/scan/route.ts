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
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { age: null, raw: `RDAP_FAILURE: ${domain}` };
    const data = await res.json();
    const regEvent = data.events?.find((e: any) => e.eventAction === "registration");
    if (regEvent && regEvent.eventDate) {
      const regDate = new Date(regEvent.eventDate);
      const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return { age: ageDays, raw: `Domain: ${domain} | Registered: ${regDate.toISOString().split('T')[0]} (${ageDays} days ago)` };
    }
    return { age: null, raw: `Domain: ${domain} | Registration hidden.` };
  } catch (e) { return { age: null, raw: `PROBE_ERROR: ${domain}` }; }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, brandName, fileMeta } = await req.json();
    if (!content) return new NextResponse("PAYLOAD_NULL", { status: 400 });

    // 1. HARD FORENSICS
    const domains = extractDomains(content);
    const domainResults = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d)));
    const forensicText = domainResults.map(r => r.raw).join("\n");
    const minAge = Math.min(...domainResults.map(r => r.age || 9999));

    // 2. INTELLIGENCE SYNTHESIS
    const systemInstruction = `
      You are 'Sentinel-1', the core AI of the StudentGuard Syndicate.
      MISSION: Provide a definitive security clearance for a job/internship lead.
      
      RULES:
      - BRAND NEW DOMAINS (<180 days) = SCAM.
      - GMAIL/OUTLOOK for large corps = SCAM.
      - Metadata forgery (e.g. Acme Corp PDF made in 'iLovePDF') = SCAM.
      
      OUTPUT: Return ONLY JSON with:
      - verdict: "CLEAR" | "CAUTION" | "SCAM"
      - trust_score: number (0-100)
      - red_flags: string[]
      - analysis: string
      - recommendation: string
      - category: string
    `;

    const response = await generateAIResponse(`DATA:\n${content}\n\nFORENSICS:\n${forensicText}`, systemInstruction);
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      result.forensic_data = forensicText;
    } catch (e) { return new NextResponse("INTEL_PARSE_ERROR", { status: 500 }); }

    // 3. REPUTATION LEDGER SYNC
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "UNDISCLOSED_ENTITY",
          domain: domains[0] || "NO_URL",
          category: result.category || "GENERAL_FRAUD",
          user_id: userId || "ANONYMOUS_NODE"
        });
      }
    } catch (syncErr) {}

    return NextResponse.json(result);
  } catch (error: any) { return new NextResponse("NODE_SYNC_FAILURE", { status: 500 }); }
}
