import { z } from "zod";

// Start: Target Market WhatsApp Phone Sanitizer
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Validates international E.164 phone formats
// End: Target Market WhatsApp Phone Sanitizer

// Start: Custom Subdomain & User Generated Content Schema
export const siteConfigSchema = z.object({
  subdomain: z
    .string()
    .min(3, { message: "Subdomain identifier must be at least 3 characters" })
    .max(30, { message: "Subdomain architecture restriction caps at 30 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Subdomain can only contain lowercase letters, numbers, and hyphens" }),
  seoTitle: z
    .string()
    .min(5, { message: "SEO performance optimization requires at least 5 characters" })
    .max(60, { message: "Google search layout truncation occurs beyond 60 characters" }),
  seoDescription: z
    .string()
    .min(10, { message: "Provide a descriptive summary for better search engine crawling" })
    .max(160, { message: "Meta description limit is capped at 160 characters for maximum SEO health" }),
  whatsappNumber: z
    .string()
    .regex(phoneRegex, { message: "Invalid Malaysian or International WhatsApp format. Example: 60123456789" }),
  themeLayoutJson: z
    .string()
    .refine((jsonString) => {
      try {
        JSON.parse(jsonString);
        return true;
      } catch {
        return false;
      }
    }, { message: "Critical Structural Error: Dynamic web layout configuration must be a valid serialized JSON string" })
    .refine((jsonString) => {
      // Direct prevention against embedded persistent XSS injections inside the structure JSON payload
      return !jsonString.toLowerCase().includes("<script>") && !jsonString.toLowerCase().includes("javascript:");
    }, { message: "Security Breached: Malicious payload or XSS script injection vectors detected within template structure" }),
});
// End: Custom Subdomain & User Generated Content Schema