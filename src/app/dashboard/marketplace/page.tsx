"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client"; // Assuming supabase client is needed for auth check

// Start: Component Local Type Definitions
interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Tailwind class or simple emoji/char
  isPremium: boolean;
  installationCount: number;
  isInstalled: boolean;
}

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onToggle: (id: string) => void;
}
// End: Component Local Type Definitions

// Start: Marketplace Item Card Component
const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({ item, onToggle }) => {
  const toggleClasses = item.isInstalled
    ? "bg-blue-600 peer-checked:bg-blue-600 after:translate-x-full after:border-white"
    : "bg-slate-700 peer-checked:bg-blue-600 after:bg-white after:border-slate-300";

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between group overflow-hidden">
      {/* Start: Subtle Glow Hover Effect */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-blue-900/20 via-transparent to-blue-900/10 rounded-xl blur-lg"></div>
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-600 transition-colors duration-300 z-10"></div>
      {/* End: Subtle Glow Hover Effect */}

      {/* Start: Item Header */}
      <div className="flex items-start gap-4 mb-4 relative z-20">
        <div className="text-3xl text-blue-400">{item.icon}</div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{item.description}</p>
        </div>
      </div>
      {/* End: Item Header */}

      {/* Start: Item Footer - Telemetry and Toggle */}
      <div className="relative z-20 pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex flex-col text-xs">
          <span className="text-slate-500">
            {item.installationCount.toLocaleString()} Active Installs
          </span>
          <span className="text-slate-500 mt-0.5">
            Status:{" "}
            <span className={item.isInstalled ? "text-emerald-400 font-medium" : "text-slate-400"}>
              {item.isInstalled ? "Active" : "Inactive"}
            </span>
          </span>
        </div>

        <label htmlFor={`toggle-${item.id}`} className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={`toggle-${item.id}`}
            className="sr-only peer"
            checked={item.isInstalled}
            onChange={() => onToggle(item.id)}
            disabled={item.isPremium && !item.isInstalled} // Disable toggling off premium if not installed
          />
          <div
            className={`relative w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:transition-all ${toggleClasses}`}
          ></div>
        </label>
      </div>
      {/* End: Item Footer - Telemetry and Toggle */}
    </div>
  );
};
// End: Marketplace Item Card Component

// Start: Premium Extensions & Component Marketplace Hub Page Component
export default function MarketplacePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  // Start: Marketplace Items State
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([
    {
      id: "ai-live-chat",
      name: "AI Live Chat Node",
      description: "Integrate a real-time AI-powered live chat assistant for instant customer support.",
      icon: "🤖",
      isPremium: true,
      installationCount: 1234,
      isInstalled: false,
    },
    {
      id: "seo-optimization",
      name: "Advanced Dynamic SEO Optimization Shield",
      description: "Automate SEO best practices, meta tags, and schema generation for higher rankings.",
      icon: "⚡",
      isPremium: false,
      installationCount: 5678,
      isInstalled: true, // Example: one item is active by default
    },
    {
      id: "stripe-checkout",
      name: "Stripe Checkout Pipeline Pro",
      description: "Secure, high-converting Stripe checkout integration with one-click payment flows.",
      icon: "💳",
      isPremium: true,
      installationCount: 910,
      isInstalled: false,
    },
  ]);
  // End: Marketplace Items State

  // Start: User Session and Telemetry Simulation Effect
  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
      }
      setIsDataLoading(false);
    };

    verifyUserSession();

    // Start: Simulate Live Telemetry Data Updates
    const interval = setInterval(() => {
      setMarketplaceItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          installationCount: item.installationCount + Math.floor(Math.random() * 5) - 2, // Simulate minor fluctuations
        }))
      );
    }, 5000); // Update every 5 seconds
    // End: Simulate Live Telemetry Data Updates

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [router]);
  // End: User Session and Telemetry Simulation Effect

  // Start: Handle Item Toggle Activation/Deactivation
  const handleToggleInstallation = (id: string) => {
    setMarketplaceItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (item.isPremium && !item.isInstalled) {
            alert(`Upgrade required: Please subscribe to a premium plan to install "${item.name}".`);
            return item; // Do not toggle if premium and not installed
          }
          return { ...item, isInstalled: !item.isInstalled };
        }
        return item;
      })
    );
  };
  // End: Handle Item Toggle Activation/Deactivation

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING MARKETPLACE ASSETS...
      </div>
    );
  }

  return (
    // Start: Main Container for Marketplace Page
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
            Premium Extensions & Component Marketplace Hub
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Discover powerful add-ons to elevate your site blueprint. Toggle to activate enterprise-grade features and AI modules.
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Marketplace Items Grid Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketplaceItems.map((item) => (
            <MarketplaceItemCard key={item.id} item={item} onToggle={handleToggleInstallation} />
          ))}
        </section>
        {/* End: Marketplace Items Grid Matrix */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. Components and extensions are subject to licensing terms.</p>
        </div>
        {/* End: Informational Footer */}
      </main>
    </div>
    // End: Main Container for Marketplace Page
  );
}
// End: Premium Extensions & Component Marketplace Hub Page Component
