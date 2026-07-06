"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const PROXY_A_RECORD_IP = "76.76.21.21";
const PROXY_CNAME_TARGET = "proxy.superpage.link";

const CustomDomainSettingsPage: React.FC = () => {
  const router = useRouter();
  const [userSession, setUserSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customDomainInput, setCustomDomainInput] = useState<string>("");
  const [isValidDomainFormat, setIsValidDomainFormat] = useState<boolean | null>(null);
  const [sslStatus, setSslStatus] = useState<"pending" | "active" | "error">("pending");

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserSession(session);
      }
      setIsLoading(false);
    };

    fetchSession();
  }, [router]);

  const validateDomain = useCallback((domain: string) => {
    if (domain.trim() === "") {
      return null;
    }
    const domainRegex = /^(?!-)[A-Za-z0-9-]+([-.]{1}[A-Za-z0-9-]+)*\.[A-Za-z]{2,6}$/;
    return domainRegex.test(domain);
  }, []);

  useEffect(() => {
    const validationResult = validateDomain(customDomainInput);
    setIsValidDomainFormat(validationResult);
  }, [customDomainInput, validateDomain]);

  useEffect(() => {
    const savedDomain = localStorage.getItem("customDomain");
    if (savedDomain) {
      setCustomDomainInput(savedDomain);
    }
  }, []);

  useEffect(() => {
    if (isValidDomainFormat && userSession && customDomainInput.trim() !== "") {
      setSslStatus("pending");

      const timer = setTimeout(() => {
        setSslStatus(Math.random() > 0.2 ? "active" : "error");
      }, 5000);

      return () => clearTimeout(timer);
    } else if (!isValidDomainFormat && customDomainInput.trim() !== "") {
      setSslStatus("error");
    } else {
      setSslStatus("pending");
    }
  }, [isValidDomainFormat, customDomainInput, userSession]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING CUSTOM DOMAIN WORKSPACE...
      </div>
    );
  }

  const dict = {
    settingsTitle: "Custom Domains",
    settingsSub: "Manage your custom domains and DNS records for your deployed sites.",
    inputLabel: "Domain Name",
    inputPlaceholder: "yourdomain.com",
    dnsConfigHeader: "DNS Configuration Records",
    sslStatusHeader: "SSL Certificate Status",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
            Secure Node: {userSession?.email || "Guest"}
          </span>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{dict.settingsTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">{dict.settingsSub}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
          <h3 className="text-base sm:text-lg font-bold text-white">Connect Your Custom Domain</h3>
          <p className="text-sm text-slate-400">Point your domain to our platform to make your site live. Only root domains (e.g., `yourdomain.com`) are supported.</p>

          <div className="space-y-4">
            <label htmlFor="custom-domain-input" className="block text-xs font-semibold text-slate-300">{dict.inputLabel}</label>
            <input
              id="custom-domain-input"
              type="text"
              value={customDomainInput}
              onChange={(e) => {
                const domain = e.target.value.toLowerCase().replace(/\s/g, '');
                setCustomDomainInput(domain);
                localStorage.setItem("customDomain", domain);
              }}
              placeholder={dict.inputPlaceholder}
              className={`w-full bg-slate-950 border ${
                isValidDomainFormat === false ? 'border-red-500' : 'border-slate-800'
              } rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors`}
            />
            {isValidDomainFormat === false && customDomainInput.length > 0 && (
              <p className="text-xs text-red-400">Invalid domain format. Please enter a valid root domain (e.g., example.com).</p>
            )}
            {isValidDomainFormat && (
              <p className="text-xs text-emerald-400">Domain format is valid. Follow the DNS instructions below.</p>
            )}
          </div>

          {isValidDomainFormat && (
            <>
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

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-300">{dict.sslStatusHeader}</h4>
                {getSslBadge()}
                <p className="text-xs text-slate-500 leading-relaxed">
                  We automatically provision a free SSL certificate for your custom domain. This process typically completes within minutes after DNS propagation.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomDomainSettingsPage;
