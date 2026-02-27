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
    if (!res.ok) return `Could not fetch RDAP for ${domain}.`;
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
    if (!content) return new NextResponse("Scanning Payload Missing", { status: 400 });

    // 1. ACTIVE FORENSIC PROBING
    const domains = extractDomains(content);
    let forensicEvidence = "No URLs detected in payload.\n";
    if (domains.length > 0) {
      const domainChecks = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d)));
      forensicEvidence = "--- REAL-TIME DNS FORENSICS ---\n" + domainChecks.join("\n") + "\n-------------------------------\n";
    }

    const systemInstruction = `
      You are 'StudentGuard Core', an elite Cyber-Forensics AI using Gemini 2.5 Flash.
      TASK: Analyze the provided content for recruitment fraud targeting students.
      
      CRITICAL: You have been provided with 'REAL-TIME DNS FORENSICS'. 
      If forensics indicate a domain is BRAND NEW (under 180 days old) and they are offering a job, it is almost certainly a SCAM.
      
      OUTPUT: Return ONLY valid JSON with these exact keys: 
      verdict ("CLEAR", "CAUTION", "SCAM"), 
      confidence (0-100), 
      red_flags (array of strings), 
      analysis (grounded in the text and forensics), 
      recommendation, 
      category (e.g. "Data Entry Scam", "Corporate Verified", "Phishing").
    `;

    // 2. ENGAGE GEMINI 2.5 FLASH
    const fullPayload = `TEXT TO ANALYZE:\n${content}\n\n${forensicEvidence}`;
    const response = await generateAIResponse(fullPayload, systemInstruction);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      result.forensic_data = forensicEvidence; // Pass back to frontend
    } catch (parseErr) {
      return new NextResponse("Intelligence Node Error: Malformed Data Output.", { status: 500 });
    }

    // 3. COMMUNITY DEFENSE SYNC
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Target_Node_Unknown",
          domain: domains[0] || "No_Payload_URL",
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
