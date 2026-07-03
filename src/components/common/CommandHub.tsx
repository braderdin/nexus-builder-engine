"use client";

import React from "react";
import { MAX_TOTAL_STORAGE_BYTES } from "@/lib/validations/fileUpload"; // Import storage constant

// Start: Component Local Type Definitions
interface UserProfile {
  id: string;
  email: string;
}

interface ActiveDeploymentItem {
  subdomain: string;
  created_at: string;
  seo_title: string;
}

interface CommandHubProps {
  userProfile: UserProfile | null;
  aiRequestsUsedToday: number;
  activeDeployments: ActiveDeploymentItem[];
  customSubdomain: string;
  isSubdomainValidAndAvailable: boolean;
  activePreviewJson: Record<string, any>;
  currentStorageUsedBytes: number; // Current storage usage in bytes
}
// End: Component Local Type Definitions

// Start: Enterprise Onboarding & Storage Ledger HUD Component
const CommandHub: React.FC<CommandHubProps> = ({
  userProfile,
  aiRequestsUsedToday,
  activeDeployments,
  customSubdomain,
  isSubdomainValidAndAvailable,
  activePreviewJson,
  currentStorageUsedBytes,
}) => {
  // Calculate storage usage percentage for the progress bar
  const storagePercentage = (currentStorageUsedBytes / MAX_TOTAL_STORAGE_BYTES) * 100;
  const storageUsedMB = (currentStorageUsedBytes / (1024 * 1024)).toFixed(2);
  const storageMaxMB = (MAX_TOTAL_STORAGE_BYTES / (1024 * 1024)).toFixed(0);

  // Determine AI quota status
  const MAX_AI_REQUESTS_DAILY = 5;
  const isAiQuotaExhausted = aiRequestsUsedToday >= MAX_AI_REQUESTS_DAILY;

  // Determine deployment checklist item statuses
  const isSubdomainCheckedAndValid = customSubdomain.trim().length > 0 && isSubdomainValidAndAvailable;
  // Simplified content ingestion check: if hero headline exists and is not empty
  const isContentConfigured = !!activePreviewJson?.heroSection?.headline && activePreviewJson.heroSection.headline.trim().length > 0;
  const isGatewayVerified = activeDeployments.length > 0;

  return (
    <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Enterprise Onboarding & Storage Ledger HUD</h4>

      {/* Start: Storage Boundary Limit Metrics */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-slate-300">Cloud Storage Usage</span>
          <span className="text-slate-400">
            {storageUsedMB}MB / {storageMaxMB}MB
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out
              ${storagePercentage > 80 ? "bg-red-500" : storagePercentage > 50 ? "bg-yellow-500" : "bg-emerald-500"}
            `}
            style={{ width: `${storagePercentage}%` }}
          ></div>
        </div>
      </div>
      {/* End: Storage Boundary Limit Metrics */}

      {/* Start: Daily AI Query Limits */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-slate-300">Daily AI Query Usage</span>
          <span className="text-slate-400">
            {aiRequestsUsedToday} / {MAX_AI_REQUESTS_DAILY}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out
              ${isAiQuotaExhausted ? "bg-red-500" : aiRequestsUsedToday > 3 ? "bg-yellow-500" : "bg-blue-500"}
            `}
            style={{ width: `${(aiRequestsUsedToday / MAX_AI_REQUESTS_DAILY) * 100}%` }}
          ></div>
        </div>
      </div>
      {/* End: Daily AI Query Limits */}

      {/* Start: Deployment Flight Stages Checklist */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h5 className="text-sm font-semibold text-slate-300">Deployment Onboarding Checklist</h5>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            {isSubdomainCheckedAndValid ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            <span className={`text-sm ${isSubdomainCheckedAndValid ? "text-slate-300" : "text-slate-500"}`}>
              1. Subdomain status checked and valid
            </span>
          </li>
          <li className="flex items-center gap-3">
            {isContentConfigured ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            <span className={`text-sm ${isContentConfigured ? "text-slate-300" : "text-slate-500"}`}>
              2. Site content configured and ready
            </span>
          </li>
          <li className="flex items-center gap-3">
            {isGatewayVerified ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            <span className={`text-sm ${isGatewayVerified ? "text-slate-300" : "text-slate-500"}`}>
              3. Gateway verification and deployment initiated
            </span>
          </li>
        </ul>
      </div>
      {/* End: Deployment Flight Stages Checklist */}
    </div>
  );
};

export default CommandHub;
// End: Enterprise Onboarding & Storage Ledger HUD Component
