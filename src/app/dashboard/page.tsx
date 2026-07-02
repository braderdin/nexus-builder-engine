"use client";

// Start: Core React and Next.js Framework Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend, Component, and Localization Dependency Imports
import { supabase } from "@/lib/supabase/client";
import { deployMerchantWebsiteBlueprint } from "@/lib/supabase/sites";
import AiConsole from "@/components/common/AiConsole";
import DynamicRenderer from "@/components/templates/DynamicRenderer";
import { localizationDictionaries, LanguageCode } from "@/config/dictionaries";
// End: External Backend and Component Dependency Imports

// Start: Mock Template Architecture Definitions
interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
  layout_data: Record<string, any>; // Integrated to seed the database parser engine
}

const PREBUILT_TEMPLATES: WebTemplate[] = [
  {
    id: "tpl-wa-store",
    name: "WhatsApp Express Storefront",
    category: "E-Commerce",
    description: "Highly optimized single-page store structure. Features a frictionless order form routing checkouts straight to the merchant's WhatsApp line.",
    features: ["Instant WA Checkout", "Image Auto-Compression", "Ultra-Fast Mobile Performance"],
    isPremium: false,
    layout_data: {
      heroSection: {
        headline: "Welcome to Our Premium WhatsApp Express Store",
        subheadline: "Browse high-converting local merchant configurations. Order directly through the encrypted WhatsApp gateway in one single tap.",
        ctaText: "Browse Collection"
      },
      whatsappFormSection: {
        promptTitle: "Direct Order Form Pipeline",
        buttonText: "Send Merchant Order via WhatsApp",
        targetNumber: "60123456789"
      }
    }
  },
  {
    id: "tpl-seo-local",
    name: "SEO Engine Portfolio",
    category: "Service Business",
    description: "Built for local service businesses. Structured with perfect semantic HTML and OpenGraph schema metadata to rank rapidly on Google search results.",
    features: ["Perfect SEO Structural Score", "Google Maps Matrix Ready", "High-Conversion Lead Form"],
    isPremium: false,
    layout_data: {
      heroSection: {
        headline: "Rank Higher with Local SEO Architectures",
        subheadline: "Engineered specifically to claim top organic rankings on search engines for home and digital services.",
        ctaText: "Book Service Now"
      },
      whatsappFormSection: {
        promptTitle: "Get a Free Consultation Invoice",
        buttonText: "Connect with Local Specialist",
        targetNumber: "60198765432"
      }
    }
  },
  {
    id: "tpl-ai-dynamic",
    name: "Premium AI Adaptive Layout",
    category: "Dynamic SaaS",
    description: "Advanced dynamic shell layout that uses our core AI agent matrix to auto-generate personalized branding assets and targeted copywriting.",
    features: ["AI Copywriting Generator", "Unlimited Dynamic Sections", "Ad-Free Ecosystem Access"],
    isPremium: true,
    layout_data: {}
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
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [activePreviewJson, setActivePreviewJson] = useState<Record<string, any>>(PREBUILT_TEMPLATES[0].layout_data);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatusMessage, setDeploymentStatusMessage] = useState<string | null>(null);
  // End: Component Local State Matrix

  // Start: Secure Session Lifecycle Hook Validation
  useEffect(() => {
    const verifyUserSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
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

  // Start: Secure Database Ingestion Pipeline Deploy Trigger
  const handleDeployBlueprintAction = async (template: WebTemplate) => {
    if (template.isPremium) {
      alert("Upgrade required. This blueprint requires an active premium commercial license tier.");
      return;
    }

    setIsDeploying(true);
    setDeploymentStatusMessage(null);

    // Dynamic mock domain generation for initial testing fasa
    const randomizedSubdomain = `merchant-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data, error } = await deployMerchantWebsiteBlueprint({
      user_id: userProfile.id,
      subdomain: randomizedSubdomain,
      seo_title: template.name,
      seo_description: template.description,
      whatsapp_number: template.layout_data.whatsappFormSection?.targetNumber || "60123456789",
      layout_data: template.layout_data,
    });

    if (error) {
      setDeploymentStatusMessage(`Deployment Fault: ${error.message || "Zod validation rejection."}`);
    } else {
      setDeploymentStatusMessage(`Success! Active site node routed to: ${data.subdomain}.superpage.link`);
    }
    setIsDeploying(false);
  };
  // End: Secure Database Ingestion Pipeline Deploy Trigger

  // Start: Dynamic Template Filtering Calculation Logic
  const filteredTemplates = PREBUILT_TEMPLATES.filter((template) => {
    if (selectedTemplateFilter === "All") return true;
    return template.category === selectedTemplateFilter;
  });
  // End: Dynamic Template Filtering Calculation Logic

  const dict = localizationDictionaries[currentLanguage];

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        PARSING INTERMEDIARY WORKSPACE ACTIVE SESSION...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      
      {/* Start: Top Navigation Layout */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
            <span className="font-bold tracking-tight text-white">{dict.navBrand}</span>
          </div>
          <button
            onClick={handleUserSignOut}
            className="sm:hidden text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded-lg"
          >
            {dict.disconnectBtn}
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t border-slate-900 pt-3 sm:border-0 sm:pt-0">
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentLanguage("en")}
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md transition-all ${
                currentLanguage === "en" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setCurrentLanguage("ms")}
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md transition-all ${
                currentLanguage === "ms" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              BM
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
              Secure Node: {userProfile?.email}
            </span>
            <button
              onClick={handleUserSignOut}
              className="hidden sm:inline-block text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {dict.disconnectBtn}
            </button>
          </div>
        </div>
      </nav>
      {/* End: Top Navigation Layout */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{dict.welcomeHeader}</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">{dict.welcomeSub}</p>
        </div>

        {/* Start: Database Execution Deployment Status Alert Container */}
        {deploymentStatusMessage && (
          <div className={`p-4 border text-xs rounded-xl font-medium ${
            deploymentStatusMessage.startsWith("Success")
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
              : "bg-red-950/40 border-red-800 text-red-400"
          }`}>
            {deploymentStatusMessage}
          </div>
        )}
        {/* End: Database Execution Deployment Status Alert Container */}

        {/* Start: Section Divider - Live Parser Visual Preview Canvas Layout */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Visual Blueprint Parser</h3>
          <DynamicRenderer layoutData={activePreviewJson} />
        </div>
        {/* End: Section Divider - Live Parser Visual Preview Canvas Layout */}

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{dict.aiConsoleTitle}</h3>
          <AiConsole currentUserEmail={userProfile?.email || ""} />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-slate-900 pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{dict.selectBlueprint}</h3>
              <p className="text-xs text-slate-400">{dict.selectBlueprintSub}</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
              {["All", "E-Commerce", "Service Business", "Dynamic SaaS"].map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setSelectedTemplateFilter(tabName)}
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    selectedTemplateFilter === tabName
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => template.layout_data && setActivePreviewJson(template.layout_data)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-blue-500 cursor-pointer transition-all group relative overflow-hidden shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-950 text-blue-400 px-2.5 py-1 rounded-md border border-slate-800">
                      {template.category}
                    </span>
                    {template.isPremium && (
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-950/60 text-amber-400 px-2.5 py-1 rounded-md border border-amber-800">
                        Premium
                      </span>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {template.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-2 mb-6 border-t border-slate-950 pt-4">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-blue-500 font-extrabold">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents layout switching trigger clash
                      handleDeployBlueprintAction(template);
                    }}
                    className={`w-full font-semibold text-xs py-3 rounded-xl transition-all shadow-md ${
                      template.isPremium
                        ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold"
                        : "bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white"
                    }`}
                    disabled={isDeploying}
                  >
                    {isDeploying ? "Deploying Node..." : template.isPremium ? "Unlock Ticket" : "Deploy Blueprint"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}