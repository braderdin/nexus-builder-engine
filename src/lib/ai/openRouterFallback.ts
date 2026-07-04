// Start: Enterprise Structural Interface Definitions
export interface OpenRouterMessageNode {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterErrorPayload {
  error?: {
    code: number;
    message: string;
  };
}
// End: Enterprise Structural Interface Definitions

// Start: Dynamic Secure Key Extraction Framework
const getOpenRouterKeys = (): string[] => {
  const rawKeysString = process.env.NEXT_PUBLIC_OPENROUTER_KEYS || "";
  if (!rawKeysString) {
    return ["dummy-fallback-key"];
  } // FIXED: Added missing closing brace for if block
  return rawKeysString.split(",").map(key => key.trim());
}; // FIXED: Added missing closing brace for arrow function framework

let currentKeyIndex = 0;
// End: Dynamic Secure Key Extraction Framework

// Start: OpenRouter Fallback Request Executor
export async function callOpenRouterWithFallback(
  messages: OpenRouterMessageNode[],
  model: string = "google/gemini-2.5-flash"
): Promise<any> {
  const rotatedKeysVault = getOpenRouterKeys();
  
  // Outer layer constraint guarantees we only loop maximum up to the total available key counts
  for (let attempt = 0; attempt < rotatedKeysVault.length; attempt++) {
    const activeOpenRouterKey = rotatedKeysVault[currentKeyIndex];

    try {
      console.log(`[OpenRouter Engine] Triggering request safely via Environment Index: ${currentKeyIndex}`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${activeOpenRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nexus-builder-engine.vercel.app",
          "X-Title": "Nexus Production Builder Suite"
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.5,
          max_tokens: 1024
        }),
        cache: "no-store"
      });

      if (response.status === 429) {
        console.warn(`[WARN] OpenRouter Index ${currentKeyIndex} hit 429 limit! Rotating pointer...`);
        currentKeyIndex = (currentKeyIndex + 1) % rotatedKeysVault.length;
        continue;
      }

      const parsedDataJson: OpenRouterErrorPayload = await response.json();

      if (parsedDataJson.error && parsedDataJson.error.code === 429) {
        console.warn(`[WARN] Internal OpenRouter JSON response reported 429 error! Rotating pointer...`);
        currentKeyIndex = (currentKeyIndex + 1) % rotatedKeysVault.length;
        continue;
      }

      return parsedDataJson;

    } catch (runtimeNetworkFetchError) {
      console.error(`[CRITICAL ERROR] Failed connection execution on Index ${currentKeyIndex}:`, runtimeNetworkFetchError);
      currentKeyIndex = (currentKeyIndex + 1) % rotatedKeysVault.length;
    }
  }

  throw new Error("🚨 TRAGEDI: Kesemua API Key OpenRouter rahsia di platform anda telah kehabisan threshold!");
} // FIXED: Added missing closing brace for callOpenRouterWithFallback function block
// End: OpenRouter Fallback Request Executor