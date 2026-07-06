// Start: Core React, Zod, and Backend Dependency Imports
import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { checkSubdomainAvailability } from "@/lib/supabase/sites";
import { siteConfigSchema } from "@/lib/validations/site";
// End: Core React, Zod, and Backend Dependency Imports

// Start: Component Local Type Definitions
interface SubdomainCheckerProps {
  onSubdomainChange: (subdomain: string, isValidAndAvailable: boolean) => void;
}
// End: Component Local Type Definitions

// Start: Subdomain Input Validation Schema (Reusing existing siteConfigSchema for subdomain)
const subdomainValidationSchema = z.object({
  subdomain: siteConfigSchema.shape.subdomain, // Reuse the subdomain validation from siteConfigSchema
});
// End: Subdomain Input Validation Schema

// Start: Subdomain Availability Checker Component
export default function SubdomainChecker({ onSubdomainChange }: SubdomainCheckerProps) {
  const [subdomainInput, setSubdomainInput] = useState<string>("");
  const [isValidFormat, setIsValidFormat] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Start: Debounce and API Call Lifecycle
  useEffect(() => {
    setErrorMessage(null); // Reset error message on input change
    setIsAvailable(null); // Reset availability on input change

    if (!subdomainInput.trim()) {
      setIsValidFormat(null);
      onSubdomainChange("", false);
      return;
    }

    // Client-side Zod validation
    const validationResult = subdomainValidationSchema.safeParse({ subdomain: subdomainInput });
    if (!validationResult.success) {
      setIsValidFormat(false);
      setErrorMessage(validationResult.error.issues[0].message);
      onSubdomainChange(subdomainInput, false);
      return;
    } else {
      setIsValidFormat(true);
      setErrorMessage(null);
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const taken = await checkSubdomainAvailability(subdomainInput);
        setIsAvailable(!taken); // If taken is true, it's NOT available
        onSubdomainChange(subdomainInput, !taken); // Pass availability status
      } catch (error) {
        console.error("Error checking subdomain availability:", error);
        setIsAvailable(false); // Assume not available on error
        onSubdomainChange(subdomainInput, false);
        setErrorMessage("An error occurred while checking availability.");
      } finally {
        setIsLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [subdomainInput, onSubdomainChange]);
  // End: Debounce and API Call Lifecycle

  const badgeColorClass = isAvailable ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" : "bg-red-950/40 text-red-400 border-red-800";
  const badgeText = isAvailable ? "Available" : "Taken";

  return (
    <div className="space-y-3">
      <label htmlFor="subdomain-input" className="block text-xs font-semibold text-slate-300">
        Custom Subdomain <span className="text-slate-500">(e.g., my-store-name)</span>
      </label>
      <div className="relative flex items-center">
        <input
          id="subdomain-input"
          type="text"
          value={subdomainInput}
          onChange={(e) => setSubdomainInput(e.target.value)}
          placeholder="Enter a unique subdomain"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors w-full pr-28 sm:pr-32" // Added padding-right for badge
          disabled={isLoading}
        />
        <span className="absolute right-3 text-xs text-slate-500">
          .superpage.link
        </span>
        {(isValidFormat !== null && isValidFormat && isAvailable !== null && !isLoading) && (
          <span className={`absolute top-1/2 -translate-y-1/2 right-[125px] sm:right-[135px] text-[10px] font-bold px-2 py-1 rounded-md border ${badgeColorClass} tracking-wider`}>
            {badgeText}
          </span>
        )}
        {isLoading && (
          <div className="absolute top-1/2 -translate-y-1/2 right-[125px] sm:right-[135px] flex items-center justify-center">
            <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
// End: Subdomain Availability Checker Component
