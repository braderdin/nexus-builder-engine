"use client";

// Start: Core React Framework Dependency Imports
import React, { useState, useEffect, useCallback } from "react";
// End: Core React Framework Dependency Imports

// Start: Next.js and Supabase Dependency Imports
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
// End: Next.js and Supabase Dependency Imports

// Start: Static Proxy Router Infrastructure Details
// These are example values; in a production environment, these would be actual values from your infrastructure.
const PROXY_A_RECORD_IP = "76.76.21.21"; // A common placeholder for many CDN/proxy IPs (e.g., Vercel's)
const PROXY_CNAME_TARGET = "proxy.superpage.link"; // Example CNAME target for your platform's proxy
// End: Static Proxy Router Infrastructure Details

// Start: Custom Domain Settings Page Component
const CustomDomainSettingsPage: React.FC = () => {
  const router = useRouter();

  // Start: Component State Declarations
  const [userProfile, setUserProfile] = useState<any>(null); // To store user session information
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true); // Manages loading state for initial data fetch
  const [customDomainInput, setCustomDomainInput] = useState<string>(""); // Stores the user's custom domain input
  const [isValidDomainFormat, setIsValidDomainFormat] = useState<boolean | null>(null); // Tracks domain input format validity
  const [sslStatus, setSslStatus] = useState<"pending" | "active" | "error">("pending"); // Tracks SSL certificate provisioning status
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true); // Mock state for premium user status for UI demonstration
  // End: Component State Declarations

  // Start: User Session Verification Lifecycle
  // Verifies the user's authentication session and redirects if not authenticated.
  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth"); // Redirect unauthenticated users to the auth page
      } else {
        setUserProfile(session.user);
        // In a real application, you would fetch the user's premium status from your database
        // For this demonstration, we are mocking it as 'true' to display the premium UI
        // setIsPremiumUser(session.user.user_metadata?.is_premium || false);
        setIsPremiumUser(true); // Hardcoded to true for UI demo purposes
      }
      setIsDataLoading(false);
    };
    verifyUserSession();
  }, [router]);
  // End: User Session Verification Lifecycle

  // Start: Domain Input Validation Logic
  // Uses useCallback to memoize the validation function for performance.
  const validateDomain = useCallback((domain: string) => {
    if (domain.trim() === "") {
      return null; // If input is empty, reset validation status
    }
    // Regular expression for basic domain name validation.
    // Allows alphanumeric characters and hyphens, requires at least two parts (e.g., example.com),
    // and a TLD of 2 to 6 characters. Disallows leading/trailing hyphens.
    const domainRegex = /^(?!-)[A-Za-z0-9-]+([-.]{1}[A-Za-z0-9-]+)*\.[A-Za-z]{2,6}$/;
    return domainRegex.test(domain);
  }, []);

  // Effect to re-validate domain whenever `customDomainInput` changes.
  useEffect(() => {
    const validationResult = validateDomain(customDomainInput);
    setIsValidDomainFormat(validationResult);
  }, [customDomainInput, validateDomain]);
  // End: Domain Input Validation Logic

  // Start: SSL Status Simulation Lifecycle
  // Simulates the SSL certificate provisioning process.
  useEffect(() => {
    // Only simulate SSL provisioning if the domain format is valid and the user is premium.
    if (isValidDomainFormat && isPremiumUser && customDomainInput.trim() !== "") {
      setSslStatus("pending"); // Always start with "pending" when a valid domain is entered.

      const timer = setTimeout(() => {
        // Simulate a random outcome: 80% chance of success ("active"), 20% chance of error.
        setSslStatus(Math.random() > 0.2 ? "active" : "error");
      }, 5000); // Simulate a 5-second provisioning time.
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or dependency change.
    } else if (!isValidDomainFormat && customDomainInput.trim() !== "") {
      setSslStatus("error"); // Show an error if the domain format is invalid.
    } else {
      setSslStatus("pending"); // Default to "pending" if input is cleared or conditions not met.
    }
  }, [isValidDomainFormat, customDomainInput, isPremiumUser]);
  // End: SSL Status Simulation Lifecycle

  // Start: SSL Badge Renderer Utility
  // Renders a styled badge indicating the current SSL certificate status.
  const getSslBadge = () => {
    switch (sslStatus) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-950/40 text-yellow-400 border border-yellow-800 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            SSL Configuration Pending
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            SSL Configured & Active
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-950/40 text-red-400 border border-red-800">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            SSL Error (Contact Support)
          </span>
        );
    }
  };
  // End: SSL Badge Renderer Utility

  // Start: Loading State Renderer
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING CUSTOM DOMAIN WORKSPACE...
      </div>
    );
  }
  // End: Loading State Renderer

  // Start: Localized Dictionary for UI Text (Simplified for this page)
  const dict = {
    settingsTitle: "Custom Domains",
    settingsSub: "Manage your custom domains and DNS records for your deployed sites.",
    inputLabel: "Domain Name",
    inputPlaceholder: "yourdomain.com",
    dnsConfigHeader: "DNS Configuration Records",
    sslStatusHeader: "SSL Certificate Status",
    premiumFeatureNotice: "This feature is available for premium users only. Upgrade your plan to enable custom domains.",
  };
  // End: Localized Dictionary for UI Text

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* Start: Top Navigation Layout (Simplified for Sub-page consistency) */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
            Secure Node: {userProfile?.email || "Guest"}
          </span>
          {/* Button to navigate back to the main dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>
      {/* End: Top Navigation Layout */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {dict.settingsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            {dict.settingsSub}
          </p>
        </div>

        {/* Start: Custom Domain Management Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Connect Your Custom Domain
          </h3>
          <p className="text-sm text-slate-400">
            Point your domain to our platform to make your site live. Only root domains (e.g., `yourdomain.com`) are supported.
          </p>

          {/* Conditional rendering based on premium user status */}
          {!isPremiumUser ? (
            <div className="p-4 bg-yellow-950/40 border border-yellow-800 rounded-xl text-yellow-400 text-sm">
              {dict.premiumFeatureNotice}
            </div>
          ) : (
            <>
              {/* Domain Input Field */}
              <div className="space-y-4">
                <label htmlFor="custom-domain-input" className="block text-xs font-semibold text-slate-300">
                  {dict.inputLabel}
                </label>
                <input
                  id="custom-domain-input"
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => {
                    // Convert input to lowercase and remove spaces for consistency
                    setCustomDomainInput(e.target.value.toLowerCase().replace(/\s/g, ''));
                    // SSL status will naturally reset via useEffect triggered by customDomainInput change
                  }}
                  placeholder={dict.inputPlaceholder}
                  className={`w-full bg-slate-950 border ${
                    isValidDomainFormat === false ? 'border-red-500' : 'border-slate-800'
                  } rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors`}
                />
                {/* Validation Feedback */}
                {isValidDomainFormat === false && customDomainInput.length > 0 && (
                  <p className="text-xs text-red-400">Invalid domain format. Please enter a valid root domain (e.g., example.com).</p>
                )}
                {isValidDomainFormat && (
                    <p className="text-xs text-emerald-400">Domain format is valid. Follow the DNS instructions below.</p>
                )}
              </div>

              {/* Conditional rendering for DNS Configuration and SSL Status, only if domain is valid */}
              {isValidDomainFormat && (
                <>
                  {/* Start: DNS Configuration Table */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">{dict.dnsConfigHeader}</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                        <thead>
                          <tr className="text-left text-xs text-slate-400 uppercase tracking-wider bg-slate-900 border-b border-slate-800">
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Host</th>
                            <th className="px-4 py-3">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800 last:border-b-0">
                            <td className="px-4 py-3 text-sm font-mono text-white">A</td>
                            <td className="px-4 py-3 text-sm font-mono text-slate-300">@</td>
                            <td className="px-4 py-3 text-sm font-mono text-blue-400">{PROXY_A_RECORD_IP}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-mono text-white">CNAME</td>
                            <td className="px-4 py-3 text-sm font-mono text-slate-300">www</td>
                            <td className="px-4 py-3 text-sm font-mono text-blue-400">{PROXY_CNAME_TARGET}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Update these records in your domain registrar's DNS settings. Changes may take up to 48 hours to propagate.
                    </p>
                  </div>
                  {/* End: DNS Configuration Table */}

                  {/* Start: SSL Certificate Status */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-300">{dict.sslStatusHeader}</h4>
                    {getSslBadge()}
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We automatically provision a free SSL certificate for your custom domain. This process typically completes within minutes after DNS propagation.
                    </p>
                  </div>
                  {/* End: SSL Certificate Status */}
                </>
              )}
            </>
          )}
        </div>
        {/* End: Custom Domain Management Panel */}
      </main>
    </div>
  );
};

export default CustomDomainSettingsPage;
// End: Custom Domain Settings Page Component
