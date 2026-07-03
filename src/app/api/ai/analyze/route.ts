// Start: Core Next.js Serverless Routing Imports
import { NextRequest, NextResponse } from "next/server";
// End: Core Next.js Serverless Routing Imports

// Start: Core Infrastructure and Security Allocation Imports
import { aiRateLimiterGuard } from "@/lib/ai/ratelimit";
// End: Core Infrastructure and Security Allocation Imports

// Start: Self-Healing AI Engine POST Handler Pipeline
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Payload Context Extraction
    const { userEmail, invalidJsonLayout, errorLog } = await request.json();
    const clientIpAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitIdentifier = userEmail || clientIpAddress || "global_anonymous_healing_node";
    // End: Dynamic Payload Context Extraction

    // Start: Upstash Redis Token Allocation Verification Shield
    const { success } = await aiRateLimiterGuard.limit(rateLimitIdentifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate Limit Exceeded", message: "Self-healing core threshold reached. Retry later." },
        { status: 429 }
      );
    }
    // End: Upstash Redis Token Allocation Verification Shield

    // Start: Advanced System Constraint Directive Construction
    const selfHealingSystemDirective = `You are the Nexus Engine Self-Healing AI Core, specialized in repairing broken JSON structures for a SaaS website builder.
    Your objective is to read a broken or misconfigured website layout JSON along with its compilation error log, and return a perfectly structured, valid JSON patch.
    - Crucial: Output ONLY the raw valid JSON structure. Absolutely no markdown blocks, no backticks (\`\`\`json), and no conversational explanations.
    - Language Constraint: Inside text metadata fields, you must strictly use standard Malaysian Malay (Bahasa Melayu Malaysia) or corporate professional English. Avoid Indonesian terms entirely.`;
    // End: Advanced System Constraint Directive Construction

    // Start: Engineering Interactive Prompt Construction
    const userAnalysisPrompt = `
      [BROKEN_JSON_LAYOUT]
      ${JSON.stringify(invalidJsonLayout)}
      
      [COMPILATION_ERROR_LOG]
      ${errorLog}
      
      Please analyze the error log, sanitize the JSON schema structure, and return the fixed clean JSON payload.
    `;
    // End: Engineering Interactive Prompt Construction

    // Start: Google Gemini AI Studio 2.5 Flash Direct API Routing Pipeline
    const geminiStudioUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiStudioUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${selfHealingSystemDirective}\n\nTask Query: ${userAnalysisPrompt}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(errorData.error?.message || "Google Gemini upstream routing anomaly.");
    }

    const geminiData = await geminiResponse.json();
    const cleanJsonStringOutput = geminiData.candidates[0]?.content?.parts[0]?.text || "{}";
    
    // Parse the string to ensure it is valid JSON before returning to the frontend canvas
    const validatedJsonPayload = JSON.parse(cleanJsonStringOutput.trim());

    return NextResponse.json({ repairedLayout: validatedJsonPayload }, { status: 200 });
    // End: Google Gemini AI Studio 2.5 Flash Direct API Routing Pipeline

  } catch (selfHealingCrashError: any) {
    return NextResponse.json(
      { error: "Self-Healing Engine Routing Anomaly", details: selfHealingCrashError.message },
      { status: 500 }
    );
  }
}
// End: Self-Healing AI Engine POST Handler Pipeline