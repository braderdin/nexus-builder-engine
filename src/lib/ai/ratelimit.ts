// Start: Upstash SDK Core Imports
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
// End: Upstash SDK Core Imports

// Start: Redis Cache Client Initialization
export const redisCacheClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});
// End: Redis Cache Client Initialization

// Start: Dynamic Rate Limiter Rule Setup
/**
 * Global API Guardrail: Limits user attempts to 5 requests per 60-second window
 */
export const aiRateLimiterGuard = new Ratelimit({
  redis: redisCacheClient,
  limiter: Ratelimit.fixedWindow(5, "1 d"),
  analytics: true,
  prefix: "@nexus/ratelimit",
});
// End: Dynamic Rate Limiter Rule Setup
