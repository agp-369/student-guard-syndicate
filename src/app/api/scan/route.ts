import { NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    if (!content) return new NextResponse("Payload missing", { status: 400 });

    const systemInstruction = `
      You are 'StudentGuard Core', an autonomous agent dedicated to identifying recruitment fraud.
      
      TASK: Analyze the provided content for signs of a scam targeting students.
      
      OUTPUT: You must return valid JSON with these keys:
      - verdict: "SAFE" | "CAUTION" | "SCAM"
      - confidence: number (0-100)
      - red_flags: string[]
      - analysis: string (detailed reasoning)
      - recommendation: string
    `;

    const response = await generateAIResponse(content, systemInstruction);
    return NextResponse.json(JSON.parse(response || "{}"));
  } catch (error) {
    console.error("Scan Error:", error);
    return new NextResponse("Analysis Node Failure", { status: 500 });
  }
}
