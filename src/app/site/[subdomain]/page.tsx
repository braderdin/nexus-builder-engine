"use client";

// Start: Core React and Navigation Dependency Imports
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// End: Core React and Navigation Dependency Imports

// Start: Infrastructure and Sub-Component Engine Imports
import DynamicRenderer from "@/components/templates/DynamicRenderer";
import { getMerchantWebsiteBySubdomain } from "@/lib/supabase/sites"; // New import
// End: Infrastructure and Sub-Component Engine Imports

// Start: Public Multi-Tenant Viewer Component
export default function PublicMerchantSitePage() {
  const params = useParams();
  const subdomain = params?.subdomain as string;

  // Start: Component Local Lifecycle States
  const [siteData, setSiteData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(true); // Default to premium to hide ads until status is confirmed
  // End: Component Local Lifecycle States

  // Start: Database Query Lifecycle Hook Validation
  useEffect(() => {
    if (!subdomain) return;

    const fetchPublishedSitePayload = async () => {
      try {
        // Start: Fetch site data and relational profile data using the new utility function
        const { data: siteQueryResult, error: fetchError } = await getMerchantWebsiteBySubdomain(subdomain);

        if (fetchError) throw fetchError;
        if (!siteQueryResult) throw new Error("No site data found for this subdomain.");
        
        setSiteData(siteQueryResult);
        
        // Dynamic Single Page Browser Title Overwrite
        if (siteQueryResult.seo_title) {
          document.title = siteQueryResult.seo_title;
        }

        // Set premium status directly from the fetched data
        setIsPremium(siteQueryResult.is_premium);

      } catch (fetchError: any) {
        console.error("Error fetching site data:", fetchError.message);
        setErrorState(fetchError.message || "Target site configuration deployment missing or data error.");
        setIsPremium(false); // Ensure ads are shown if there's any fetch error
      } finally {
        setIsFetching(false);
      }
    };

    fetchPublishedSitePayload();
  }, [subdomain]);
  // End: Database Query Lifecycle Hook Validation

  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-500 flex justify-center items-center font-mono text-xs tracking-widest">
        RESOLVING MULTI-TENANT DOMAIN SHIFT MATRIX...
      </div>
    );
  }

  if (errorState || !siteData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">404</h1>
        <p className="text-xs mt-2 text-slate-500 font-mono uppercase">Node Deployment Address Invalid</p>
        <p className="text-xs mt-4 max-w-md text-slate-600 leading-relaxed">
          The requested routing destination subdomain "{subdomain}" does not map to any active production instance inside the database clusters.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex items-center justify-center antialiased">
      <div className="w-full max-w-4xl">
        {/* Start: Google Ad Manager Placeholder Slot (Top) */}
        {!isPremium && (
          <div className="w-full flex justify-center py-8 bg-slate-800 rounded-lg my-4 border border-slate-700">
            <div className="text-center text-slate-400 text-xs font-mono">
              <span>Google Ad Manager (728x90 / 320x50)</span>
              <p className="text-slate-500 text-[10px] mt-1">Dynamically Injected Ad Slot</p>
            </div>
          </div>
        )}
        {/* End: Google Ad Manager Placeholder Slot (Top) */}

        <DynamicRenderer layoutData={siteData.layout_data} />

        {/* Start: Google Ad Manager Placeholder Slot (Bottom) */}
        {!isPremium && (
          <div className="w-full flex justify-center py-8 bg-slate-800 rounded-lg my-4 border border-slate-700">
            <div className="text-center text-slate-400 text-xs font-mono">
              <span>Google Ad Manager (728x90 / 320x50)</span>
              <p className="text-slate-500 text-[10px] mt-1">Dynamically Injected Ad Slot</p>
            </div>
          </div>
        )}
        {/* End: Google Ad Manager Placeholder Slot (Bottom) */}
      </div>
    </div>
  );
}
// End: Public Multi-Tenant Viewer Component
