import { z } from "zod";

// Start: Global Storage Restriction Constants
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // Strict limit: 2MB Maximum Individual File Size
export const MAX_TOTAL_STORAGE_BYTES = 25 * 1024 * 1024; // Strict limit: 25MB Maximum Total Storage Allocation
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const FORBIDDEN_EXTENSIONS = [".exe", ".bat", ".sh", ".cmd", ".msi", ".zip", ".rar", ".mp3", ".mp4"];
// End: Global Storage Restriction Constants

// Start: Secure Upload Security Validation Schema
export const createFileUploadSecuritySchema = (totalStorageUsedBytes: number) => z.object({
  fileName: z
    .string()
    .min(1, { message: "File name cannot be empty" })
    .refine(
      (name) => !FORBIDDEN_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)),
      { message: "Malicious script or executable file type detected. Upload blocked." }
    ),
  fileSize: z
    .number()
    .max(MAX_FILE_SIZE_BYTES, { message: "Individual file size exceeds the critical 2MB limit." })
    .refine(
      (currentFileSize) => (totalStorageUsedBytes + currentFileSize) <= MAX_TOTAL_STORAGE_BYTES,
      { message: `Total storage limit (${MAX_TOTAL_STORAGE_BYTES / (1024 * 1024)}MB) exceeded. Current usage: ${Math.round(totalStorageUsedBytes / (1024 * 1024))}MB.` }
    ),
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
