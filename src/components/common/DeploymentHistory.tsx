"use client";

import React, { useState } from "react";

// Start: Component Local Type Definitions
interface ActiveDeploymentItem {
  subdomain: string;
  created_at: string;
  seo_title: string;
}

interface DeploymentHistoryProps {
  activeDeployments: ActiveDeploymentItem[];
}
// End: Component Local Type Definitions

// Start: Deployment History Component
const DeploymentHistory: React.FC<DeploymentHistoryProps> = ({ activeDeployments }) => {
  // Start: State for Rollback Notifications
  const [rollbackStatus, setRollbackStatus] = useState<string | null>(null);
  const [rollbackSubdomain, setRollbackSubdomain] = useState<string | null>(null);
  // End: State for Rollback Notifications

  // Start: Client-side Simulation Handler for Instant Rollback
  const handleRollback = (deployment: ActiveDeploymentItem) => {
    setRollbackSubdomain(deployment.subdomain);
    setRollbackStatus(`Initiating rollback for deployment "${deployment.subdomain}". This is a client-side simulation.`);
    // In a real application, this would trigger an actual backend API call
    setTimeout(() => {
      setRollbackStatus(null);
      setRollbackSubdomain(null);
    }, 3500); // Clear message after a short delay
  };
  // End: Client-side Simulation Handler for Instant Rollback

  // Start: Helper to Format Date
  const formatDeploymentDate = (dateString: string) => {
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

  // Start: Helper to Generate Mocha-like Hash (Truncated Subdomain for Visual Aesthetic)
  const generateDeploymentHash = (subdomain: string) => {
    // This is a client-side visual hash. For true uniqueness, consider a backend-generated ID.
    return subdomain.slice(0, 7); // e.g., "my-proj" from "my-project.superpage.link"
  };
  // End: Helper to Generate Mocha-like Hash

  return (
    // Start: Main Container for Deployment History
    <div className="w-full space-y-5 text-slate-100 font-sans">
      {/* Start: Component Title */}
      <h2 className="text-xl font-bold text-slate-200">Deployment History Log</h2>
      {/* End: Component Title */}

      {/* Start: Rollback Alert Banner */}
      {rollbackStatus && (
        <div className="p-4 text-sm bg-blue-950/40 border border-blue-700 rounded-lg shadow-md flex items-center justify-between animate-fadeInUp">
          <p className="font-medium text-blue-300">{rollbackStatus}</p>
          <button
            onClick={() => setRollbackStatus(null)}
            className="text-blue-400 hover:text-blue-200 transition-colors focus:outline-none"
            aria-label="Dismiss rollback alert"
          >
            &times;
          </button>
        </div>
      )}
      {/* End: Rollback Alert Banner */}

      {/* Start: Deployment List Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        {activeDeployments.length === 0 ? (
          // Start: Empty State Message
          <p className="text-sm text-slate-500 text-center py-8">
            No deployment history available for this account.
          </p>
          // End: Empty State Message
        ) : (
          // Start: Chronological Deployment Rows
          <div className="divide-y divide-slate-800">
            {activeDeployments.map((deployment, index) => (
              <div
                key={deployment.subdomain} // Assuming subdomain is unique for active deployments
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
              >
                {/* Start: Deployment Details Section */}
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  {/* Start: Active Indicator Dot */}
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Active Deployment"></span>
                  {/* End: Active Indicator Dot */}

                  <div className="flex flex-col">
                    {/* Start: Mocha Deployment Hash */}
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {generateDeploymentHash(deployment.subdomain)}
                      {rollbackSubdomain === deployment.subdomain ? (
                        <span className="ml-2 text-blue-400 animate-pulse-fast"> (Rolling Back...)</span>
                      ) : null}
                    </span>
                    {/* End: Mocha Deployment Hash */}

                    {/* Start: Deployment URL */}
                    <a
                      href={`https://${deployment.subdomain}.superpage.link`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-500 hover:text-blue-400 hover:underline transition-colors block mt-0.5"
                    >
                      {deployment.subdomain}.superpage.link
                    </a>
                    {/* End: Deployment URL */}
                  </div>
                </div>
                {/* End: Deployment Details Section */}

                {/* Start: Deployment Metadata and Action Button */}
                <div className="flex items-center gap-4 text-right">
                  {/* Start: Timestamp and SEO Title */}
                  <div className="flex flex-col text-xs text-slate-400">
                    <span className="font-medium">{formatDeploymentDate(deployment.created_at)}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 max-w-[150px] truncate md:max-w-none">
                      {deployment.seo_title || "Untitled Site"}
                    </span>
                  </div>
                  {/* End: Timestamp and SEO Title */}

                  {/* Start: Instant Rollback Button */}
                  <button
                    onClick={() => handleRollback(deployment)}
                    disabled={!!rollbackStatus} // Disable if a rollback is already in progress
                    className={`
                      text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ease-in-out
                      ${rollbackSubdomain === deployment.subdomain
                        ? "bg-blue-600 text-white cursor-not-allowed opacity-70"
                        : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white"
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    `}
                  >
                    {rollbackSubdomain === deployment.subdomain ? "Rolling Back..." : "Instant Rollback"}
                  </button>
                  {/* End: Instant Rollback Button */}
                </div>
                {/* End: Deployment Metadata and Action Button */}
              </div>
            ))}
          </div>
          // End: Chronological Deployment Rows
        )}
      </div>
      {/* End: Deployment List Container */}
    </div>
    // End: Main Container for Deployment History
  );
};
// End: Deployment History Component

export default DeploymentHistory;
