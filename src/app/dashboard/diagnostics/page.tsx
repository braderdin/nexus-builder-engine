"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Start: Component Local Type Definitions
type AssetStatus = "PENDING" | "VALIDATING" | "PASS" | "FAILED" | "WARNING";

interface AssetDiagnostic {
  id: string;
  url: string;
  status: AssetStatus;
  message: string;
}

interface TerminalLogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
}

// Mock activePreviewJson structure for demonstration purposes on this standalone page
// In a real scenario, this data might come from a global state store or be fetched.
const MOCK_ACTIVE_PREVIEW_JSON = {
  heroSection: {
    headline: "Welcome to Our Premium WhatsApp Express Store",
    subheadline: "Browse high-converting local merchant configurations. Order directly through the encrypted WhatsApp gateway in one single tap.",
    ctaText: "Browse Collection",
  },
  whatsappFormSection: {
    promptTitle: "Direct Order Form Pipeline",
    buttonText: "Send Merchant Order via WhatsApp",
    targetNumber: "60123456789",
  },
  themeAccent: "emerald",
  featuresSection: [
    {
      title: "Seamless Ordering",
      description: "Customers can place orders directly via WhatsApp with just a few taps.",
    },
    {
      title: "Fast Deployment",
      description: "Get your store online in minutes, no coding required.",
    },
  ],
  portfolioSection: [
    { id: "p1", title: "Project Nexus", description: "Revolutionizing AI-driven web development.", imageUrl: "https://images.unsplash.com/photo-1516321497487-e2887aeec204?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "p2", title: "Quantum Sync", description: "Seamless data integration for enterprises.", imageUrl: "https://images.unsplash.com/photo-1507238691740-b52b2cefe19f?q=80&w=2750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: "p3", title: "Broken Image Link", description: "This image should fail.", imageUrl: "https://images.unsplash.com/photo-1234567890-broken-link-intended-to-fail.jpg" }, // Intentionally broken
    { id: "p4", title: "Another Valid Image", description: "Another image should pass.", imageUrl: "https://images.unsplash.com/photo-1549692520-acc6669e2fde?q=80&w=2833&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ],
  testimonialsSection: [
    { id: "t1", clientName: "Alice Smith", feedback: "Nexus transformed our online presence!", clientTitle: "CEO, Tech Solutions" },
  ],
};

// Start: Pre-flight Diagnostics & Asset Integrity Hub Page Component
export default function DiagnosticsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [diagnosticsResults, setDiagnosticsResults] = useState<AssetDiagnostic[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLogEntry[]>([]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditProgress, setAuditProgress] = useState<number>(0); // 0-100%

  const terminalLogRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Start: Helper for adding terminal log entries
  const addLog = (level: TerminalLogEntry["level"], message: string) => {
    setTerminalLogs((prevLogs) => [
      ...prevLogs,
      { timestamp: new Date().toLocaleTimeString(), level, message },
    ]);
  };
  // End: Helper for adding terminal log entries

  // Start: User Session Verification Effect
  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
        // Trigger initial audit after user session is confirmed
        runFullSystemReAudit();
      }
      setIsDataLoading(false);
    };

    verifyUserSession();
  }, [router]); // Only re-run if router changes

  // Start: Auto-scroll terminal log
  useEffect(() => {
    if (terminalLogRef.current) {
      terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
    }
  }, [terminalLogs]);
  // End: Auto-scroll terminal log

  // Start: Full System Re-Audit Function
  const runFullSystemReAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setDiagnosticsResults([]);
    setTerminalLogs([]); // Clear logs for new audit

    addLog("INFO", "Initiating full system asset integrity audit...");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay

    const imageAssets: { id: string; url: string }[] = [];

    // Extract images from portfolioSection
    if (MOCK_ACTIVE_PREVIEW_JSON.portfolioSection) {
      MOCK_ACTIVE_PREVIEW_JSON.portfolioSection.forEach((item) => {
        if (item.imageUrl) {
          imageAssets.push({ id: `portfolio-${item.id}`, url: item.imageUrl });
        }
      });
    }
    // Add other sections with images if applicable in real layout_data
    // For now, only portfolioSection is considered for image URLs as per prompt.

    if (imageAssets.length === 0) {
      addLog("WARN", "No image assets found in active blueprint to audit.");
      setAuditProgress(100);
      setIsAuditing(false);
      return;
    }

    let completedChecks = 0;

    for (const asset of imageAssets) {
      setDiagnosticsResults((prev) => [
        ...prev,
        { id: asset.id, url: asset.url, status: "VALIDATING", message: "Checking connectivity..." },
      ]);
      addLog("INFO", `[${asset.id}] Validating asset: ${asset.url}`);
      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300)); // Simulate network latency

      try {
        const response = await fetch(asset.url, { method: 'HEAD', cache: 'no-store' }); // Use HEAD request for efficiency
        if (response.ok) {
          setDiagnosticsResults((prev) =>
            prev.map((diag) =>
              diag.id === asset.id ? { ...diag, status: "PASS", message: "Asset is accessible." } : diag
            )
          );
          addLog("SUCCESS", `[${asset.id}] PASS: Asset reachable (${response.status}).`);
        } else {
          setDiagnosticsResults((prev) =>
            prev.map((diag) =>
              diag.id === asset.id
                ? {
                    ...diag,
                    status: "FAILED",
                    message: `Failed: Server responded with status ${response.status}.`,
                  }
                : diag
            )
          );
          addLog("ERROR", `[${asset.id}] FAILED: Server responded with ${response.status} for ${asset.url}`);
        }
      } catch (error: any) {
        setDiagnosticsResults((prev) =>
          prev.map((diag) =>
            diag.id === asset.id
              ? {
                  ...diag,
                  status: "WARNING",
                  message: `Error: Network or fetch failed. (${error.message || "Unknown error"})`,
                }
              : diag
          )
        );
        addLog("ERROR", `[${asset.id}] FAILED: Network error for ${asset.url} - ${error.message}`);
      }

      completedChecks++;
      setAuditProgress(Math.round((completedChecks / imageAssets.length) * 100));
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay between asset checks
    }

    addLog("INFO", "Asset integrity audit completed.");
    setIsAuditing(false);
  };
  // End: Full System Re-Audit Function

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        INITIALIZING DIAGNOSTICS HUB...
      </div>
    );
  }

  return (
    // Start: Main Container for Diagnostics Page
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Start: Top Navigation Layout (Minimal) */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">NexusDeploy</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
            Secure Node: {userProfile?.email}
          </span>
          <button
            onClick={() => {
              supabase.auth.signOut();
              router.push("/auth");
            }}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Disconnect
          </button>
        </div>
      </nav>
      {/* End: Top Navigation Layout (Minimal) */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Start: Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pre-flight Diagnostics & Asset Integrity Hub
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Audit your blueprint's external asset integrity and connectivity in real-time.
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Audit Controls */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">System Audit Control</h3>
          <p className="text-sm text-slate-400">
            Trigger a full scan of all external image assets embedded in your active storefront blueprint. This simulates a real-time pre-deployment check.
          </p>
          <button
            onClick={runFullSystemReAudit}
            disabled={isAuditing}
            className={`w-full text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
              ${isAuditing
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"}
            `}
          >
            {isAuditing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-r-transparent rounded-full"></span>
                Auditing ({auditProgress}%)
              </>
            ) : (
              "Trigger Full System Re-Audit"
            )}
          </button>
        </section>
        {/* End: Audit Controls */}

        {/* Start: Diagnostics Results Display */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Asset Diagnostics Results</h3>
          {diagnosticsResults.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No audit results yet. Trigger a scan to begin.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {diagnosticsResults.map((asset) => (
                <div key={asset.id} className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-white block truncate">
                      {asset.url}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      ID: {asset.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider
                        ${asset.status === "PASS" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800" : ""}
                        ${asset.status === "VALIDATING" ? "bg-blue-950/50 text-blue-400 border border-blue-800 animate-pulse-fast" : ""}
                        ${asset.status === "FAILED" ? "bg-red-950/50 text-red-400 border border-red-800" : ""}
                        ${asset.status === "WARNING" ? "bg-yellow-950/50 text-yellow-400 border border-yellow-800" : ""}
                      `}
                    >
                      {asset.status}
                    </span>
                    <p className="text-xs text-slate-500 max-w-[200px] truncate md:max-w-none">
                      {asset.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* End: Diagnostics Results Display */}

        {/* Start: Real-Time Terminal Log Framework */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">Real-Time Terminal Log</h3>
          <div className="h-64 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] text-slate-400 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900" ref={terminalLogRef}>
            {terminalLogs.map((log, index) => (
              <p key={index} className={`whitespace-pre-wrap ${
                log.level === "INFO" ? "text-slate-400" :
                log.level === "SUCCESS" ? "text-emerald-400" :
                log.level === "WARN" ? "text-yellow-400" :
                "text-red-400"
              }`}>
                <span className="text-slate-600 mr-2">{log.timestamp}</span>{log.message}
              </p>
            ))}
          </div>
        </section>
        {/* End: Real-Time Terminal Log Framework */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. Diagnostics simulation for demonstration purposes.</p>
        </div>
        {/* End: Informational Footer */}
      </main>
    </div>
    // End: Main Container for Diagnostics Page
  );
}
// End: Pre-flight Diagnostics & Asset Integrity Hub Page Component
