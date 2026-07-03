"use client";

// Start: Core React and Next.js Framework Imports
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend and Utility Imports
import { supabase } from "@/lib/supabase/client"; // Assuming supabase client is needed for auth check
// End: External Backend and Utility Imports

// Start: Component Local Type Definitions
type LeadStatus = 'new' | 'processing' | 'completed';

interface CustomerLead {
  id: string;
  name: string;
  phone: string; // Storing as string, ensure consistent formatting (e.g., "60123456789")
  product: string;
  value: number; // Monetary value of the lead/order
  status: LeadStatus;
  created_at: string;
}

const MOCK_LEADS: CustomerLead[] = [
  {
    id: "lead-abc-1",
    name: "Ahmad Bin Ali",
    phone: "60123456789",
    product: "WhatsApp Express Storefront",
    value: 499.00,
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "lead-def-2",
    name: "Siti Nurhaliza",
    phone: "60176543210",
    product: "SEO Engine Portfolio",
    value: 750.00,
    status: "processing",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: "lead-ghi-3",
    name: "Chong Wei",
    phone: "60161122334",
    product: "Premium AI Adaptive Layout",
    value: 1200.00,
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  },
  {
    id: "lead-jkl-4",
    name: "Puan Lim",
    phone: "60195566778",
    product: "WhatsApp Express Storefront",
    value: 499.00,
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: "lead-mno-5",
    name: "David Lee",
    phone: "60112233445",
    product: "AI Live Chat Node Integration",
    value: 300.00,
    status: "processing",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
];
// End: Component Local Type Definitions

// Start: Helper Functions
/**
 * Formats a number as Malaysian Ringgit (RM).
 * @param value The number to format.
 * @returns Formatted currency string.
 */
const formatCurrency = (value: number): string => {
  return `RM ${value.toFixed(2)}`;
};

/**
 * Generates a WhatsApp API link with a pre-filled message.
 * @param phoneNumber The recipient's phone number (e.g., "60123456789").
 * @param message The message to pre-fill.
 * @returns The WhatsApp API link.
 */
const generateWhatsAppLink = (phoneNumber: string, message: string): string => {
  // Ensure phone number starts with country code and no '+' or spaces
  const cleanPhoneNumber = phoneNumber.startsWith("6") ? phoneNumber : `60${phoneNumber}`; // Basic assumption for Malaysia
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
};

/**
 * Formats a date string into a more readable format.
 * @param dateString The date string to format.
 * @returns Formatted date string.
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};
// End: Helper Functions

// Start: WhatsApp Quick-Reply Automation Sheet Modal Component
interface WhatsAppModalProps {
  lead: CustomerLead;
  onClose: () => void;
}

const WhatsAppQuickReplyModal: React.FC<WhatsAppModalProps> = ({ lead, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");

  const messageTemplates: { [key: string]: string } = {
    "": "Select a quick reply template...",
    "payment_reminder": `Hi ${lead.name}, this is a friendly reminder about your recent order of ${lead.product} valued at ${formatCurrency(lead.value)}. Please complete your payment soon. Thank you!`,
    "delivery_status": `Hi ${lead.name}, your order for ${lead.product} is currently being processed and will be delivered shortly. We will notify you once it's out for delivery.`,
    "order_confirmation": `Hi ${lead.name}, thank you for your order of ${lead.product}! We've received your payment of ${formatCurrency(lead.value)} and are preparing your shipment.`,
    "custom": "Enter your custom message here...",
  };

  useEffect(() => {
    if (selectedTemplate === "custom") {
      setCustomMessage(""); // Clear custom message when switching to custom template
    } else {
      setCustomMessage(messageTemplates[selectedTemplate]); // Pre-fill with template content
    }
  }, [selectedTemplate, messageTemplates]);

  const currentMessage = selectedTemplate === "custom" ? customMessage : messageTemplates[selectedTemplate];
  const whatsAppLink = generateWhatsAppLink(lead.phone, currentMessage);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center space-y-6">
        <h3 className="text-xl font-bold text-white">WhatsApp Quick-Reply Automation</h3>
        <p className="text-slate-300 text-sm">Automate your replies to <span className="text-blue-400">{lead.name}</span> for order <span className="text-emerald-400">{lead.product}</span>.</p>

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="template-select" className="block text-xs font-semibold text-slate-400 mb-2">
              Choose Message Template
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none pr-8 transition-colors"
            >
              {Object.entries(messageTemplates).map(([key, text]) => (
                <option key={key} value={key} disabled={key === ""}>
                  {key === "" ? text : (key === "custom" ? "Custom Message" : key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                </option>
              ))}
            </select>
          </div>
          {selectedTemplate === "custom" && (
            <div>
              <label htmlFor="custom-message" className="block text-xs font-semibold text-slate-400 mb-2">
                Your Custom Message
              </label>
              <textarea
                id="custom-message"
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              ></textarea>
            </div>
          )}
          {selectedTemplate !== "custom" && selectedTemplate !== "" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Generated Message Preview
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 overflow-hidden text-ellipsis">
                {currentMessage}
              </div>
            </div>
          )}
        </div>

        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.284 16.883c-.099.32-.57.514-.805.626-1.571.745-3.329.98-5.02.66-.401-.075-.807-.168-1.198-.321l-.226-.094-1.282.472.335-1.248-.066-.217c-.246-.777-.373-1.6-.373-2.43 0-4.085 3.107-7.414 7.217-7.414 3.993 0 7.243 3.25 7.243 7.244 0 4.091-3.11 7.42-7.219 7.42-.803 0-1.58-.124-2.316-.367zm-3.376-2.508l-.105-.06c-.34-.199-.738-.277-1.144-.293-1.077-.042-2.022.693-2.368 1.637-.215.597-.134 1.258.17 1.776l.053.088-.574 2.138 2.213-.518.069.043c.427.266.915.421 1.416.488 1.332.176 2.529-.272 3.472-1.173.856-.814 1.408-1.928 1.547-3.14.077-.665-.015-1.33-.243-1.933-.298-.79-1.03-1.393-1.897-1.488-1.039-.115-2.062.298-2.684.992l-.06.076z"/></svg>
          Send WhatsApp Message
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
// End: WhatsApp Quick-Reply Automation Sheet Modal Component

// Start: StatCard Component
interface StatCardProps {
  title: string;
  value: string;
  glowColor: string; // Tailwind color class for glow effect
}

const StatCard: React.FC<StatCardProps> = ({ title, value, glowColor }) => (
  <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
    <div className={`absolute inset-0 z-0 opacity-20 blur-xl ${glowColor}`}></div>
    <div className="relative z-10 flex flex-col">
      <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
      <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
    </div>
  </div>
);
// End: StatCard Component

// Start: CRM Management Grid Dashboard Page Component
export default function LeadsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<CustomerLead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<CustomerLead | null>(null);

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

  // Start: Computed Metrics for Header
  const totalPipelineValue = useMemo(() => {
    return leads.reduce((sum, lead) => sum + lead.value, 0);
  }, [leads]);

  const activeConversionLeads = useMemo(() => {
    return leads.filter(lead => lead.status === 'new' || lead.status === 'processing').length;
  }, [leads]);
  // End: Computed Metrics for Header

  /**
   * Updates the status of a lead and potentially opens the WhatsApp modal.
   * @param leadId The ID of the lead to update.
   * @param newStatus The new status for the lead.
   * @param openWhatsApp If true, opens the WhatsApp modal for this lead after status update.
   */
  const handleStatusUpdate = (leadId: string, newStatus: LeadStatus, openWhatsApp: boolean = false) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    if (openWhatsApp) {
      const updatedLead = leads.find(lead => lead.id === leadId);
      if (updatedLead) {
        setSelectedLead({ ...updatedLead, status: newStatus }); // Ensure modal gets updated status
      }
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING CRM DASHBOARD ASSETS...
      </div>
    );
  }

  const leadsByStatus = (status: LeadStatus) => leads.filter(lead => lead.status === status);

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

        {/* Start: Live Glowing Metric Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard
            title="Total Pipeline Value"
            value={formatCurrency(totalPipelineValue)}
            glowColor="bg-emerald-500"
          />
          <StatCard
            title="Active Conversion Leads"
            value={String(activeConversionLeads)}
            glowColor="bg-blue-500"
          />
        </section>
        {/* End: Live Glowing Metric Widgets */}

        {/* Start: Interactive Kanban Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Orders Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              New Orders
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">{leadsByStatus('new').length}</span>
            </h3>
            {leadsByStatus('new').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No new leads.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('new').map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Clickable area for opening WhatsApp modal */}
                  <div onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-300">{lead.name}</h4>
                        <p className="text-xs text-slate-400">{lead.product}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  </div>
                  {/* Status transition actions */}
                  {lead.status === 'new' && (
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-center">
                      <button
                        onClick={() => handleStatusUpdate(lead.id, 'processing', true)} // Open WhatsApp after moving to processing
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Start Processing
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>

          {/* In-Progress Fulfillment Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              In-Progress Fulfillment
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-600 text-white font-medium">{leadsByStatus('processing').length}</span>
            </h3>
            {leadsByStatus('processing').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No leads in progress.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('processing').map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Clickable area for opening WhatsApp modal */}
                  <div onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-yellow-300">{lead.name}</h4>
                        <p className="text-xs text-slate-400">{lead.product}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  </div>
                  {/* Status transition actions */}
                  {lead.status === 'processing' && (
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-center">
                      <button
                        onClick={() => handleStatusUpdate(lead.id, 'completed', true)} // Open WhatsApp after moving to completed
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Shipments Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Completed Shipments
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white font-medium">{leadsByStatus('completed').length}</span>
            </h3>
            {leadsByStatus('completed').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No completed leads.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('completed').map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)} // Still opens WhatsApp modal for completed leads
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-emerald-500 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-emerald-300">{lead.name}</h4>
                      <p className="text-xs text-slate-400">{lead.product}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End: Interactive Kanban Grid Layout */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. CRM data simulation for demonstration purposes.</p>
        </div>
        {/* End: Informational Footer */}
      </main>

      {/* WhatsApp Quick-Reply Automation Sheet Modal */}
      {selectedLead && (
        <WhatsAppQuickReplyModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
    // End: Main Container for CRM Leads Page
  );
}
// End: CRM Management Grid Dashboard Page Component"use client";

// Start: Core React and Next.js Framework Imports
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
// End: Core React and Next.js Framework Imports

// Start: External Backend and Utility Imports
import { supabase } from "@/lib/supabase/client"; // Assuming supabase client is needed for auth check
// End: External Backend and Utility Imports

// Start: Component Local Type Definitions
type LeadStatus = 'new' | 'processing' | 'completed';

interface CustomerLead {
  id: string;
  name: string;
  phone: string; // Storing as string, ensure consistent formatting (e.g., "60123456789")
  product: string;
  value: number; // Monetary value of the lead/order
  status: LeadStatus;
  created_at: string;
}

const MOCK_LEADS: CustomerLead[] = [
  {
    id: "lead-abc-1",
    name: "Ahmad Bin Ali",
    phone: "60123456789",
    product: "WhatsApp Express Storefront",
    value: 499.00,
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "lead-def-2",
    name: "Siti Nurhaliza",
    phone: "60176543210",
    product: "SEO Engine Portfolio",
    value: 750.00,
    status: "processing",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: "lead-ghi-3",
    name: "Chong Wei",
    phone: "60161122334",
    product: "Premium AI Adaptive Layout",
    value: 1200.00,
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  },
  {
    id: "lead-jkl-4",
    name: "Puan Lim",
    phone: "60195566778",
    product: "WhatsApp Express Storefront",
    value: 499.00,
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: "lead-mno-5",
    name: "David Lee",
    phone: "60112233445",
    product: "AI Live Chat Node Integration",
    value: 300.00,
    status: "processing",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  },
];
// End: Component Local Type Definitions

// Start: Helper Functions
/**
 * Formats a number as Malaysian Ringgit (RM).
 * @param value The number to format.
 * @returns Formatted currency string.
 */
const formatCurrency = (value: number): string => {
  return `RM ${value.toFixed(2)}`;
};

/**
 * Generates a WhatsApp API link with a pre-filled message.
 * @param phoneNumber The recipient's phone number (e.g., "60123456789").
 * @param message The message to pre-fill.
 * @returns The WhatsApp API link.
 */
const generateWhatsAppLink = (phoneNumber: string, message: string): string => {
  // Ensure phone number starts with country code and no '+' or spaces
  const cleanPhoneNumber = phoneNumber.startsWith("6") ? phoneNumber : `60${phoneNumber}`; // Basic assumption for Malaysia
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
};

/**
 * Formats a date string into a more readable format.
 * @param dateString The date string to format.
 * @returns Formatted date string.
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};
// End: Helper Functions

// Start: WhatsApp Quick-Reply Automation Sheet Modal Component
interface WhatsAppModalProps {
  lead: CustomerLead;
  onClose: () => void;
}

const WhatsAppQuickReplyModal: React.FC<WhatsAppModalProps> = ({ lead, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customMessage, setCustomMessage] = useState<string>("");

  const messageTemplates: { [key: string]: string } = {
    "": "Select a quick reply template...",
    "payment_reminder": `Hi ${lead.name}, this is a friendly reminder about your recent order of ${lead.product} valued at ${formatCurrency(lead.value)}. Please complete your payment soon. Thank you!`,
    "delivery_status": `Hi ${lead.name}, your order for ${lead.product} is currently being processed and will be delivered shortly. We will notify you once it's out for delivery.`,
    "order_confirmation": `Hi ${lead.name}, thank you for your order of ${lead.product}! We've received your payment of ${formatCurrency(lead.value)} and are preparing your shipment.`,
    "custom": "Enter your custom message here...",
  };

  useEffect(() => {
    if (selectedTemplate === "custom") {
      setCustomMessage(""); // Clear custom message when switching to custom template
    } else {
      setCustomMessage(messageTemplates[selectedTemplate]); // Pre-fill with template content
    }
  }, [selectedTemplate, messageTemplates]);

  const currentMessage = selectedTemplate === "custom" ? customMessage : messageTemplates[selectedTemplate];
  const whatsAppLink = generateWhatsAppLink(lead.phone, currentMessage);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center space-y-6">
        <h3 className="text-xl font-bold text-white">WhatsApp Quick-Reply Automation</h3>
        <p className="text-slate-300 text-sm">Automate your replies to <span className="text-blue-400">{lead.name}</span> for order <span className="text-emerald-400">{lead.product}</span>.</p>

        <div className="space-y-4 text-left">
          <div>
            <label htmlFor="template-select" className="block text-xs font-semibold text-slate-400 mb-2">
              Choose Message Template
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none pr-8 transition-colors"
            >
              {Object.entries(messageTemplates).map(([key, text]) => (
                <option key={key} value={key} disabled={key === ""}>
                  {key === "" ? text : (key === "custom" ? "Custom Message" : key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                </option>
              ))}
            </select>
          </div>
          {selectedTemplate === "custom" && (
            <div>
              <label htmlFor="custom-message" className="block text-xs font-semibold text-slate-400 mb-2">
                Your Custom Message
              </label>
              <textarea
                id="custom-message"
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500 transition-colors resize-y"
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              ></textarea>
            </div>
          )}
          {selectedTemplate !== "custom" && selectedTemplate !== "" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Generated Message Preview
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 overflow-hidden text-ellipsis">
                {currentMessage}
              </div>
            </div>
          )}
        </div>

        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.284 16.883c-.099.32-.57.514-.805.626-1.571.745-3.329.98-5.02.66-.401-.075-.807-.168-1.198-.321l-.226-.094-1.282.472.335-1.248-.066-.217c-.246-.777-.373-1.6-.373-2.43 0-4.085 3.107-7.414 7.217-7.414 3.993 0 7.243 3.25 7.243 7.244 0 4.091-3.11 7.42-7.219 7.42-.803 0-1.58-.124-2.316-.367zm-3.376-2.508l-.105-.06c-.34-.199-.738-.277-1.144-.293-1.077-.042-2.022.693-2.368 1.637-.215.597-.134 1.258.17 1.776l.053.088-.574 2.138 2.213-.518.069.043c.427.266.915.421 1.416.488 1.332.176 2.529-.272 3.472-1.173.856-.814 1.408-1.928 1.547-3.14.077-.665-.015-1.33-.243-1.933-.298-.79-1.03-1.393-1.897-1.488-1.039-.115-2.062.298-2.684.992l-.06.076z"/></svg>
          Send WhatsApp Message
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
// End: WhatsApp Quick-Reply Automation Sheet Modal Component

// Start: StatCard Component
interface StatCardProps {
  title: string;
  value: string;
  glowColor: string; // Tailwind color class for glow effect
}

const StatCard: React.FC<StatCardProps> = ({ title, value, glowColor }) => (
  <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-hidden">
    <div className={`absolute inset-0 z-0 opacity-20 blur-xl ${glowColor}`}></div>
    <div className="relative z-10 flex flex-col">
      <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
      <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
    </div>
  </div>
);
// End: StatCard Component

// Start: CRM Management Grid Dashboard Page Component
export default function LeadsPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<CustomerLead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<CustomerLead | null>(null);

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

  // Start: Computed Metrics for Header
  const totalPipelineValue = useMemo(() => {
    return leads.reduce((sum, lead) => sum + lead.value, 0);
  }, [leads]);

  const activeConversionLeads = useMemo(() => {
    return leads.filter(lead => lead.status === 'new' || lead.status === 'processing').length;
  }, [leads]);
  // End: Computed Metrics for Header

  /**
   * Updates the status of a lead and potentially opens the WhatsApp modal.
   * @param leadId The ID of the lead to update.
   * @param newStatus The new status for the lead.
   * @param openWhatsApp If true, opens the WhatsApp modal for this lead after status update.
   */
  const handleStatusUpdate = (leadId: string, newStatus: LeadStatus, openWhatsApp: boolean = false) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    if (openWhatsApp) {
      const updatedLead = leads.find(lead => lead.id === leadId);
      if (updatedLead) {
        setSelectedLead({ ...updatedLead, status: newStatus }); // Ensure modal gets updated status
      }
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex justify-center items-center font-mono text-xs tracking-widest">
        LOADING CRM DASHBOARD ASSETS...
      </div>
    );
  }

  const leadsByStatus = (status: LeadStatus) => leads.filter(lead => lead.status === status);

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

        {/* Start: Live Glowing Metric Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard
            title="Total Pipeline Value"
            value={formatCurrency(totalPipelineValue)}
            glowColor="bg-emerald-500"
          />
          <StatCard
            title="Active Conversion Leads"
            value={String(activeConversionLeads)}
            glowColor="bg-blue-500"
          />
        </section>
        {/* End: Live Glowing Metric Widgets */}

        {/* Start: Interactive Kanban Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Orders Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              New Orders
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">{leadsByStatus('new').length}</span>
            </h3>
            {leadsByStatus('new').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No new leads.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('new').map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Clickable area for opening WhatsApp modal */}
                  <div onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-300">{lead.name}</h4>
                        <p className="text-xs text-slate-400">{lead.product}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  </div>
                  {/* Status transition actions */}
                  {lead.status === 'new' && (
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-center">
                      <button
                        onClick={() => handleStatusUpdate(lead.id, 'processing', true)} // Open WhatsApp after moving to processing
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Start Processing
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>

          {/* In-Progress Fulfillment Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              In-Progress Fulfillment
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-600 text-white font-medium">{leadsByStatus('processing').length}</span>
            </h3>
            {leadsByStatus('processing').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No leads in progress.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('processing').map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all duration-200 group relative overflow-hidden"
                >
                  {/* Clickable area for opening WhatsApp modal */}
                  <div onClick={() => setSelectedLead(lead)} className="cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-yellow-300">{lead.name}</h4>
                        <p className="text-xs text-slate-400">{lead.product}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  </div>
                  {/* Status transition actions */}
                  {lead.status === 'processing' && (
                    <div className="mt-4 pt-3 border-t border-slate-700 flex justify-center">
                      <button
                        onClick={() => handleStatusUpdate(lead.id, 'completed', true)} // Open WhatsApp after moving to completed
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Shipments Column */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Completed Shipments
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white font-medium">{leadsByStatus('completed').length}</span>
            </h3>
            {leadsByStatus('completed').length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No completed leads.</p>
            )}
            <div className="space-y-3">
              {leadsByStatus('completed').map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)} // Still opens WhatsApp modal for completed leads
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-emerald-500 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-emerald-300">{lead.name}</h4>
                      <p className="text-xs text-slate-400">{lead.product}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400">{formatCurrency(lead.value)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">Added: {formatDate(lead.created_at)}</p>
                  <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* End: Interactive Kanban Grid Layout */}

        {/* Start: Informational Footer */}
        <div className="text-center text-xs text-slate-600 pt-12 border-t border-slate-900 mt-12">
          <p>&copy; 2026 NexusDeploy. All rights reserved. CRM data simulation for demonstration purposes.</p>
        </div>
        {/* End: Informational Footer */}
      </main>

      {/* WhatsApp Quick-Reply Automation Sheet Modal */}
      {selectedLead && (
        <WhatsAppQuickReplyModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
    // End: Main Container for CRM Leads Page
  );
}
// End: CRM Management Grid Dashboard Page Component
