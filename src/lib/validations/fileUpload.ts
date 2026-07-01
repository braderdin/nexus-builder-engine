import { z } from "zod";

// Start: Global Storage Restriction Constants
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // Strict limit: 2MB Maximum File Size
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const FORBIDDEN_EXTENSIONS = [".exe", ".bat", ".sh", ".cmd", ".msi", ".zip", ".rar", ".mp3", ".mp4"];
// End: Global Storage Restriction Constants

// Start: Secure Upload Security Validation Schema
export const fileUploadSecuritySchema = z.object({
  fileName: z
    .string()
    .min(1, { message: "File name cannot be empty" })
    .refine(
      (name) => !FORBIDDEN_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)),
      { message: "Malicious script or executable file type detected. Upload blocked." }
    ),
  fileSize: z
    .number()
    .max(MAX_FILE_SIZE_BYTES, { message: "File size exceeds the critical 2MB limit for free tier." }),
  mimeType: z
    .string()
    .refine(
      (type) => ALLOWED_IMAGE_TYPES.includes(type),
      { message: "Invalid media format. Only standard compressed web images are accepted." }
    ),
});
// End: Secure Upload Security Validation Schema

// Start: Anti-XSS Payload Sanitizer Hook
export function sanitizeUserTextInput(rawInput: string): string {
  // Strips potential HTML tags and malicious script injections before writing to Supabase JSON
  return rawInput
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
// End: Anti-XSS Payload Sanitizer Hook