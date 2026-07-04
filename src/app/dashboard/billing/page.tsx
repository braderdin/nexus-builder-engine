"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type SubscriptionTier = "Free" | "Premium Pro";
interface InvoiceRecord {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  transactionHash: string;
}

const FREE_FEATURES = [
  "1 Site Deployment",
  "Basic Templates",
  "Limited AI Features",
  "Community Support",
  "50MB Storage",
  "Standard Analytics",
];
const PREMIUM_FEATURES = [
  "Unlimited Site Deployments",
  "Premium Templates",
  "Advanced AI Features",
  "Priority Support",
  "25GB Storage",
  "Real-time Analytics",
  "Custom Domains (Coming Soon)",
];

interface PricingCardProps {
  tier: SubscriptionTier;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  onSelect: (tier: SubscriptionTier) => void;
  onUpgrade: (tier: SubscriptionTier) => Promise<void>;
  isRedirecting: boolean;
  disabled: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  price,
  description,
  features,
  isCurrent,
  onSelect,
  onUpgrade,
  isRedirecting,
  disabled,
}) => (
  <div
    className={`relative flex flex-col p-6 rounded-2xl shadow-xl border
      ${isCurrent
        ? "border-purple-600 bg-slate-900 ring-2 ring-purple-500"
        : "border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors cursor-pointer"}
    `}
    onClick={() => !disabled && onSelect(tier)}
  >
    {isCurrent && (
      <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-md">
        Current Plan
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{tier}</h3>
    <p className="text-sm text-slate-400 mb-4">{description}</p>
    <div className="text-4xl font-extrabold text-white mb-6">
      {price}
      {tier === "Free" ? "" : <span className="text-lg font-medium text-slate-500">/month</span>}
    </div>
    <ul className="flex-grow space-y-3 text-sm text-slate-300 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    {tier !== "Free" && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpgrade(tier);
        }}
        disabled={isRedirecting || disabled || isCurrent}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all
          ${isCurrent
            ? "bg-slate-700 text-slate-400 cursor-default"
            : isRedirecting
              ? "bg-blue-700 text-white cursor-wait opacity-80"
              : "bg-blue-600 hover:bg-blue-500 text-white"}
          ${disabled && "opacity-50 cursor-not-allowed"}
        `}
      >
        {isCurrent ? "Your Current Plan" : isRedirecting ? "Redirecting to Checkout..." : `Upgrade to ${tier}`}
      </button>
    )}
  </div>
);

const MOCK_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-87654321",
    date: "2024-06-01",
    amount: "RM 99.00",
    status: "Paid",
    transactionHash: "0xabc123def456ghi789jkl012mno345pqr",
  },
  {
    id: "inv-12345678",
    date: "2024-05-01",
    amount: "RM 99.00",
    status: "Paid",
    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
];

export default function BillingPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [currentSubscriptionTier, setCurrentSubscriptionTier] = useState<SubscriptionTier>("Free");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>("Free");
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceRecord[]>(MOCK_INVOICES);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState<boolean>(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session || !session.user) {
        router.push("/auth");
      } else {
        setUserProfile({
          id: session.user.id,
          email: session.user.email || "anonymous",
        });
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', session.user.id)
          .single();
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else if (profile?.is_premium) {
          setCurrentSubscriptionTier("Premium Pro");
          setSelectedPlan("Premium Pro");
        }
      }
      setIsDataLoading(false);
    };
    verifyUserSession();

    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const status = urlParams.get("status");
    if (sessionId && status) {
      if (status === "success") {
        setCheckoutStatus("Payment successful! Your subscription is now Premium Pro.");
        setCurrentSubscriptionTier("Premium Pro");
      } else if (status === "cancelled") {
        setCheckoutStatus("Payment cancelled. You can try again at any time.");
      }
      // FIXED HERE: Clean App Router replace deployment without third options parameter conflict
      router.replace("/dashboard/billing");
    }
  }, [router]);

  const handleUpgradeClick = async (tier: SubscriptionTier) => {
    if (!userProfile?.id || !userProfile?.email) {
      alert("User authentication error. Please log in again.");
      return;
    }
    if (tier === "Free") return;
    setIsRedirectingToStripe(true);
    setCheckoutStatus(null);
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRO_PRICE_ID;
    if (!priceId) {
      setCheckoutStatus("Configuration Error: Stripe price ID is not set.");
      setIsRedirectingToStripe(false);
      return;
    }
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile.id,
          userEmail: userProfile.email,
          priceId: priceId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        router.push(data.url);
      } else {
        setCheckoutStatus(`Upgrade Fault: ${data.message || data.error || "Failed to initiate checkout."}`);
        setIsRedirectingToStripe(false);
      }
    } catch (error: any) {
      console.error("Failed to initiate Stripe Checkout:", error);
      setCheckoutStatus(`Upgrade Fault: ${error.message || "Network error or invalid response."}`);
      setIsRedirectingToStripe(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING BILLING & INVOICES HUB...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <nav className="border-b border-slate-900 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-950">N</div>
          <span className="font-bold tracking-tight text-white">NexusDeploy</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium hidden md:inline-block">Secure Node: {userProfile?.email}</span>
          <button onClick={() => supabase.auth.signOut().then(() => router.push("/auth"))} className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl transition-colors">Disconnect</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Enterprise Billing & Invoices Core Hub</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl">Manage your subscription, view payment history, and upgrade your service tier.</p>
        </div>
        {checkoutStatus && (
          <div className={`p-4 border text-sm rounded-lg shadow-md flex items-center justify-between animate-fadeInUp ${checkoutStatus.includes("successful") ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-red-950/40 border-red-800 text-red-400"}`}>
            <p className="font-medium">{checkoutStatus}</p>
            <button onClick={() => setCheckoutStatus(null)} className="text-white hover:text-slate-300 transition-colors focus:outline-none">&times;</button>
          </div>
        )}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard tier="Free" price="RM 0" description="Perfect for starting your journey with essential features." features={FREE_FEATURES} isCurrent={currentSubscriptionTier === "Free"} onSelect={setSelectedPlan} onUpgrade={handleUpgradeClick} isRedirecting={isRedirectingToStripe} disabled={isRedirectingToStripe} />
            <PricingCard tier="Premium Pro" price="RM 99" description="Unlock advanced capabilities for ultimate growth and performance." features={PREMIUM_FEATURES} isCurrent={currentSubscriptionTier === "Premium Pro"} onSelect={setSelectedPlan} onUpgrade={handleUpgradeClick} isRedirecting={isRedirectingToStripe} disabled={isRedirectingToStripe} />
          </div>
        </section>
      </main>
    </div>
  );
}