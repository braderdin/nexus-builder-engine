"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client"; // Assuming supabase client is needed for auth check

// Start: Component Local Type Definitions
type SubscriptionTier = "Free" | "Premium Pro";

interface InvoiceRecord {
  id: string;
  date: string;
  amount: string; // Formatted string, e.g., "RM 99.00"
  status: "Paid" | "Pending" | "Failed";
  transactionHash: string; // Mock monospace hash
}

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
  {
    id: "inv-98765432",
    date: "2024-04-01",
    amount: "RM 99.00",
    status: "Paid",
    transactionHash: "0xdeadbeef1234567890abcdef12345678",
  },
  {
    id: "inv-56789012",
    date: "2024-03-01",
    amount: "RM 99.00",
    status: "Paid",
    transactionHash: "0x1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a",
  },
];
// End: Component Local Type Definitions

// Start: Enterprise Billing & Invoices Core Hub Page Component
export default function BillingPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [currentSubscriptionTier, setCurrentSubscriptionTier] = useState<SubscriptionTier>("Free");
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceRecord[]>(MOCK_INVOICES);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState<boolean>(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  // Start: User Session Verification and Stripe Checkout Status Check Effect
  useEffect(() => {
    const verifyUserSession = async () => {
      setIsDataLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push("/auth");
      } else {
        setUserProfile(session.user);
        // Simulate fetching user's actual subscription tier from backend
        // For now, let's keep it "Free" unless a successful checkout is detected
        // In a real app, you'd fetch this from your database
      }
      setIsDataLoading(false);
    };

    verifyUserSession();

    // Start: Check for Stripe Checkout Session Status from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    const status = urlParams.get("status");

    if (sessionId && status) {
      if (status === "success") {
        setCheckoutStatus("Payment successful! Your subscription is now Premium Pro.");
        setCurrentSubscriptionTier("Premium Pro");
        // In a real app, you'd verify the session server-side
      } else if (status === "cancelled") {
        setCheckoutStatus("Payment cancelled. You can try again at any time.");
      }
      // Clear URL params after processing
      router.replace("/dashboard/billing", undefined, { shallow: true });
    }
    // End: Check for Stripe Checkout Session Status
  }, [router]);
  // End: User Session Verification and Stripe Checkout Status Check Effect

  // Start: Handle Upgrade to Premium Pro Click
  const handleUpgradeClick = async () => {
    if (!userProfile?.email) {
      alert("User email not found. Please log in again.");
      return;
    }

    setIsRedirectingToStripe(true);
    setCheckoutStatus(null); // Clear previous status

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userProfile.email,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRO_PRICE_ID, // Use environment variable for Stripe Price ID
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        router.push(data.url); // Redirect to Stripe Checkout page
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
  // End: Handle Upgrade to Premium Pro Click

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING BILLING & INVOICES HUB...
      </div>
    );
  }

  return (
    // Start: Main Container for Billing Page
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
            Enterprise Billing & Invoices Core Hub
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Manage your subscription, view payment history, and upgrade your service tier.
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Checkout Status Banner */}
        {checkoutStatus && (
          <div className={`p-4 border text-sm rounded-lg shadow-md flex items-center justify-between animate-fadeInUp
            ${checkoutStatus.includes("successful") ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" : "bg-red-950/40 border-red-800 text-red-400"}
          `}>
            <p className="font-medium">{checkoutStatus}</p>
            <button
              onClick={() => setCheckoutStatus(null)}
              className="text-white hover:text-slate-300 transition-colors focus:outline-none"
              aria-label="Dismiss status message"
            >
              &times;
            </button>
          </div>
        )}
        {/* End: Checkout Status Banner */}

        {/* Start: Current Subscription Tier */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Current Subscription Tier</h3>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-3">
              <span className={`text-sm font-semibold px-4 py-2 rounded-full relative overflow-hidden
                ${currentSubscriptionTier === "Premium Pro"
                  ? "bg-gradient-to-br from-purple-800 to-indigo-800 text-white shadow-lg shadow-purple-950"
                  : "bg-slate-800 text-slate-300 border border-slate-700"}
              `}>
                {currentSubscriptionTier}
                {currentSubscriptionTier === "Premium Pro" && (
                  <>
                    <span className="absolute inset-0 rounded-full blur-sm opacity-50 bg-gradient-to-br from-purple-500 to-indigo-500 animate-pulse-slow"></span>
                    <span className="relative z-10"> ✨ Active</span>
                  </>
                )}
              </span>
            </div>
            {currentSubscriptionTier === "Free" && (
              <p className="text-xs text-slate-400 mt-2">
                Unlock advanced features, unlimited sites, and priority AI support with Premium Pro.
              </p>
            )}
          </div>
          {currentSubscriptionTier === "Free" && (
            <button
              onClick={handleUpgradeClick}
              disabled={isRedirectingToStripe}
              className={`text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg
                ${isRedirectingToStripe
                  ? "bg-slate-700 cursor-not-allowed text-slate-400"
                  : "bg-blue-600 hover:bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"}
              `}
            >
              {isRedirectingToStripe ? "Redirecting..." : "Upgrade to Premium Pro"}
            </button>
          )}
        </section>
        {/* End: Current Subscription Tier */}

        {/* Start: Historical Invoice Records Grid Matrix */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
          <h3 className="text-lg font-bold text-white px-6 py-4 border-b border-slate-800">Historical Invoices</h3>
          {invoiceHistory.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No invoice history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="uppercase text-xs text-slate-400 bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">Invoice ID</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Amount</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{invoice.id}</td>
                      <td className="px-6 py-4 text-slate-400">{invoice.date}</td>
                      <td className="px-6 py-4 text-slate-300">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full
                          ${invoice.status === "Paid" ? "bg-emerald-900/50 text-emerald-300" :
                            invoice.status === "Pending" ? "bg-yellow-900/50 text-yellow-300" :
                            "bg-red-900/50 text-red-300"}
                        `}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs break-all">{invoice.transactionHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {/* End: Historical Invoice Records Grid Matrix */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. Billing data simulation for demonstration purposes.</p>
        </div>
        {/* End: Informational Footer */}
      </main>
    </div>
    // End: Main Container for Billing Page
  );
}
// End: Enterprise Billing & Invoices Core Hub Page Component
