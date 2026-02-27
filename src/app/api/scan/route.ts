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
    if (!res.ok) return `Could not fetch RDAP for ${domain}.`;
    const data = await res.json();
    const regEvent = data.events?.find((e: any) => e.eventAction === "registration");
    if (regEvent && regEvent.eventDate) {
      const regDate = new Date(regEvent.eventDate);
      const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return `Domain '${domain}' registered on ${regDate.toISOString().split('T')[0]} (Age: ${ageDays} days).`;
    }
    return `Domain '${domain}' exists (history cloaked).`;
  } catch (e) { return `RDAP Probe Failed for ${domain}.`; }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { content, brandName, fileMeta } = await req.json();
    if (!content) return new NextResponse("Scanning Payload Missing", { status: 400 });

    const domains = extractDomains(content);
    let forensicEvidence = "--- REAL-TIME DNS FORENSICS ---\n";
    if (domains.length > 0) {
      const domainChecks = await Promise.all(domains.slice(0, 2).map(d => checkDomainAge(d)));
      forensicEvidence += domainChecks.join("\n") + "\n";
    } else {
      forensicEvidence += "No domains detected in payload.\n";
    }

    if (fileMeta) {
      forensicEvidence += `\n--- FILE METADATA FORENSICS ---\nPRODUCER: ${fileMeta.Producer}\nCREATOR: ${fileMeta.Creator}\n-------------------------------\n`;
    }

    const systemInstruction = `
      You are 'StudentGuard Core', an elite Cyber-Forensics AI using Gemini 2.5 Flash.
      TASK: Analyze the provided content for recruitment fraud.
      
      FORENSIC RULE: 
      1. If DNS Forensics say a domain is < 180 days old, it is high risk.
      2. If File Metadata shows a 'Producer' like 'iLovePDF' or 'SmallPDF' for a major corporation (e.g. Amazon, Google), it is a FORGERY.
      
      OUTPUT: Return ONLY valid JSON with keys: verdict ("CLEAR", "CAUTION", "SCAM"), confidence (0-100), red_flags, analysis, recommendation, category.
    `;

    const response = await generateAIResponse(`TEXT:\n${content}\n\n${forensicEvidence}`, systemInstruction);
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : response);
      result.forensic_data = forensicEvidence;
    } catch (parseErr) { return new NextResponse("Intelligence Node Error", { status: 500 }); }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseKey && result.verdict === "SCAM") {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase.from('community_threats').insert({
          brand_name: brandName || "Target_Unknown",
          domain: domains[0] || "No_URL",
          category: result.category || "General_Fraud",
          user_id: userId || "anonymous"
        });
      }
    } catch (syncErr) { console.warn("Syndicate Ledger Offline."); }

    return NextResponse.json(result);
  } catch (error: any) { return new NextResponse(error.message, { status: 500 }); }
}
