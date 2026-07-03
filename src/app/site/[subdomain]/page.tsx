"use client";

// Start: Core React and Navigation Dependency Imports
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// End: Core React and Navigation Dependency Imports

// Start: Infrastructure and Sub-Component Engine Imports
import { supabase } from "@/lib/supabase/client";
import DynamicRenderer from "@/components/templates/DynamicRenderer";
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
        // Start: Fetch site data including user_id to link to profile
        const { data: siteQueryResult, error: siteError } = await supabase
          .from("sites")
          .select("layout_data, seo_title, seo_description, user_id") // Added user_id
          .eq("subdomain", subdomain)
          .single();

        if (siteError) throw siteError;
        
        setSiteData(siteQueryResult);
        
        // Dynamic Single Page Browser Title Overwrite
        if (siteQueryResult.seo_title) {
          document.title = siteQueryResult.seo_title;
        }

        // Start: Fetch merchant profile to determine premium status
        if (siteQueryResult.user_id) {
          const { data: profileQueryResult, error: profileError } = await supabase
            .from("profiles")
            .select("is_premium")
            .eq("id", siteQueryResult.user_id)
            .single();

          if (profileError) {
            console.error("Error fetching merchant profile:", profileError.message);
            setIsPremium(false); // Revert to non-premium if profile fetch fails
          } else {
            setIsPremium(profileQueryResult?.is_premium || false);
          }
        } else {
          setIsPremium(false); // Revert to non-premium if user_id is missing
        }
        // End: Fetch merchant profile to determine premium status

      } catch (fetchError: any) {
        setErrorState(fetchError.message || "Target site configuration deployment missing.");
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
