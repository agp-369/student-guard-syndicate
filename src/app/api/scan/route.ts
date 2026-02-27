import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";
import { createClient } from "@supabase/supabase-js";

// Helper to extract URLs
function extractDomains(text: string) {
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
  const matches = [...text.matchAll(urlRegex)];
  return [...new Set(matches.map(m => m[1]))]; // Unique domains
}

// Helper to check domain age via public RDAP (Real Forensics)
async function checkDomainAge(domain: string) {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { next: { revalidate: 3600 } });
    if (!res.ok) return `Could not fetch WHOIS for ${domain}. It may be hidden or invalid.`;
    const data = await res.json();
    
    // Find registration event
    const regEvent = data.events?.find((e: any) => e.eventAction === "registration");
    if (regEvent && regEvent.eventDate) {
      const regDate = new Date(regEvent.eventDate);
      const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Domain '${domain}' was registered on ${regDate.toISOString().split('T')[0]} (Age: ${ageDays} days). ${ageDays < 180 ? 'CRITICAL WARNING: DOMAIN IS BRAND NEW.' : 'Domain has established history.'}`;
    }
    return `Domain '${domain}' exists, but creation date is cloaked.`;
  } catch (e) {
    return `RDAP Probe Failed for ${domain}.`;
  }
}

export async function POST(req: Request) {
  try {
    const { content, brandName } = await req.json();
    if (!content) return new NextResponse("Input Error: Content is required.", { status: 400 });

    // 1. ACTIVE FORENSIC PROBING
    const domains = extractDomains(content);
    let forensicEvidence = "No domains found in payload.\n";
    if (domains.length > 0) {
      const domainChecks = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d))); // Check up to 2 domains
      forensicEvidence = "--- REAL-TIME DNS FORENSICS ---\n" + domainChecks.join("\n") + "\n-------------------------------\n";
    }

    // 2. AI SYNTHESIS WITH HARD DATA
    const systemInstruction = `
      You are 'StudentGuard Core', an elite Cyber-Forensics AI.
      You are analyzing a potential recruitment/job scam.
      
      CRITICAL: You have been provided with 'REAL-TIME DNS FORENSICS' gathered by our backend. 
      If the forensics say a domain is BRAND NEW (under 180 days old) and they are offering a job, it is almost certainly a SCAM. Legitimate companies have old domains.
      
      OUTPUT: Return ONLY valid JSON with these exact keys: verdict ("SAFE", "CAUTION", "SCAM"), confidence (0-100), red_flags (array of strings), analysis (incorporate the domain age if available), recommendation, category (e.g., "Data Entry Scam", "Fake Check").
    `;

    const fullPayload = `TEXT TO ANALYZE:\n${content}\n\n${forensicEvidence}`;
    const response = await generateAIResponse(fullPayload, systemInstruction);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response;
      result = JSON.parse(jsonString);
      result.forensic_data = forensicEvidence; // Pass back to frontend
    } catch (parseErr) {
      return new NextResponse(`Intelligence Node Error: Invalid data format.`, { status: 500 });
    }

    // 3. COMMUNITY SYNC
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Anonymous Entity",
          domain: domains[0] || "No URL",
          category: result.category || "General Threat"
        });
      } catch (dbErr) { /* non-blocking */ }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return new NextResponse(`Node Sync Failure: ${error.message}`, { status: 500 });
  }
}
