"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client"; // Assuming supabase client is needed for auth check

// Start: Component Local Type Definitions
interface LeadItem {
  id: string;
  clientName: string;
  contactEmail: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  interest: string;
  created_at: string;
  last_updated: string;
}

const MOCK_LEADS: LeadItem[] = [
  {
    id: "lead-001",
    clientName: "Alpha Corp",
    contactEmail: "contact@alphacorp.com",
    source: "Website Form",
    status: "New",
    interest: "Advanced Dynamic SEO Optimization Shield",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    last_updated: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: "lead-002",
    clientName: "Beta Solutions",
    contactEmail: "info@betasolutions.net",
    source: "Referral",
    status: "Contacted",
    interest: "AI Live Chat Node",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    last_updated: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
  {
    id: "lead-003",
    clientName: "Gamma Innovations",
    contactEmail: "hello@gammainnov.io",
    source: "Cold Outreach",
    status: "Qualified",
    interest: "Stripe Checkout Pipeline Pro",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    last_updated: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
  },
  {
    id: "lead-004",
    clientName: "Delta Enterprises",
    contactEmail: "sales@deltaent.co",
    source: "Partnership",
    status: "Converted",
    interest: "WhatsApp Express Storefront",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    last_updated: new Date(Date.now() - 86400000 * 12).toISOString(), // 12 days ago
  },
  {
    id: "lead-005",
    clientName: "Epsilon Tech",
    contactEmail: "support@epsilon.org",
    source: "Website Form",
    status: "New",
    interest: "Premium AI Adaptive Layout",
    created_at: new Date().toISOString(), // Just now
    last_updated: new Date().toISOString(),
  },
];
// End: Component Local Type Definitions

// Start: Helper to Format Date
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
// End: Helper to Format Date

// Start: CRM Management Grid Dashboard Page Component
export default function LeadsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<LeadItem[]>(MOCK_LEADS);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Start: User Session Verification Effect
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
  }, [router]);
  // End: User Session Verification Effect

  // Start: Filtered Leads Logic
  const filteredLeads = leads.filter((lead) => {
    const statusMatch = filterStatus === "All" || lead.status === filterStatus;
    const searchMatch =
      lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });
  // End: Filtered Leads Logic

  // Start: Handle Status Update (Client-side Simulation)
  const handleStatusUpdate = (id: string, newStatus: LeadItem['status']) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === id ? { ...lead, status: newStatus, last_updated: new Date().toISOString() } : lead
      )
    );
  };
  // End: Handle Status Update (Client-side Simulation)

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING CRM DASHBOARD ASSETS...
      </div>
    );
  }

  return (
    // Start: Main Container for CRM Leads Page
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
            Advanced CRM Management Grid Dashboard
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-3xl mx-auto sm:mx-0">
            Track and manage all your customer leads and sales pipeline activities in real-time.
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
          <input
            type="text"
            placeholder="Search leads by name, email, interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500"
          />
          <div className="flex flex-wrap gap-2">
            {["All", "New", "Contacted", "Qualified", "Converted", "Lost"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        {/* End: Filters and Search */}

        {/* Start: Leads Grid Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
          {filteredLeads.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No leads found matching your criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-400 bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">Client Name</th>
                    <th scope="col" className="px-6 py-3">Contact</th>
                    <th scope="col" className="px-6 py-3">Source</th>
                    <th scope="col" className="px-6 py-3">Interest</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Last Updated</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{lead.clientName}</td>
                      <td className="px-6 py-4 text-slate-400">{lead.contactEmail}</td>
                      <td className="px-6 py-4 text-slate-400">{lead.source}</td>
                      <td className="px-6 py-4 text-slate-400">{lead.interest}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          lead.status === 'New' ? 'bg-blue-900/50 text-blue-300' :
                          lead.status === 'Contacted' ? 'bg-yellow-900/50 text-yellow-300' :
                          lead.status === 'Qualified' ? 'bg-purple-900/50 text-purple-300' :
                          lead.status === 'Converted' ? 'bg-emerald-900/50 text-emerald-300' :
                          'bg-red-900/50 text-red-300'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDateTime(lead.last_updated)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value as LeadItem['status'])}
                            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {/* End: Leads Grid Table */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. CRM data simulation for demonstration purposes.</p>
        </div>
        {/* End: Informational Footer */}
      </main>
    </div>
    // End: Main Container for CRM Leads Page
  );
}
// End: CRM Management Grid Dashboard Page Component
