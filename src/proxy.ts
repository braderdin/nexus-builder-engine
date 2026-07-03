import { NextRequest, NextResponse } from "next/server";

// Start: Multi-Tenant Subdomain Rewriting Proxy
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Start: Internal Network Asset Guardrail Exclusions
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  // End: Internal Network Asset Guardrail Exclusions

  // Start: Extract Subdomain Identifier Based on Environment Matcher
  // Reverted back to free-tier superpage.link cosmetic branding blueprint
  const currentHost = process.env.NODE_ENV === "production" 
    ? hostname.replace(".superpage.link", "")
    : hostname.replace(".localhost:3000", "");
  // End: Extract Subdomain Identifier Based on Environment Matcher

  // Start: Shield Core Application Platform Paths From Mutation
  const isCorePlatformRoute = 
    currentHost === hostname || 
    currentHost === "localhost:3000" || 
    currentHost === "superpage.link" ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/dashboard");

  if (isCorePlatformRoute) {
    return NextResponse.next();
  }
  // End: Shield Core Application Platform Paths From Mutation

  // Start: Silently Rewrite Endpoint Target Routing Internally
  url.pathname = `/site/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
  // End: Silently Rewrite Endpoint Target Routing Internally
}
// End: Multi-Tenant Subdomain Rewriting Proxy