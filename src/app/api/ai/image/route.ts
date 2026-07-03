// Start: Core Next.js Serverless Routing Imports
import { NextRequest, NextResponse } from "next/server";
// End: Core Next.js Serverless Routing Imports

// Start: Core Infrastructure Rate Limiter Dependency Imports
import { aiRateLimiterGuard } from "@/lib/ai/ratelimit";
// End: Core Infrastructure Rate Limiter Dependency Imports

// Start: AI Image Generation POST Endpoint Route Handler
export async function POST(request: NextRequest) {
  try {
    // Start: Dynamic Payload Extraction and Pre-flight Validation
    const { userEmail, imagePrompt } = await request.json();

    if (!imagePrompt || typeof imagePrompt !== "string" || imagePrompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid Payload", message: "Image prompt is required and cannot be empty." },
        { status: 400 }
      );
    }
    
    // Upgraded request.ip to headers fetch to pass strict production TypeScript type checking
    const clientIpAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitIdentifier = userEmail || clientIpAddress || "global_anonymous_image_node";
    // End: Dynamic Payload Extraction and Pre-flight Validation

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
    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!cloudflareAccountId || !cloudflareApiToken) {
      return NextResponse.json(
        { error: "Configuration Error", message: "Cloudflare API credentials are not set." },
        { status: 500 }
      );
    }

    const cloudflareAiGatewayUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

    const cloudflareResponse = await fetch(cloudflareAiGatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cloudflareApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt }),
    });

    const contentTypeHeader = cloudflareResponse.headers.get("content-type") || "";
    
    // Start: Strict Content-Type Verification and Error Handling
    if (!cloudflareResponse.ok) {
      // Attempt to parse error as JSON if content-type suggests it
      if (contentTypeHeader.includes("application/json")) {
        const errorJsonPayload = await cloudflareResponse.json();
        return NextResponse.json(
          { 
            error: "Cloudflare AI Engine Rejection", 
            message: errorJsonPayload.errors?.[0]?.message || "Failed to generate visual content stream due to upstream error." 
          },
          { status: cloudflareResponse.status }
        );
      } else {
        // Handle non-JSON errors (e.g., HTML, plain text errors)
        const errorText = await cloudflareResponse.text();
        return NextResponse.json(
          { error: "Cloudflare AI Engine Rejection", message: `Upstream error (status ${cloudflareResponse.status}): ${errorText.substring(0, 100)}...` },
          { status: cloudflareResponse.status }
        );
      }
    }

    if (!contentTypeHeader.includes("image/png")) {
      // This means response was 200 OK, but not an image (unexpected)
      const responseText = await cloudflareResponse.text();
      return NextResponse.json(
        { error: "Unexpected Content Type", message: `Expected image/png, but received ${contentTypeHeader}. Response: ${responseText.substring(0, 100)}...` },
        { status: 500 }
      );
    }

    // Process image buffer only if response is OK and content type is image/png
    const imageBlobBuffer = await cloudflareResponse.arrayBuffer();
    const base64ImageString = Buffer.from(imageBlobBuffer).toString("base64");
    const parsedDataUrl = `data:image/png;base64,${base64ImageString}`;

    return NextResponse.json({ imageUrl: parsedDataUrl, targetStatus: "Persisted to Context" }, { status: 200 });
    // End: Strict Content-Type Verification and Error Handling
    // End: Cloudflare Workers AI REST API Fetch Orchestration

  } catch (imageEngineError: any) {
    return NextResponse.json(
      { error: "Internal Image AI Engine Failure", details: imageEngineError.message },
      { status: 500 }
    );
  }
}
// End: AI Engine Live POST Endpoint Route Handler
