"use client";

// Start: Core Framework and Sub-Component Ingestion Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { getUserDeployedSites } from "@/lib/supabase/sites";
import { updateMerchantSiteConfiguration } from "@/app/dashboard/actions";
import DynamicRenderer from "@/components/templates/DynamicRenderer";
import SubdomainChecker from "@/components/common/SubdomainChecker";
import AnalyticsSimulator from "@/components/common/AnalyticsSimulator";
import DeploymentHistory from "@/components/common/DeploymentHistory";
import CommandHub from "@/components/common/CommandHub";
// End: Core Framework and Sub-Component Ingestion Imports

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [customSubdomain, setCustomSubdomain] = useState<string>("");
  const [isSubdomainValidAndAvailable, setIsSubdomainValidAndAvailable] = useState<boolean>(false);
  const [activeDeployments, setActiveDeployments] = useState<any[]>([]);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Default clean blueprint state for rendering canvas viewports
  const [activePreviewJson] = useState<any>({
    heroSection: {
      headline: "Welcome to Our Premium WhatsApp Express Store",
      subheadline: "Browse high-converting local merchant configurations dynamically.",
      ctaText: "Browse Collection"
    },
    whatsappFormSection: {
      promptTitle: "Direct Order Form Pipeline",
      buttonText: "Send Merchant Order via WhatsApp",
      targetNumber: "60123456789"
    },
    themeAccent: "emerald"
  });

  // Start: Authentication Security and Data Ledger Hydration Hook
  useEffect(() => {
    const verifySessionNode = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
        const { data: deploymentsData } = await getUserDeployedSites(session.user.id);
        setActiveDeployments(deploymentsData || []);
      }
      setIsDataLoading(false);
    };
    verifySessionNode();
  }, [router]);
  // End: Authentication Security and Data Ledger Hydration Hook

  const handleDeployBlueprintAction = async () => {
    if (!customSubdomain || !isSubdomainValidAndAvailable || !userProfile) return;
    setIsDeploying(true);
    const { data, error } = await updateMerchantSiteConfiguration({
      userId: userProfile.id,
      subdomain: customSubdomain,
      seoTitle: "Hobby Store Deployment",
      seoDescription: "Launched instantly via platform engine core.",
      whatsappNumber: activePreviewJson.whatsappFormSection?.targetNumber || "60123456789",
      layoutData: activePreviewJson,
    });
    if (!error && data) {
      alert(`Deployment Success! Mapped to: ${customSubdomain}.superpage.link`);
      setCustomSubdomain("");
      setIsSubdomainValidAndAvailable(false);
      const { data: updated } = await getUserDeployedSites(userProfile.id);
      setActiveDeployments(updated || []);
    }
    setIsDeploying(false);
  };

  if (isDataLoading) return <div className="p-8 font-mono text-xs text-slate-500">PARSING CLUSTER AUTHENTICATION SESSION...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Top Main Navigation Bar */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Hub Console</span>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/auth"))} className="text-xs bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">Sign Out</button>
      </nav>

      {/* Start: SaaS Links Linkages Matrix Framework for Human Explorers */}
      <div className="bg-slate-900/40 border-b border-slate-900 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 text-xs font-mono text-slate-400">
          <Link href="/dashboard" className="text-blue-400 font-bold border-b border-blue-500">🎯 Workspace</Link>
          <Link href="/dashboard/copywriting" className="hover:text-white transition-colors">✍️ Copywriting</Link>
          <Link href="/dashboard/studios" className="hover:text-white transition-colors">🎨 Visual Canvas</Link>
          <Link href="/dashboard/leads" className="hover:text-white transition-colors">📊 CRM Leads</Link>
          <Link href="/dashboard/diagnostics" className="hover:text-white transition-colors">🔍 Asset Audit</Link>
          <Link href="/dashboard/marketplace" className="hover:text-white transition-colors">🛍️ Extensions Hub</Link>
          <Link href="/dashboard/settings" className="hover:text-white transition-colors">🌐 DNS Custom</Link>
          <Link href="/dashboard/analytics" className="hover:text-white transition-colors">📈 Live Telemetry</Link>
          <Link href="/dashboard/billing" className="hover:text-white transition-colors">💳 Stripe Invoices</Link>
          <Link href="/dashboard/tutorial" className="hover:text-white transition-colors">📖 Docs Tutorial</Link>
        </div>
      </div>
      {/* End: SaaS Links Linkages Matrix Framework for Human Explorers */}

      {/* Main Core Layout Body Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <CommandHub userProfile={userProfile} aiRequestsUsedToday={0} activeDeployments={activeDeployments} customSubdomain={customSubdomain} isSubdomainValidAndAvailable={isSubdomainValidAndAvailable} activePreviewJson={activePreviewJson} currentStorageUsedBytes={12582912} />

        <section className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview Canvas</h4>
          <div className="p-1 bg-slate-900 border border-slate-800 rounded-2xl">
            <DynamicRenderer layoutData={activePreviewJson} onNewOrder={() => {}} />
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <SubdomainChecker onSubdomainChange={(sub, valid) => { setCustomSubdomain(sub); setIsSubdomainValidAndAvailable(valid); }} />
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Launch Blueprint Architecture</h3>
          <button
            onClick={handleDeployBlueprintAction}
            disabled={isDeploying || !isSubdomainValidAndAvailable}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg"
          >
            {isDeploying ? "Launching Core Node..." : "Deploy Active Blueprint"}
          </button>
        </section>

        <AnalyticsSimulator layoutData={activePreviewJson} />
        <DeploymentHistory activeDeployments={activeDeployments} />
      </main>
    </div>
  );
}