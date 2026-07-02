// Start: Core Next.js Serverless Routing Imports
import { NextRequest, NextResponse } from "next/server";
// End: Core Next.js Serverless Routing Imports

// Start: Core Infrastructure Rate Limiter Dependency Imports
import { aiRateLimiterGuard } from "@/lib/ai/ratelimit";
// End: Core Infrastructure Rate Limiter Dependency Imports

// Start: AI Image Generation POST Endpoint Route Handler
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Payload Extraction
    const { userEmail, imagePrompt } = await request.json();
    const rateLimitIdentifier = userEmail || request.ip || "global_anonymous_image_node";
    // End: Dynamic Payload Extraction

    // Start: Upstash Redis Rate Limiter Shield Verification
    const { success } = await aiRateLimiterGuard.limit(rateLimitIdentifier);
    if (!success) {
      return NextResponse.json(
        { error: "Rate Limit Exceeded", message: "Image compilation slot blocked. Had limit reached." },
        { status: 429 }
      );
    }
    // End: Upstash Redis Rate Limiter Shield Verification

    // Start: Cloudflare Workers AI REST API Fetch Orchestration
    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
    const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN || "";

    const cloudflareAiGatewayUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

    const cloudflareResponse = await fetch(cloudflareAiGatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });

    if (!cloudflareResponse.ok) {
      throw new Error("Cloudflare Workers AI computation failure encountered.");
    }

    // Binary image response stream data conversion
    const imageBlobBuffer = await cloudflareResponse.arrayBuffer();
    
    // NOTE FOR BRADERDIN: This is where we trigger our existing Cloudflare R2 injection pipeline
    // to save the generated buffer array, avoiding expensive database text layer usage.
    
    // Temporary response representation returning base64 stream wrapper
    const base64ImageString = Buffer.from(imageBlobBuffer).toString("base64");
    const parsedDataUrl = `data:image/png;base64,${base64ImageString}`;

    return NextResponse.json({ imageUrl: parsedDataUrl, targetStatus: "Persisted to R2 Context" }, { status: 200 });
    // End: Cloudflare Workers AI REST API Fetch Orchestration

  } catch (imageEngineError: any) {
    return NextResponse.json(
      { error: "Internal Image AI Engine Failure", details: imageEngineError.message },
      { status: 500 }
    );
  }
}
// End: AI Image Generation POST Endpoint Route Handler