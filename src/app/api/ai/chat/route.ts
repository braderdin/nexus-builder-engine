// Start: Core Next.js Serverless Routing Imports
import { NextRequest, NextResponse } from "next/server";
// End: Core Next.js Serverless Routing Imports

// Start: Core Infrastructure and AI SDK Dependency Imports
import { aiRateLimiterGuard } from "@/lib/ai/ratelimit";
import Groq from "groq-sdk";
// End: Core Infrastructure and AI SDK Dependency Imports

// Start: Groq Cloud SDK Client Architecture Initialization
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});
// End: Groq Cloud SDK Client Architecture Initialization

// Start: AI Engine Live POST Endpoint Route Handler
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Payload Extraction
    const { userEmail, userPrompt } = await request.json();
    const rateLimitIdentifier = userEmail || request.ip || "global_anonymous_node";
    // End: Dynamic Payload Extraction

    // Start: Upstash Redis Token Allocation Verification Shield
    const { success, limit, reset, remaining } = await aiRateLimiterGuard.limit(rateLimitIdentifier);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: "Rate Limit Exceeded", 
          message: "Free tier constraint triggered. You have exceeded the 5 prompt interactions per minute allocation." 
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }
    // End: Upstash Redis Token Allocation Verification Shield

    // Start: Live Groq API Completion Request Execution
    const aiChatCompletion = await groq.chat.completions.create({
      // Upgraded to supported ultra-low latency Llama 3.1 model optimal for chat sessions
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content: `You are the Nexus Engine AI Assistant, embedded inside a next-generation SaaS website builder platform. 
          Your core specialization is to assist Malaysian merchants, small business owners, and learners in generating brilliant website layout ideas, structuring high-converting copywriting, fixing frontend programming bugs, optimizing search engine optimization (SEO), and configuring seamless direct-to-WhatsApp order forms. 
          Keep your responses highly structural, analytical, professional, concise, and friendly. Answer in the same language the merchant uses to ask.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });
    // End: Live Groq API Completion Request Execution

    // Start: Safe Response Payload Parsing
    const processedResponseText = aiChatCompletion.choices[0]?.message?.content || "The AI engine returned an empty completion buffer.";
    return NextResponse.json({ responseText: processedResponseText }, { status: 200 });
    // End: Safe Response Payload Parsing

  } catch (apiGatewayError: any) {
    // Start: Error Logging and Failure Recovery Response
    console.error("====== NEXUS AI ENGINE CRASH LOG ======");
    console.error(apiGatewayError);
    console.error("=======================================");

    return NextResponse.json(
      { error: "Internal AI Engine Processing Failure", message: apiGatewayError.message }, 
      { status: 500 }
    );
    // End: Error Logging and Failure Recovery Response
  }
}
// End: AI Engine Live POST Endpoint Route Handler