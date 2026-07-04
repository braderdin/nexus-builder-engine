"use client";

// Start: Core React and Next.js Framework Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // FIXED: Corrected Next.js App Router import
import Link from "next/link";
// End: Core React and Next.js Framework Imports

// Start: External Backend, Component, and Localization Dependency Imports
import { supabase } from "@/lib/supabase/client";
import { getUserActiveSitesCount, getUserDeployedSites } from "@/lib/supabase/sites";
import { updateMerchantSiteConfiguration } from "@/app/dashboard/actions";
import AiConsole from "@/components/common/AiConsole";
import DynamicRenderer, { CustomerOrder } from "@/components/templates/DynamicRenderer";
import ImageGenerator from "@/components/common/ImageGenerator";
import SelfHealingEngine from "@/components/common/SelfHealingEngine";
import SubdomainChecker from "@/components/common/SubdomainChecker";
import ContentConfigurator from "@/components/common/ContentConfigurator";
import BlueprintNavigator from "@/components/common/BlueprintNavigator";
import TemplateGrid from "@/components/common/TemplateGrid";
import { localizationDictionaries, LanguageCode } from "@/config/dictionaries";
import AnalyticsSimulator from "@/components/common/AnalyticsSimulator";
import DeploymentHistory from "@/components/common/DeploymentHistory";
import CommandHub from "@/components/common/CommandHub";
import ComponentLibrary from "@/components/common/ComponentLibrary";
import ThemePaletteSwapper from "@/components/common/ThemePaletteSwapper";
import ContextualTourGuide from "@/components/common/ContextualTourGuide";
// End: External Backend and Component Dependency Imports

interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
  layout_data: Record<string, any> & {
    themeAccent?: 'blue' | 'purple' | 'emerald' | 'vercel-midnight' | 'linear-purple' | 'supabase-emerald';
    featuresSection?: Array<{ title: string; description: string; }>;
    portfolioSection?: Array<{ id: string; title: string; description: string; imageUrl: string; }>;
    testimonialsSection?: Array<{ id: string; clientName: string; feedback: string; clientTitle: string; }>;
  };
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
      },
      themeAccent: "emerald",
      featuresSection: [
        { title: "Seamless Ordering", description: "Customers can place orders directly via WhatsApp with just a few taps." },
        { title: "Fast Deployment", description: "Get your store online in minutes, no coding required." }
      ],
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
      },
      themeAccent: "blue"
    }
  }
];

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
    <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
    <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("All");
  const [currentLanguage] = useState<LanguageCode>("en");
  const initialTemplate = PREBUILT_TEMPLATES[0];
  const [activePreviewJson, setActivePreviewJson] = useState<Record<string, any>>(initialTemplate.layout_data);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [totalActiveSitesCount, setTotalActiveSitesCount] = useState<number | null>(null);
  const [activeDeployments, setActiveDeployments] = useState<any[]>([]);
  const [customSubdomain, setCustomSubdomain] = useState<string>("");
  const [isSubdomainValidAndAvailable, setIsSubdomainValidAndAvailable] = useState<boolean>(false);
  const [currentThemeAccent, setCurrentThemeAccent] = useState<any>(initialTemplate.layout_data.themeAccent || 'blue');
  const [, setIsPortfolioSectionEnabled] = useState<boolean>(!!initialTemplate.layout_data.portfolioSection && initialTemplate.layout_data.portfolioSection.length > 0);
  const [, setIsTestimonialsSectionEnabled] = useState<boolean>(!!initialTemplate.layout_data.testimonialsSection && initialTemplate.layout_data.testimonialsSection.length > 0);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(initialTemplate.id);
  const [tourStep, setTourStep] = useState<number>(0);
  const [isTourActive, setIsTourActive] = useState<boolean>(true);
  const [showDeploymentSuccessModal, setShowDeploymentSuccessModal] = useState<boolean>(false);
  const [deployedSiteUrl, setDeployedSiteUrl] = useState<string | null>(null);

  useEffect(() => {
    const verifyUserSessionAndFetchData = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
        const { count: sitesCount } = await getUserActiveSitesCount(session.user.id);
        setTotalActiveSitesCount(sitesCount);
        const { data: deploymentsData } = await getUserDeployedSites(session.user.id);
        setActiveDeployments(deploymentsData || []);
      }
      setIsDataLoading(false);
    };
    verifyUserSessionAndFetchData();
  }, [router]);

  const handleTemplateSelect = (template: WebTemplate) => {
    setActiveTemplateId(template.id);
    setActivePreviewJson(template.layout_data);
    setCurrentThemeAccent(template.layout_data.themeAccent || "blue");
    setIsPortfolioSectionEnabled(!!template.layout_data.portfolioSection && template.layout_data.portfolioSection.length > 0);
    setIsTestimonialsSectionEnabled(!!template.layout_data.testimonialsSection && template.layout_data.testimonialsSection.length > 0);
    if (isTourActive && tourStep === 0) setTourStep(1);
  };

  const handleThemeAccentChange = (accent: any) => {
    setCurrentThemeAccent(accent);
    setActivePreviewJson((prev) => ({ ...prev, themeAccent: accent }));
  };

  // Start: Dynamic Input Fields Synchronizer Functions
  const handleUpdateHeroHeadline = (headline: string) => {
    setActivePreviewJson((prev) => ({ ...prev, heroSection: { ...(prev.heroSection || {}), headline } }));
    if (isTourActive && tourStep === 1) setTourStep(2);
  };

  const handleUpdateHeroSubheadline = (subheadline: string) => {
    setActivePreviewJson((prev) => ({ ...prev, heroSection: { ...(prev.heroSection || {}), subheadline } }));
  };

  const handleUpdateWhatsappTargetNumber = (targetNumber: string) => {
    setActivePreviewJson((prev) => ({ ...prev, whatsappFormSection: { ...(prev.whatsappFormSection || {}), targetNumber } }));
  };

  const handleUpdateWhatsappButtonText = (buttonText: string) => {
    setActivePreviewJson((prev) => ({ ...prev, whatsappFormSection: { ...(prev.whatsappFormSection || {}), buttonText } }));
  };
  // End: Dynamic Input Fields Synchronizer Functions

  const handleDeployBlueprintAction = async (template: WebTemplate) => {
    if (!customSubdomain || !isSubdomainValidAndAvailable) return;
    setIsDeploying(true);
    const { data, error } = await updateMerchantSiteConfiguration({
      userId: userProfile.id,
      subdomain: customSubdomain,
      seoTitle: template.name,
      seoDescription: template.description,
      whatsappNumber: activePreviewJson.whatsappFormSection?.targetNumber || "60123456789",
      layoutData: activePreviewJson,
    });
    if (!error && data) {
      setDeployedSiteUrl(`https://${data.subdomain}.superpage.link`);
      setShowDeploymentSuccessModal(true);
      setCustomSubdomain("");
      setIsSubdomainValidAndAvailable(false);
      const { data: updated } = await getUserDeployedSites(userProfile.id);
      setActiveDeployments(updated || []);
    }
    setIsDeploying(false);
  };

  if (isDataLoading) return <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs">PARSING INTERMEDIARY WORKSPACE ACTIVE SESSION...</div>;
  const dict = localizationDictionaries[currentLanguage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
          <span className="font-bold tracking-tight text-white">{dict.navBrand}</span>
        </div>
        <button onClick={() => supabase.auth.signOut().then(() => router.push("/auth"))} className="text-xs bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-slate-300">Disconnect</button>
      </nav>

      {/* Start: Production Cluster Sub-Navigation Grid Links */}
      <div className="bg-slate-900/40 border-b border-slate-900 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="text-blue-400 hover:text-white transition-colors">🎯 Core Engine Workspace</Link>
          <Link href="/dashboard/copywriting" className="hover:text-white transition-colors">✍️ AI Copywriting Suite</Link>
          <Link href="/dashboard/studios" className="hover:text-white transition-colors">🎨 Visual Canvas Customizer</Link>
          <Link href="/dashboard/leads" className="hover:text-white transition-colors">📊 CRM Leads Board</Link>
          <Link href="/dashboard/diagnostics" className="hover:text-white transition-colors">🔍 Pre-flight Integrity Audit</Link>
          <Link href="/dashboard/marketplace" className="hover:text-white transition-colors">🛍️ Extensions Marketplace</Link>
          <Link href="/dashboard/settings" className="hover:text-white transition-colors">🌐 CNAME DNS Mapper</Link>
          <Link href="/dashboard/analytics" className="hover:text-white transition-colors">📈 Live Telemetry Hub</Link>
          <Link href="/dashboard/billing" className="hover:text-white transition-colors">💳 Stripe Invoice Ledger</Link>
        </div>
      </div>
      {/* End: Production Cluster Sub-Navigation Grid Links */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Active Sites" value={totalActiveSitesCount !== null ? String(totalActiveSitesCount) : "0"} />
          <StatCard title="Cloudflare R2 Storage" value="1.2 GB / 10 GB" />
          <StatCard title="AI Requests Used Today" value="0 / 5" />
        </section>

        {/* Start: Integrated Live Core AI Console Deck Module */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300">Centralized Core AI Orchestrator Node</h4>
          <AiConsole currentUserEmail={userProfile?.email || "anonymous-merchant"} />
        </section>
        {/* End: Integrated Live Core AI Console Deck Module */}

        <CommandHub userProfile={userProfile} aiRequestsUsedToday={0} activeDeployments={activeDeployments} customSubdomain={customSubdomain} isSubdomainValidAndAvailable={isSubdomainValidAndAvailable} activePreviewJson={activePreviewJson} currentStorageUsedBytes={12582912} />
        <ThemePaletteSwapper currentThemeAccent={currentThemeAccent} onThemeAccentChange={handleThemeAccentChange} />
        
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300">Live Visual Blueprint Parser</h4>
          <DynamicRenderer layoutData={activePreviewJson} onNewOrder={(order) => setCustomerOrders((prev) => [order, ...prev])} />
        </section>

        <ComponentLibrary activePreviewJson={activePreviewJson} setActivePreviewJson={setActivePreviewJson} />
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Start: Surgical Prop Ingestion Bug Fix Applied Safely */}
          <ContentConfigurator activePreviewJson={activePreviewJson} onUpdateHeroHeadline={handleUpdateHeroHeadline} onUpdateHeroSubheadline={handleUpdateHeroSubheadline} onUpdateWhatsappTargetNumber={handleUpdateWhatsappTargetNumber} onUpdateWhatsappButtonText={handleUpdateWhatsappButtonText} />
          {/* End: Surgical Prop Ingestion Bug Fix Applied Safely */}
          <BlueprintNavigator activePreviewJson={activePreviewJson} isPortfolioSectionEnabled={false} onTogglePortfolioSection={() => {}} onAddPortfolioItem={() => {}} onRemovePortfolioItem={() => {}} onUpdatePortfolioItemTitle={() => {}} isTestimonialsSectionEnabled={false} onToggleTestimonialsSection={() => {}} onAddTestimonialItem={() => {}} onRemoveTestimonialItem={() => {}} onUpdateTestimonialItemClientName={() => {}} />
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <SubdomainChecker onSubdomainChange={(sub, valid) => { setCustomSubdomain(sub); setIsSubdomainValidAndAvailable(valid); }} />
        </section>

        <TemplateGrid templates={PREBUILT_TEMPLATES} selectedTemplateFilter={selectedTemplateFilter} setSelectedTemplateFilter={setSelectedTemplateFilter} activeTemplateId={activeTemplateId} onTemplateSelect={handleTemplateSelect} handleDeployBlueprintAction={handleDeployBlueprintAction} isDeploying={isDeploying} isSubdomainValidAndAvailable={isSubdomainValidAndAvailable} />
        
        {/* Start: Embedded Experimental Live Self-Healing Core Node */}
        <section className="space-y-4">
          <SelfHealingEngine currentUserEmail={userProfile?.email || ""} onRepairedJsonInject={(repairedJson) => setActivePreviewJson(repairedJson)} />
        </section>
        {/* End: Embedded Experimental Live Self-Healing Core Node */}

        {/* Start: Dynamic AI Text-to-Image Flux Asset Studio Panel */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300">Creative Media Creative Asset Generator Node</h4>
          <ImageGenerator currentUserEmail={userProfile?.email || ""} />
        </section>
        {/* End: Dynamic AI Text-to-Image Flux Asset Studio Panel */}

        <AnalyticsSimulator layoutData={activePreviewJson} />
        <DeploymentHistory activeDeployments={activeDeployments} />
      </main>

      {showDeploymentSuccessModal && deployedSiteUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center space-y-6">
            <h3 className="text-xl font-bold text-white">Deployment Successful!</h3>
            <a href={deployedSiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm">Visit Site</a>
            <button onClick={() => setShowDeploymentSuccessModal(false)} className="w-full text-slate-400 text-xs">Close</button>
          </div>
        </div>
      )}
      {isTourActive && tourStep < 4 && (
        <ContextualTourGuide tourStep={tourStep} onAdvanceStep={() => setTourStep((p) => p + 1)} onSkipTour={() => setIsTourActive(false)} />
      )}
    </div>
  );
}
