// Start: Core Next.js Serverless Routing Imports
import { NextRequest, NextResponse } from "next/server";
// End: Core Next.js Serverless Routing Imports

// Start: Core Infrastructure and Multi-Provider AI SDK Dependency Imports
import { aiRateLimiterGuard } from "@/lib/ai/ratelimit";
import Groq from "groq-sdk";
// End: Core Infrastructure and Multi-Provider AI SDK Dependency Imports

// Start: Global Client Architecture Instantiations
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });
// End: Global Client Architecture Instantiations

// Start: Unified Multi-Provider AI Engine POST Handler Pipeline
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Context Payload Extraction
    const { userEmail, userPrompt, targetAiModule } = await request.json();
    // Upgraded request.ip to headers fetch to pass strict production TypeScript type checking
    const clientIpAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitIdentifier = userEmail || clientIpAddress || "global_anonymous_node";
    // End: Dynamic Context Payload Extraction

    // Start: Upstash Redis Token Allocation Verification Shield
    const { success } = await aiRateLimiterGuard.limit(rateLimitIdentifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate Limit Exceeded", message: "Free tier threshold restriction reached." },
        { status: 429 }
      );
    }
    // End: Upstash Redis Token Allocation Verification Shield

    // Start: System Constraint Directive Construction
    const systemPromptDirective = `You are the Nexus Engine AI Assistant, embedded inside a next-generation SaaS website builder platform. 
    Your core specialization is to assist Malaysian merchants, small business owners, and learners in generating brilliant website layout ideas, structuring high-converting copywriting, fixing frontend programming bugs, optimizing search engine optimization (SEO), and configuring seamless direct-to-WhatsApp order forms.
    - You must only use standard Malaysian Malay (Bahasa Melayu Malaysia Standard) or corporate professional English.
    - Absolutely NEVER use Indonesian vocabulary, slangs, or syntax (e.g. change ide to idea, biaya to kos, tombol to butang, unduh to muat turun).`;
    // End: System Constraint Directive Construction

    // Start: Dynamic Multi-Provider AI Switch Allocation Controller
    if (targetAiModule === "openrouter-reasoning") {
      // Start: OpenRouter DeepSeek R1 Advanced Reasoning Pipeline Deployment
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [
            { role: "system", content: `${systemPromptDirective} You are now in advanced reasoning self-healing layout JSON check mode.` },
            { role: "user", content: userPrompt }
          ],
        }),
      });

      const openRouterData = await openRouterResponse.json();
      const reasoningOutputText = openRouterData.choices[0]?.message?.content || "OpenRouter analytics returned empty buffer.";
      return NextResponse.json({ responseText: reasoningOutputText }, { status: 200 });
      // End: OpenRouter DeepSeek R1 Advanced Reasoning Pipeline Deployment
    } 
    
    if (targetAiModule === "google-gemini-fallback") {
      // Start: Google Gemini Studio Fallback Channel API Routing Pipeline
      const geminiStudioUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      const geminiResponse = await fetch(geminiStudioUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPromptDirective}\n\nUser Query: ${userPrompt}` }] }]
        }),
      });

      const geminiData = await geminiResponse.json();
      const geminiOutputText = geminiData.candidates[0]?.content?.parts[0]?.text || "Gemini fallback buffer parsed empty.";
      return NextResponse.json({ responseText: geminiOutputText }, { status: 200 });
      // End: Google Gemini Studio Fallback Channel API Routing Pipeline
    }

    // Start: Default Primary Core Channel Route - Lightning Fast Groq Cloud Pipeline
    const groqChatCompletion = await groqClient.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPromptDirective },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const groqOutputText = groqChatCompletion.choices[0]?.message?.content || "Groq client output buffer returned empty.";
    return NextResponse.json({ responseText: groqOutputText }, { status: 200 });
    // End: Default Primary Core Channel Route - Lightning Fast Groq Cloud Pipeline

  } catch (apiUnifiedCrashError: any) {
    return NextResponse.json(
      { error: "Unified AI Gateway Routing Anomaly", details: apiUnifiedCrashError.message },
      { status: 500 }
    );
  }
}
// End: Unified Multi-Provider AI Engine POST Handler Pipeline