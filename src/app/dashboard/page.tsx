"use client";

// Start: Core React and Next.js Framework Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend, Component, and Localization Dependency Imports
import { supabase } from "@/lib/supabase/client";
import { deployMerchantWebsiteBlueprint, getUserActiveSitesCount, getUserDeployedSites } from "@/lib/supabase/sites";
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
// End: External Backend and Component Dependency Imports

// Start: Mock Template Architecture Definitions
interface WebTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  isPremium: boolean;
  layout_data: Record<string, any> & {
    themeAccent?: 'blue' | 'purple' | 'emerald';
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

interface ActiveDeploymentItem {
  subdomain: string;
  created_at: string;
  seo_title: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("All");
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  // Initialize with the first template's data for the preview and other related states
  const initialTemplate = PREBUILT_TEMPLATES[0];
  const [activePreviewJson, setActivePreviewJson] = useState<Record<string, any>>(initialTemplate.layout_data);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatusMessage, setDeploymentStatusMessage] = useState<string | null>(null);

  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [totalActiveSitesCount, setTotalActiveSitesCount] = useState<number | null>(null);
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeploymentItem[]>([]);
  const [customSubdomain, setCustomSubdomain] = useState<string>("");
  const [isSubdomainValidAndAvailable, setIsSubdomainValidAndAvailable] = useState<boolean>(false);
  const [selectedThemeAccent, setSelectedThemeAccent] = useState<'blue' | 'purple' | 'emerald'>(initialTemplate.layout_data.themeAccent || 'blue');

  // Blueprint Navigator and TemplateGrid controlled states
  const [isFeaturesSectionEnabled, setIsFeaturesSectionEnabled] = useState<boolean>(!!initialTemplate.layout_data.featuresSection && initialTemplate.layout_data.featuresSection.length > 0);
  const [isPortfolioSectionEnabled, setIsPortfolioSectionEnabled] = useState<boolean>(!!initialTemplate.layout_data.portfolioSection && initialTemplate.layout_data.portfolioSection.length > 0);
  const [isTestimonialsSectionEnabled, setIsTestimonialsSectionEnabled] = useState<boolean>(!!initialTemplate.layout_data.testimonialsSection && initialTemplate.layout_data.testimonialsSection.length > 0);
  const [activeTemplateId, setActiveTemplateId] = useState<string>(initialTemplate.id); // For active ring visual

  const [aiRequestsUsedToday, setAiRequestsUsedToday] = useState<number>(0); // Initialize for daily AI quota

  // Deployment Success Modal states
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

  // Handler for template selection from TemplateGrid
  const handleTemplateSelect = (template: WebTemplate) => {
    setActiveTemplateId(template.id);
    setActivePreviewJson(template.layout_data);
    setSelectedThemeAccent(template.layout_data.themeAccent || "blue");
    setIsFeaturesSectionEnabled(!!template.layout_data.featuresSection && template.layout_data.featuresSection.length > 0);
    setIsPortfolioSectionEnabled(!!template.layout_data.portfolioSection && template.layout_data.portfolioSection.length > 0);
    setIsTestimonialsSectionEnabled(!!template.layout_data.testimonialsSection && template.layout_data.testimonialsSection.length > 0);
  };

  const handleUserSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleDeployBlueprintAction = async (template: WebTemplate) => {
    if (template.isPremium) return;
    if (!customSubdomain || !isSubdomainValidAndAvailable) {
      setDeploymentStatusMessage("Error: Please enter a valid custom subdomain before deploying.");
      return;
    }
    setIsDeploying(true);
    const { data, error } = await deployMerchantWebsiteBlueprint({
      user_id: userProfile.id,
      subdomain: customSubdomain,
      seo_title: template.name,
      seo_description: template.description,
      whatsapp_number: activePreviewJson.whatsappFormSection?.targetNumber || "60123456789",
      layout_data: {
        ...activePreviewJson,
        themeAccent: selectedThemeAccent,
        featuresSection: isFeaturesSectionEnabled ? activePreviewJson.featuresSection : undefined,
        portfolioSection: isPortfolioSectionEnabled ? activePreviewJson.portfolioSection : undefined,
        testimonialsSection: isTestimonialsSectionEnabled ? activePreviewJson.testimonialsSection : undefined,
      },
    });

    if (!error && data) {
      setDeploymentStatusMessage(null); // Clear any previous error messages
      setDeployedSiteUrl(`https://${data.subdomain}.superpage.link`);
      setShowDeploymentSuccessModal(true);
      setCustomSubdomain(""); // Reset subdomain input field
      setIsSubdomainValidAndAvailable(false); // Reset subdomain validation
    } else if (error) {
      setDeploymentStatusMessage(`Deployment Error: ${error.message}`);
    }
    setIsDeploying(false);
  };

  // Inline component for the deployment success modal
  const DeploymentSuccessModal = ({ siteUrl, onClose }: { siteUrl: string; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center space-y-6">
          <div className="text-emerald-400 text-5xl">✓</div>
          <h3 className="text-xl font-bold text-white">Deployment Successful!</h3>
          <p className="text-slate-300 text-sm">Your new merchant site node is now live.</p>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Visit Your New Site
          </a>
          <button
            onClick={onClose}
            className="w-full text-slate-400 hover:text-white text-xs font-medium py-2 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

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
      {/* Start: Top Navigation Shell */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">N</div>
            <span className="font-bold tracking-tight text-white">{dict.navBrand}</span>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <a href="/dashboard/marketplace" className="text-xs text-slate-400 hover:text-white transition-colors">Marketplace Add-ons</a>
            <a href="/dashboard/leads" className="text-xs text-slate-400 hover:text-white transition-colors">Leads Pipeline</a>
            <a href="/dashboard/copywriting" className="text-xs text-slate-400 hover:text-white transition-colors">AI Copywriting</a>
            <a href="/dashboard/billing" className="text-xs text-slate-400 hover:text-white transition-colors">Billing Hub</a>
            <a href="/dashboard/diagnostics" className="text-xs text-slate-400 hover:text-white transition-colors">Diagnostics</a>
          </div>
        </div>
        <button onClick={handleUserSignOut} className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors">
          {dict.disconnectBtn}
        </button>
      </nav>
      {/* End: Top Navigation Shell */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Active Sites" value={totalActiveSitesCount !== null ? String(totalActiveSitesCount) : "0"} />
          <StatCard title="Cloudflare R2 Storage" value="1.2 GB / 10 GB" />
          <StatCard title="AI Requests Used Today" value={`${aiRequestsUsedToday} / 5`} />
        </section>

        {/* Start: Real-Time Order Stream Panel */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Real-Time Order Streams Pipeline</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
            {customerOrders.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No active orders yet. Simulate an order in the preview canvas below!</p>
            ) : (
              <div className="divide-y divide-slate-800 text-left text-xs">
                {customerOrders.map((order) => (
                  <div key={order.id} className="py-2.5 flex justify-between">
                    <span className="text-white font-medium">{order.clientName}</span>
                    <span className="text-slate-400">{order.product.name}</span>
                    <span className="text-slate-500 font-mono">{new Date(order.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* End: Real-Time Order Stream Panel */}

        {/* Start: Live Visual Preview Canvas */}
        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-300">Live Visual Blueprint Parser</h4>
          <DynamicRenderer 
            layoutData={activePreviewJson} 
            onNewOrder={(newOrder) => setCustomerOrders((prev) => [newOrder, ...prev])}
          />
        </section>

        {/* Start: Split Sub-Components Configurations UI */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContentConfigurator activePreviewJson={activePreviewJson} setActivePreviewJson={setActivePreviewJson} />
          <BlueprintNavigator 
            activePreviewJson={activePreviewJson} 
            setActivePreviewJson={setActivePreviewJson}
            isPortfolioSectionEnabled={isPortfolioSectionEnabled}
            setIsPortfolioSectionEnabled={setIsPortfolioSectionEnabled}
            isTestimonialsSectionEnabled={isTestimonialsSectionEnabled}
            setIsTestimonialsSectionEnabled={setIsTestimonialsSectionEnabled}
          />
        </section>

        {/* Derived state for AI quota enforcement based on 5 requests/day */}
        {/* In a production environment, `aiRequestsUsedToday` would be fetched from a secure backend API. */}
        const isAiQuotaExhausted = aiRequestsUsedToday >= 5;

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative">
            {isAiQuotaExhausted && (
                <div className="absolute inset-0 flex items-center justify-center bg-yellow-900/70 backdrop-blur-sm z-10 rounded-2xl p-4 text-center">
                    <p className="text-sm font-semibold text-yellow-300">Daily AI Quota Exhausted. Resets in 24 hours.</p>
                </div>
            )}
            <ImageGenerator currentUserEmail={userProfile?.email || ""} />
          </div>
          <div className="relative">
            {isAiQuotaExhausted && (
                <div className="absolute inset-0 flex items-center justify-center bg-yellow-900/70 backdrop-blur-sm z-10 rounded-2xl p-4 text-center">
                    <p className="text-sm font-semibold text-yellow-300">Daily AI Quota Exhausted. Resets in 24 hours.</p>
                </div>
            )}
            <SelfHealingEngine currentUserEmail={userProfile?.email || ""} onRepairedJsonInject={setActivePreviewJson} />
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <SubdomainChecker onSubdomainChange={(sub, valid) => { setCustomSubdomain(sub); setIsSubdomainValidAndAvailable(valid); }} />
        </section>

        <TemplateGrid
          templates={PREBUILT_TEMPLATES}
          selectedTemplateFilter={selectedTemplateFilter}
          setSelectedTemplateFilter={setSelectedTemplateFilter}
          activeTemplateId={activeTemplateId} // Pass active template ID for visual indication
          onTemplateSelect={handleTemplateSelect} // Consolidated handler for template selection
          handleDeployBlueprintAction={handleDeployBlueprintAction}
          isDeploying={isDeploying}
          isSubdomainValidAndAvailable={isSubdomainValidAndAvailable}
        />

        <AnalyticsSimulator layoutData={activePreviewJson} />
        <DeploymentHistory activeDeployments={activeDeployments} />
      </main>

      {/* Deployment Success Overlay Module */}
      {showDeploymentSuccessModal && deployedSiteUrl && (
        <DeploymentSuccessModal siteUrl={deployedSiteUrl} onClose={() => setShowDeploymentSuccessModal(false)} />
      )}
    </div>
  );
}
