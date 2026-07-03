"use client";

// Start: Core React and Next.js Framework Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend, Component, and Localization Dependency Imports
import { supabase } from "@/lib/supabase/client";
import { deployMerchantWebsiteBlueprint, getUserActiveSitesCount, getUserDeployedSites } from "@/lib/supabase/sites";
import AiConsole from "@/components/common/AiConsole";
import DynamicRenderer from "@/components/templates/DynamicRenderer";
import ImageGenerator from "@/components/common/ImageGenerator";
import SelfHealingEngine from "@/components/common/SelfHealingEngine";
import SubdomainChecker from "@/components/common/SubdomainChecker"; // New import: SubdomainChecker
import { localizationDictionaries, LanguageCode } from "@/config/dictionaries";
import AnalyticsSimulator from "@/components/common/AnalyticsSimulator"; // New import: AnalyticsSimulator
import DeploymentHistory from "@/components/common/DeploymentHistory"; // New import: DeploymentHistory
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
    portfolioSection?: Array<{ id: string; title: string; description: string; imageUrl: string; }>; // New: Optional portfolio section
    testimonialsSection?: Array<{ id: string; clientName: string; feedback: string; clientTitle: string; }>; // New: Optional testimonials section
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
      themeAccent: "emerald", // Default for this template
      featuresSection: [ // Example features section
        {
          title: "Seamless Ordering",
          description: "Customers can place orders directly via WhatsApp with just a few taps.",
        },
        {
          title: "Fast Deployment",
          description: "Get your store online in minutes, no coding required.",
        },
                {
          title: "Mobile Optimized",
          description: "Stunning design and performance on all mobile devices.",
        },
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
      themeAccent: "blue" // Default for this template
    }
  },
  {
    id: "tpl-ai-dynamic",
    name: "Premium AI Adaptive Layout",
    category: "Dynamic SaaS",
    description: "Advanced dynamic shell layout that uses our core AI agent matrix to auto-generate personalized branding assets and targeted copywriting.",
    features: ["AI Copywriting Generator", "Unlimited Dynamic Sections", "Ad-Free Ecosystem Access"],
    isPremium: true,
    layout_data: {
      themeAccent: "purple", // Default for premium template
      portfolioSection: [ // Example portfolio items
        { id: "p1", title: "Project Nexus", description: "Revolutionizing AI-driven web development.", imageUrl: "https://images.unsplash.com/photo-1516321497487-e2887aeec204?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        { id: "p2", title: "Quantum Sync", description: "Seamless data integration for enterprises.", imageUrl: "https://images.unsplash.com/photo-1507238691740-b52b2cefe19f?q=80&w=2750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      ],
      testimonialsSection: [ // Example testimonials
        { id: "t1", clientName: "Alice Smith", feedback: "Nexus transformed our online presence!", clientTitle: "CEO, Tech Solutions" },
        { id: "t2", clientName: "Bob Johnson", feedback: "Unparalleled support and cutting-edge features.", clientTitle: "Founder, Innovate Co." },
      ],
    }
  },
];
// End: Mock Template Architecture Definitions

// Start: Component Local Type Definitions
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

// New type for deployed sites list
interface ActiveDeploymentItem {
  subdomain: string;
  created_at: string;
  seo_title: string;
}
// End: Component Local Type Definitions

// Start: Merchant Workspace Dashboard Component
export default function DashboardPage() {
  const router = useRouter();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>("All");
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  const [activePreviewJson, setActivePreviewJson] = useState<Record<string, any>>(PREBUILT_TEMPLATES[0].layout_data);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatusMessage, setDeploymentStatusMessage] = useState<string | null>(null);

  // Start: New State Variables for Site Management
  const [totalActiveSitesCount, setTotalActiveSitesCount] = useState<number | null>(null);
  const [activeDeployments, setActiveDeployments] = useState<ActiveDeploymentItem[]>([]);
  // End: New State Variables for Site Management

  // Start: New State Variables for Subdomain Checker
  const [customSubdomain, setCustomSubdomain] = useState<string>("");
  const [isSubdomainValidAndAvailable, setIsSubdomainValidAndAvailable] = useState<boolean>(false);
  // End: New State Variables for Subdomain Checker

  // Start: New State Variable for Theme Accent
  const [selectedThemeAccent, setSelectedThemeAccent] = useState<'blue' | 'purple' | 'emerald'>('blue');
  // End: New State Variable for Theme Accent

  // Start: New State Variables for Dynamic Section Matrix Block Injector (for new tabs)
  const [isFeaturesSectionEnabled, setIsFeaturesSectionEnabled] = useState<boolean>(false); // Existing
  const [isPortfolioSectionEnabled, setIsPortfolioSectionEnabled] = useState<boolean>(false); // New: Portfolio Section Toggle
  const [newPortfolioItem, setNewPortfolioItem] = useState<{ title: string; description: string; imageUrl: string; }>({ title: '', description: '', imageUrl: '' }); // New: For adding new portfolio items
  const [isTestimonialsSectionEnabled, setIsTestimonialsSectionEnabled] = useState<boolean>(false); // New: Testimonials Section Toggle
  const [newTestimonialItem, setNewTestimonialItem] = useState<{ clientName: string; feedback: string; clientTitle: string; }>({ clientName: '', feedback: '', clientTitle: '' }); // New: For adding new testimonial items
  // End: New State Variables for Dynamic Section Matrix Block Injector (for new tabs)

  useEffect(() => {
    // Start: User Session Verification and Data Fetching Lifecycle
    // Ensure initial state for dynamic sections is correctly set based on activePreviewJson
    setIsFeaturesSectionEnabled(!!activePreviewJson.featuresSection && activePreviewJson.featuresSection.length > 0);
    setIsPortfolioSectionEnabled(!!activePreviewJson.portfolioSection && activePreviewJson.portfolioSection.length > 0);
    setIsTestimonialsSectionEnabled(!!activePreviewJson.testimonialsSection && activePreviewJson.testimonialsSection.length > 0);
    const verifyUserSessionAndFetchData = async () => {
      setIsDataLoading(true); // Ensure loading state is true while fetching everything
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);

        // Fetch active sites count
        const { count: sitesCount, error: countError } = await getUserActiveSitesCount(session.user.id);
        if (countError) {
          console.error("Failed to fetch active sites count:", countError.message);
        } else {
          setTotalActiveSitesCount(sitesCount);
        }

        // Fetch deployed sites list
        const { data: deploymentsData, error: deploymentsError } = await getUserDeployedSites(session.user.id);
        if (deploymentsError) {
          console.error("Failed to fetch user deployments:", deploymentsError.message);
        } else {
          setActiveDeployments(deploymentsData || []);
        }
      }
      setIsDataLoading(false);
    };
    verifyUserSessionAndFetchData();
    // End: User Session Verification and Data Fetching Lifecycle
  }, [router]);

  const handleUserSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleDeployBlueprintAction = async (template: WebTemplate) => {
    if (template.isPremium) {
      alert("Upgrade required. This blueprint requires an active premium commercial license tier.");
      return;
    }

    // Start: Subdomain Pre-deployment Validation Check
    if (!customSubdomain || !isSubdomainValidAndAvailable) {
      setDeploymentStatusMessage("Error: Please enter a valid and available custom subdomain before deploying.");
      return;
    }
    // End: Subdomain Pre-deployment Validation Check

    setIsDeploying(true);
    setDeploymentStatusMessage(null);

    // Old: randomizedSubdomain removed, now using customSubdomain
    const { data, error } = await deployMerchantWebsiteBlueprint({
      user_id: userProfile.id,
      subdomain: customSubdomain, // Use the custom subdomain from the checker
      seo_title: template.name,
      seo_description: template.description,
      whatsapp_number: activePreviewJson.whatsappFormSection?.targetNumber || "60123456789", // Use activePreviewJson for live data
      layout_data: {
        ...activePreviewJson, // Use the live-edited activePreviewJson for all dynamic content
        themeAccent: selectedThemeAccent, // Ensure themeAccent is always the selected one
        featuresSection: isFeaturesSectionEnabled ? activePreviewJson.featuresSection : undefined, // Conditionally include/exclude
        portfolioSection: isPortfolioSectionEnabled ? activePreviewJson.portfolioSection : undefined, // Conditionally include/exclude portfolio
        testimonialsSection: isTestimonialsSectionEnabled ? activePreviewJson.testimonialsSection : undefined, // Conditionally include/exclude testimonials
      },
    });

    if (error) {
      setDeploymentStatusMessage(`Deployment Fault: ${error.message || "Zod validation rejection."}`);
    } else {
      setDeploymentStatusMessage(`Success! Active site node routed to: ${data.subdomain}.superpage.link`);
      // After successful deployment, re-fetch the counts and deployments to update UI
      if (userProfile?.id) {
        const { count: sitesCount, error: countError } = await getUserActiveSitesCount(userProfile.id);
        if (!countError) setTotalActiveSitesCount(sitesCount);

        const { data: deploymentsData, error: deploymentsError } = await getUserDeployedSites(userProfile.id);
        if (!deploymentsError) setActiveDeployments(deploymentsData || []);
      }
    }
    // Optionally clear the custom subdomain input after successful deployment
    setCustomSubdomain("");
    setIsSubdomainValidAndAvailable(false);
    setIsDeploying(false);
  };

  const filteredTemplates = PREBUILT_TEMPLATES.filter((template) => {
    if (selectedTemplateFilter === "All") return true;
    return template.category === selectedTemplateFilter;
  });

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
      
      {/* Start: Top Navigation Layout with Vercel/Linear Hover Mechanics */}
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center justify-between w-full sm:w-auto gap-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
            <span className="font-bold tracking-tight text-white">{dict.navBrand}</span>
          </div>

          {/* Start: Linear/Vercel Hover Micro-Menu Architecture */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group py-2">
              <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-default">
                Platform <span className="text-[9px] opacity-50 group-hover:rotate-180 transition-transform duration-200">▼</span>
              </button>
              
              <div className="absolute left-0 top-full pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 z-50">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl grid grid-cols-1 gap-2">
                  <div className="p-2 hover:bg-slate-950 rounded-xl transition-colors group/item">
                    <h5 className="text-xs font-bold text-white group-hover/item:text-blue-400 transition-colors">Core Visual Engine</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">High-fidelity React JSON layout semantic parser.</p>
                  </div>
                  <div className="p-2 hover:bg-slate-950 rounded-xl transition-colors group/item">
                    <h5 className="text-xs font-bold text-white group-hover/item:text-blue-400 transition-colors">AI Creative Matrix</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Flux-1 text-to-image production asset model nodes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group py-2">
              <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-default">
                Ecosystem <span className="text-[9px] opacity-50 group-hover:rotate-180 transition-transform duration-200">▼</span>
              </button>

              <div className="absolute left-0 top-full pt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100 z-50">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl grid grid-cols-1 gap-2">
                  <div className="p-2 hover:bg-slate-950 rounded-xl transition-colors group/item">
                    <h5 className="text-xs font-bold text-white group-hover/item:text-blue-400 transition-colors">Supabase Persistence</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Singapore ap-southeast cluster data storage.</p>
                  </div>
                  <div className="p-2 hover:bg-slate-950 rounded-xl transition-colors group/item">
                    <h5 className="text-xs font-bold text-white group-hover/item:text-blue-400 transition-colors">Upstash AI Guard</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sliding window rate limit anti-spam protection ledger.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketplace Add-ons Link (Desktop) */}
            <a
              href="/dashboard/marketplace"
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg"
            >
              Marketplace Add-ons
            </a>
            {/* Customer Leads Pipeline Link (Desktop) */}
            <a
              href="/dashboard/leads"
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg"
            >
              Customer Leads Pipeline
            </a>
          </div>
          {/* End: Linear/Vercel Hover Micro-Menu Architecture */}

          {/* Disconnect button for small screens (Mobile Only) */}
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
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {dict.navBrand} {dict.welcomeHeader}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            {dict.welcomeSub} <span className="font-medium text-slate-300">{userProfile?.email}</span>
          </p>
        </div>

        {deploymentStatusMessage && (
          <div className={`p-4 border text-xs rounded-xl font-medium ${
            deploymentStatusMessage.startsWith("Success")
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
              : "bg-red-950/40 border-red-800 text-red-400"
          }`}>
            {deploymentStatusMessage}
          </div>
        )}

        {/* Start: Stats Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Active Sites" value={totalActiveSitesCount !== null ? String(totalActiveSitesCount) : "N/A"} />
          <StatCard title="Cloudflare R2 Storage" value="1.2 GB / 10 GB" />
          <StatCard title="AI Tokens Used" value="45,200 tokens" />
        </section>
        {/* End: Stats Summary Cards */}

        {/* Start: Real-Time Order Streams Pipeline */}
        <section className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Real-Time Order Streams Pipeline</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
            {customerOrders.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No active orders yet. Simulate an order below!</p>
            ) : (
              <div className="divide-y divide-slate-800">
                <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider text-slate-400 px-4 py-3 border-b border-slate-800">
                  <span>Client</span>
                  <span>Product</span>
                  <span className="text-right">Time</span>
                </div>
                {customerOrders.map((order) => (
                  <div key={order.id} className="grid grid-cols-3 text-sm text-white px-4 py-3 hover:bg-slate-800/50 transition-colors">
                    <span className="truncate pr-2">{order.clientName}</span>
                    <span className="text-slate-300 truncate pr-2">{order.product.name} (RM {order.product.price.toFixed(2)})</span>
                    <span className="text-right text-slate-500 text-xs">
                      {new Date(order.timestamp).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* End: Real-Time Order Streams Pipeline */}

        {/* Start: Active Merchant Deployments List */}
        <section className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Merchant Deployments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDeployments.length > 0 ? (
              activeDeployments.map((deployment) => (
                <a
                  key={deployment.subdomain}
                  href={`https://${deployment.subdomain}.superpage.link`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {deployment.seo_title || "Untitled Site"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {deployment.subdomain}.superpage.link
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-3 border-t border-slate-950 pt-3">
                    Deployed: {new Date(deployment.created_at).toLocaleDateString()}
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                No active deployments found. Deploy a blueprint to see your sites here!
              </div>
            )}
          </div>
        </section>
        {/* End: Active Merchant Deployments List */}

        {/* Start: Workspace Tools Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Workspace Tools</h3>
          
          <div className="space-y-4 mt-4">
            <h4 className="text-sm font-semibold text-slate-300">Live Visual Blueprint Parser</h4>
            <DynamicRenderer layoutData={activePreviewJson} />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">Nexus Media Creative Suite</h4>
            <ImageGenerator currentUserEmail={userProfile?.email || ""} />
          </div>

          {/* Start: Gemini Self-Healing AI Engine Interface UI */}
          <SelfHealingEngine currentUserEmail={userProfile?.email || ""} onRepairedJsonInject={setActivePreviewJson} />
          {/* End: Gemini Self-Healing AI Engine Interface UI */}

          {/* Start: Premium Color Palette Selector */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">Theme Accent Selector</h4>
            <div className="flex gap-3">
              {['blue', 'purple', 'emerald'].map((accent) => (
                <button
                  key={accent}
                  onClick={() => {
                    setSelectedThemeAccent(accent as 'blue' | 'purple' | 'emerald');
                    setActivePreviewJson(prevJson => ({
                      ...prevJson,
                      themeAccent: accent,
                    }));
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                              ${accent === 'blue' ? 'bg-blue-600' : accent === 'purple' ? 'bg-purple-600' : 'bg-emerald-600'}
                              ${selectedThemeAccent === accent ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white' : ''}
                              `}
                >
                  {selectedThemeAccent === accent && <span className="text-white text-lg">✓</span>}
                </button>
              ))}
            </div>
          </div>
          {/* End: Premium Color Palette Selector */}

          {/* Start: Live Content & Routing Configurator */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">Live Content & Routing Configurator</h4>
            <div className="space-y-3">
              <label htmlFor="hero-headline" className="block text-xs font-semibold text-slate-300">Hero Headline</label>
              <input
                id="hero-headline"
                type="text"
                value={activePreviewJson.heroSection?.headline || ''}
                onChange={(e) => setActivePreviewJson(prev => ({
                  ...prev,
                  heroSection: {
                    ...(prev.heroSection || {}),
                    headline: e.target.value
                  }
                }))}
                placeholder="Enter your main hero headline"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="hero-subheadline" className="block text-xs font-semibold text-slate-300">Hero Subheadline</label>
              <textarea
                id="hero-subheadline"
                value={activePreviewJson.heroSection?.subheadline || ''}
                onChange={(e) => setActivePreviewJson(prev => ({
                  ...prev,
                  heroSection: {
                    ...(prev.heroSection || {}),
                    subheadline: e.target.value
                  }
                }))}
                placeholder="Enter your hero subheadline"
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="whatsapp-number" className="block text-xs font-semibold text-slate-300">WhatsApp Target Number</label>
              <input
                id="whatsapp-number"
                type="text"
                value={activePreviewJson.whatsappFormSection?.targetNumber || ''}
                onChange={(e) => setActivePreviewJson(prev => ({
                  ...prev,
                  whatsappFormSection: {
                    ...(prev.whatsappFormSection || {}),
                    targetNumber: e.target.value
                  }
                }))}
                placeholder="e.g., 60123456789 (include country code)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="whatsapp-button-text" className="block text-xs font-semibold text-slate-300">WhatsApp Button Text</label>
              <input
                id="whatsapp-button-text"
                type="text"
                value={activePreviewJson.whatsappFormSection?.buttonText || ''}
                onChange={(e) => setActivePreviewJson(prev => ({
                  ...prev,
                  whatsappFormSection: {
                    ...(prev.whatsappFormSection || {}),
                    buttonText: e.target.value
                  }
                }))}
                placeholder="e.g., Send Merchant Order via WhatsApp"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
              />
            </div>
          </div>
          {/* End: Live Content & Routing Configurator */}

          {/* Start: Dynamic Section Matrix Block Injector */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">Dynamic Section Matrix Block Injector</h4>
            
            <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-xs font-medium text-slate-300">Enable Features Section</span>
              <label htmlFor="features-toggle" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="features-toggle"
                  className="sr-only peer"
                  checked={isFeaturesSectionEnabled}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setIsFeaturesSectionEnabled(isChecked);
                    setActivePreviewJson(prev => ({
                      ...prev,
                      featuresSection: isChecked ? (prev.featuresSection || []) : undefined,
                    }));
                  }}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {isFeaturesSectionEnabled && (
              <div className="space-y-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <h5 className="text-xs font-semibold text-slate-300 mb-2">Configure Feature Cards</h5>
                {(activePreviewJson.featuresSection as Array<{ title: string; description: string; }>)?.map((feature, index) => (
                  <div key={index} className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <label htmlFor={`feature-title-${index}`} className="block text-xs font-semibold text-slate-400">Feature {index + 1} Title</label>
                    <input
                      id={`feature-title-${index}`}
                      type="text"
                      value={feature.title || ''}
                      onChange={(e) => {
                        const newFeatures = [...(activePreviewJson.featuresSection || [])];
                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                        setActivePreviewJson(prev => ({
                          ...prev,
                          featuresSection: newFeatures,
                        }));
                      }}
                      placeholder={`Enter title for feature ${index + 1}`}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                    />
                    <label htmlFor={`feature-description-${index}`} className="block text-xs font-semibold text-slate-400 mt-3">Feature {index + 1} Description</label>
                    <textarea
                      id={`feature-description-${index}`}
                      value={feature.description || ''}
                      onChange={(e) => {
                        const newFeatures = [...(activePreviewJson.featuresSection || [])];
                        newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                        setActivePreviewJson(prev => ({
                          ...prev,
                          featuresSection: newFeatures,
                        }));
                      }}
                      placeholder={`Enter description for feature ${index + 1}`}
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = (activePreviewJson.featuresSection || []).filter((_, i) => i !== index);
                        setActivePreviewJson(prev => ({
                          ...prev,
                          featuresSection: newFeatures,
                        }));
                      }}
                      className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                    >
                      Remove Feature
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setActivePreviewJson(prev => ({
                      ...prev,
                      featuresSection: [...(prev.featuresSection || []), { title: '', description: '' }],
                    }));
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors mt-4"
                >
                  Add New Feature Card
                </button>
              </div>
            )}
          </div>
          {/* End: Dynamic Section Matrix Block Injector */}

          {/* Start: Vercel-Style App Router Blueprint Navigator */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">Vercel-Style App Router Blueprint Navigator</h4>

            {/* Start: Portfolio Section Toggle & Configuration */}
            <div className="space-y-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Enable Showcase Gallery (Portfolio)</span>
                <label htmlFor="portfolio-toggle" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="portfolio-toggle"
                    className="sr-only peer"
                    checked={isPortfolioSectionEnabled}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsPortfolioSectionEnabled(isChecked);
                      setActivePreviewJson(prev => ({
                        ...prev,
                        portfolioSection: isChecked ? (prev.portfolioSection || []) : undefined,
                      }));
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {isPortfolioSectionEnabled && (
                <div className="space-y-4 mt-4">
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Configure Portfolio Items</h5>
                  {(activePreviewJson.portfolioSection as Array<{ id: string; title: string; description: string; imageUrl: string; }>)?.map((item, index) => (
                    <div key={item.id || index} className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label htmlFor={`portfolio-title-${index}`} className="block text-xs font-semibold text-slate-400">Item {index + 1} Title</label>
                      <input
                        id={`portfolio-title-${index}`}
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newPortfolio = [...(activePreviewJson.portfolioSection || [])];
                          newPortfolio[index] = { ...newPortfolio[index], title: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            portfolioSection: newPortfolio,
                          }));
                        }}
                        placeholder={`Enter title for item ${index + 1}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                      />
                      <label htmlFor={`portfolio-description-${index}`} className="block text-xs font-semibold text-slate-400 mt-3">Item {index + 1} Description</label>
                      <textarea
                        id={`portfolio-description-${index}`}
                        value={item.description || ''}
                        onChange={(e) => {
                          const newPortfolio = [...(activePreviewJson.portfolioSection || [])];
                          newPortfolio[index] = { ...newPortfolio[index], description: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            portfolioSection: newPortfolio,
                          }));
                        }}
                        placeholder={`Enter description for item ${index + 1}`}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                      />
                      <label htmlFor={`portfolio-imageUrl-${index}`} className="block text-xs font-semibold text-slate-400 mt-3">Item {index + 1} Image URL</label>
                      <input
                        id={`portfolio-imageUrl-${index}`}
                        type="text"
                        value={item.imageUrl || ''}
                        onChange={(e) => {
                          const newPortfolio = [...(activePreviewJson.portfolioSection || [])];
                          newPortfolio[index] = { ...newPortfolio[index], imageUrl: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            portfolioSection: newPortfolio,
                          }));
                        }}
                        placeholder={`Enter image URL for item ${index + 1}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                      />
                      <button
                        onClick={() => {
                          const newPortfolio = (activePreviewJson.portfolioSection || []).filter((_, i) => i !== index);
                          setActivePreviewJson(prev => ({
                            ...prev,
                            portfolioSection: newPortfolio,
                          }));
                        }}
                        className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                      >
                        Remove Item
                      </button>
                    </div>
                  ))}
                  <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2">Add New Portfolio Item</h5>
                    <label htmlFor="new-portfolio-title" className="block text-xs font-semibold text-slate-400">New Item Title</label>
                    <input
                      id="new-portfolio-title"
                      type="text"
                      value={newPortfolioItem.title}
                      onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter title for new item"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                    />
                    <label htmlFor="new-portfolio-description" className="block text-xs font-semibold text-slate-400 mt-3">New Item Description</label>
                    <textarea
                      id="new-portfolio-description"
                      value={newPortfolioItem.description}
                      onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter description for new item"
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                    />
                    <label htmlFor="new-portfolio-imageUrl" className="block text-xs font-semibold text-slate-400 mt-3">New Item Image URL</label>
                    <input
                      id="new-portfolio-imageUrl"
                      type="text"
                      value={newPortfolioItem.imageUrl}
                      onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter image URL for new item"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                    />
                    <button
                      onClick={() => {
                        if (newPortfolioItem.title || newPortfolioItem.description || newPortfolioItem.imageUrl) {
                          setActivePreviewJson(prev => ({
                            ...prev,
                            portfolioSection: [...(prev.portfolioSection || []), { ...newPortfolioItem, id: `p-${Date.now()}` }],
                          }));
                          setNewPortfolioItem({ title: '', description: '', imageUrl: '' }); // Clear form
                          setIsPortfolioSectionEnabled(true); // Ensure section is enabled if adding first item
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors mt-4"
                    >
                      Add New Portfolio Item
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* End: Portfolio Section Toggle & Configuration */}

            {/* Start: Testimonials Section Toggle & Configuration */}
            <div className="space-y-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Enable Client Wall (Testimonials)</span>
                <label htmlFor="testimonials-toggle" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="testimonials-toggle"
                    className="sr-only peer"
                    checked={isTestimonialsSectionEnabled}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsTestimonialsSectionEnabled(isChecked);
                      setActivePreviewJson(prev => ({
                        ...prev,
                        testimonialsSection: isChecked ? (prev.testimonialsSection || []) : undefined,
                      }));
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {isTestimonialsSectionEnabled && (
                <div className="space-y-4 mt-4">
                  <h5 className="text-xs font-semibold text-slate-300 mb-2">Configure Testimonials</h5>
                  {(activePreviewJson.testimonialsSection as Array<{ id: string; clientName: string; feedback: string; clientTitle: string; }>)?.map((item, index) => (
                    <div key={item.id || index} className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <label htmlFor={`testimonial-clientName-${index}`} className="block text-xs font-semibold text-slate-400">Client {index + 1} Name</label>
                      <input
                        id={`testimonial-clientName-${index}`}
                        type="text"
                        value={item.clientName || ''}
                        onChange={(e) => {
                          const newTestimonials = [...(activePreviewJson.testimonialsSection || [])];
                          newTestimonials[index] = { ...newTestimonials[index], clientName: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            testimonialsSection: newTestimonials,
                          }));
                        }}
                        placeholder={`Enter client name for testimonial ${index + 1}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                      />
                      <label htmlFor={`testimonial-clientTitle-${index}`} className="block text-xs font-semibold text-slate-400 mt-3">Client {index + 1} Title</label>
                      <input
                        id={`testimonial-clientTitle-${index}`}
                        type="text"
                        value={item.clientTitle || ''}
                        onChange={(e) => {
                          const newTestimonials = [...(activePreviewJson.testimonialsSection || [])];
                          newTestimonials[index] = { ...newTestimonials[index], clientTitle: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            testimonialsSection: newTestimonials,
                          }));
                        }}
                        placeholder={`Enter client title for testimonial ${index + 1}`}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                      />
                      <label htmlFor={`testimonial-feedback-${index}`} className="block text-xs font-semibold text-slate-400 mt-3">Client {index + 1} Feedback</label>
                      <textarea
                        id={`testimonial-feedback-${index}`}
                        value={item.feedback || ''}
                        onChange={(e) => {
                          const newTestimonials = [...(activePreviewJson.testimonialsSection || [])];
                          newTestimonials[index] = { ...newTestimonials[index], feedback: e.target.value };
                          setActivePreviewJson(prev => ({
                            ...prev,
                            testimonialsSection: newTestimonials,
                          }));
                        }}
                        placeholder={`Enter feedback for testimonial ${index + 1}`}
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                      />
                      <button
                        onClick={() => {
                          const newTestimonials = (activePreviewJson.testimonialsSection || []).filter((_, i) => i !== index);
                          setActivePreviewJson(prev => ({
                            ...prev,
                            testimonialsSection: newTestimonials,
                          }));
                        }}
                        className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors"
                      >
                        Remove Testimonial
                      </button>
                    </div>
                  ))}
                  <div className="space-y-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <h5 className="text-xs font-semibold text-slate-300 mb-2">Add New Testimonial</h5>
                    <label htmlFor="new-testimonial-clientName" className="block text-xs font-semibold text-slate-400">New Client Name</label>
                    <input
                      id="new-testimonial-clientName"
                      type="text"
                      value={newTestimonialItem.clientName}
                      onChange={(e) => setNewTestimonialItem(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Enter client name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                    />
                    <label htmlFor="new-testimonial-clientTitle" className="block text-xs font-semibold text-slate-400 mt-3">New Client Title</label>
                    <input
                      id="new-testimonial-clientTitle"
                      type="text"
                      value={newTestimonialItem.clientTitle}
                      onChange={(e) => setNewTestimonialItem(prev => ({ ...prev, clientTitle: e.target.value }))}
                      placeholder="Enter client title (e.g., CEO, Founder)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors"
                    />
                    <label htmlFor="new-testimonial-feedback" className="block text-xs font-semibold text-slate-400 mt-3">New Feedback</label>
                    <textarea
                      id="new-testimonial-feedback"
                      value={newTestimonialItem.feedback}
                      onChange={(e) => setNewTestimonialItem(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="Enter client feedback"
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                    />
                    <button
                      onClick={() => {
                        if (newTestimonialItem.clientName || newTestimonialItem.feedback) {
                          setActivePreviewJson(prev => ({
                            ...prev,
                            testimonialsSection: [...(prev.testimonialsSection || []), { ...newTestimonialItem, id: `t-${Date.now()}` }],
                          }));
                          setNewTestimonialItem({ clientName: '', feedback: '', clientTitle: '' }); // Clear form
                          setIsTestimonialsSectionEnabled(true); // Ensure section is enabled if adding first item
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-xl transition-colors mt-4"
                    >
                      Add New Testimonial
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* End: Testimonials Section Toggle & Configuration */}
          </div>
          {/* End: Vercel-Style App Router Blueprint Navigator */}

          {/* Start: Analytics Simulator */}
          <AnalyticsSimulator layoutData={activePreviewJson} />
          {/* End: Analytics Simulator */}

          {/* Start: Deployment History Log */}
          <DeploymentHistory activeDeployments={activeDeployments} />
          {/* End: Deployment History Log */}

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-300">{dict.aiConsoleTitle}</h4>
            <AiConsole currentUserEmail={userProfile?.email || ""} />
          </div>
        </div>
        {/* End: Workspace Tools Section */}

        {/* Start: Subdomain Configuration Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Subdomain Configuration</h3>
            <SubdomainChecker onSubdomainChange={(subdomain, isValidAndAvailable) => {
              setCustomSubdomain(subdomain);
              setIsSubdomainValidAndAvailable(isValidAndAvailable);
            }} />
          </div>
        </section>
        {/* End: Subdomain Configuration Section */}

        <section className="space-y-6">
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
                onClick={() => {
                  if (template.layout_data) {
                    setActivePreviewJson(template.layout_data);
                    setSelectedThemeAccent(template.layout_data.themeAccent || 'blue'); // Set theme accent from template or default
                    setIsFeaturesSectionEnabled(!!template.layout_data.featuresSection && template.layout_data.featuresSection.length > 0);
                  }
                }}
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
                      e.stopPropagation();
                      handleDeployBlueprintAction(template);
                    }}
                    className={`w-full font-semibold text-xs py-3 rounded-xl transition-all shadow-md ${
                      template.isPremium
                        ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 font-bold"
                        : "bg-slate-950 hover:bg-slate-800 border border-slate-800 text-white"
                    }`}
                    disabled={isDeploying || !isSubdomainValidAndAvailable} // Disable if deploying or subdomain is invalid/unavailable
                  >
                    {isDeploying ? "Deploying Node..." : template.isPremium ? "Unlock Ticket" : "Deploy Blueprint"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
