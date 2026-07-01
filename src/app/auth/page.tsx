"use client";

// Start: Core React and Next.js Framework Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend Client Dependency Imports
import { supabase } from "@/lib/supabase/client";
// End: External Backend Client Dependency Imports

// Start: Mock Template Architecture Definitions
interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
}

const PREBUILT_TEMPLATES: WebTemplate[] = [
  {
    id: "tpl-wa-store",
    name: "WhatsApp Express Storefront",
    category: "E-Commerce",
    description: "Highly optimized single-page store structure. Features a frictionless order form routing checkouts straight to the merchant's WhatsApp line.",
    features: ["Instant WA Checkout", "Image Auto-Compression", "Ultra-Fast Mobile Performance"],
    isPremium: false,
  },
  {
    id: "tpl-seo-local",
    name: "SEO Engine Portfolio",
    category: "Service Business",
    description: "Built for local service businesses. Structured with perfect semantic HTML and OpenGraph schema metadata to rank rapidly on Google search results.",
    features: ["Perfect SEO Structural Score", "Google Maps Matrix Ready", "High-Conversion Lead Form"],
    isPremium: false,
  },
  {
    id: "tpl-ai-dynamic",
    name: "Premium AI Adaptive Layout",
    category: "Dynamic SaaS",
    description: "Advanced dynamic shell layout that uses our core AI agent matrix to auto-generate personalized branding assets and targeted copywriting.",
    features: ["AI Copywriting Generator", "Unlimited Dynamic Sections", "Ad-Free Ecosystem Access"],
    isPremium: true,
  },
];
// End: Mock Template Architecture Definitions

// Start: Merchant Workspace Dashboard Component
export default function DashboardPage() {
  const router = useRouter();
  
  // Start: Component Local State Matrix
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("All");
  // End: Component Local State Matrix

  // Start: Secure Session Lifecycle Hook Validation
  useEffect(() => {
    const verifyUserSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        // Enforces access token guarding by ejecting unauthenticated requests
        router.push("/auth");
      } else {
        setUserProfile(session.user);
      }
      setIsDataLoading(false);
    };

    verifyUserSession();
  }, [router]);
  // End: Secure Session Lifecycle Hook Validation

  // Start: Secure Sign-Out Handler Pipeline
  const handleUserSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };
  // End: Secure Sign-Out Handler Pipeline

  // Start: Dynamic Template Filtering Calculation Logic
  const filteredTemplates = PREBUILT_TEMPLATES.filter((template) => {
    if (selectedTemplateFilter === "All") return true;
    return template.category === selectedTemplateFilter;
  });
  // End: Dynamic Template Filtering Calculation Logic

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        PARSING INTERMEDIARY WORKSPACE ACTIVE SESSION...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Start: Professional Dashboard Top Navigation Bar */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">Nexus Hub Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            Secure Node: {userProfile?.email}
          </span>
          <button
            onClick={handleUserSignOut}
            className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Disconnect Account
          </button>
        </div>
      </nav>
      {/* End: Professional Dashboard Top Navigation Bar */}

      {/* Start: Primary Workspace Inner Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Start: Welcome and Analytical Heading Header Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Welcome Back, Merchant Node</h2>
          <p className="text-sm text-slate-400">Initialize a new dynamic deployment or modify your active web properties from the console canvas below.</p>
        </div>
        {/* End: Welcome and Analytical Heading Header Section */}

        {/* Start: Section Divider - Core Site Deployments Grid */}
        <div className="mb-12">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Your Active Deployments</h3>
          <div className="border border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-900/20">
            <p className="text-sm text-slate-400 mb-4">No active web nodes discovered under this authentication instance.</p>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-colors shadow-lg shadow-blue-950/40">
              Trigger Initial Engine Build
            </button>
          </div>
        </div>
        {/* End: Section Divider - Core Site Deployments Grid */}

        {/* Start: Section Divider - Core Template Selection Panel */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Select Production Blueprint</h3>
              <p className="text-xs text-slate-400 mt-1">Deploy lightning-fast templates packed with pre-wired WhatsApp web hooks and targeted local SEO structures.</p>
            </div>
            
            {/* Start: Reactive Filter Tab Controls */}
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {["All", "E-Commerce", "Service Business", "Dynamic SaaS"].map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setSelectedTemplateFilter(tabName)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedTemplateFilter === tabName
                      ? "bg-blue-600 text-white shadow-md shadow-blue-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tabName}
                </button>
              ))}
            </div>
            {/* End: Reactive Filter Tab Controls */}
          </div>

          {/* Start: Dynamic Structural Blueprint Grid Deployment */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-950 text-blue-400 px-2.5 py-1 rounded-md border border-slate-800">
                      {template.category}
                    </span>
                    {template.isPremium && (
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-950/60 text-amber-400 px-2.5 py-1 rounded-md border border-amber-800 animate-pulse">
                        Premium Tier
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {template.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-2 mb-6">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-blue-500 font-extrabold">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button
                    className={`w-full font-semibold text-xs py-3 rounded-xl transition-all ${
                      template.isPremium
                        ? "bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950"
                        : "bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white"
                    }`}
                  >
                    {template.isPremium ? "Unlock with Premium License" : "Deploy Blueprint"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* End: Dynamic Structural Blueprint Grid Deployment */}

        </div>
        {/* End: Section Divider - Core Template Selection Panel */}

      </main>
      {/* End: Primary Workspace Inner Container */}

    </div>
  );
}
// End: Merchant Workspace Dashboard Component