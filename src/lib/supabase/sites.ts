// Start: Client Engine SDK and Schema Dependency Imports
import { supabase } from "./client";
import { DeployedSiteConfiguration } from "@/types/site";
import { siteConfigSchema } from "@/lib/validations/site";
// End: Client Engine SDK and Schema Dependency Imports

// Start: Core Merchant Site Deployment Controller
/**
 * Persists a new merchant website blueprint architecture down into Supabase
 */
export const deployMerchantWebsiteBlueprint = async (
  sitePayload: DeployedSiteConfiguration
): Promise<{ data: any; error: any }> => {
  
  // Start: Dynamic Security Serialization Pre-flight Check
  try {
    siteConfigSchema.parse({
      subdomain: sitePayload.subdomain,
      seoTitle: sitePayload.seo_title,
      seoDescription: sitePayload.seo_description,
      whatsappNumber: sitePayload.whatsapp_number,
      themeLayoutJson: JSON.stringify(sitePayload.layout_data),
    });
  } catch (zodValidationError: any) {
    // Correctly structured return payload to capture schema failures early
    return { data: null, error: zodValidationError };
  }
  // End: Dynamic Security Serialization Pre-flight Check

  // Start: Supabase Target Table Ingestion Execution
  const { data, error } = await supabase
    .from("sites")
    .insert([
      {
        user_id: sitePayload.user_id,
        subdomain: sitePayload.subdomain,
        seo_title: sitePayload.seo_title,
        seo_description: sitePayload.seo_description,
        whatsapp_number: sitePayload.whatsapp_number,
        layout_data: sitePayload.layout_data,
      },
    ])
    .select()
    .single();
  // End: Supabase Target Table Ingestion Execution

  return { data, error };
};
// End: Core Merchant Site Deployment Controller

// Start: Get Merchant Website By Subdomain Controller
/**
 * Queries the public.sites table and retrieves the fluid layout_data JSONB payload
 * along with its relational owner profile data, specifically the is_premium status.
 */
export const getMerchantWebsiteBySubdomain = async (
  subdomain: string
): Promise<{ data: any | null; error: any | null }> => {
  const { data, error } = await supabase
    .from("sites")
    .select(
      `
      layout_data,
      seo_title,
      seo_description,
      profiles (is_premium)
      `
    )
    .eq("subdomain", subdomain)
    .single();

  if (error) {
    return { data: null, error };
  }

  // Flatten the profile data for easier access
  const siteDataWithPremium = {
    ...data,
    is_premium: data.profiles?.is_premium || false,
  };

  return { data: siteDataWithPremium, error: null };
};
// End: Get Merchant Website By Subdomain Controller

// Start: Get User Active Sites Count Controller
/**
 * Securely counts the total rows matching the user_id in the public.sites table.
 */
export const getUserActiveSitesCount = async (
  userId: string
): Promise<{ count: number | null; error: any | null }> => {
  const { count, error } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true }) // Using head: true for efficiency to only get count
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching active sites count:", error);
    return { count: null, error };
  }

  return { count, error: null };
};
// End: Get User Active Sites Count Controller

// Start: Get User Deployed Sites Controller
/**
 * Retrieves all deployed sites for a given user, returning subdomain and creation date.
 */
export const getUserDeployedSites = async (
  userId: string
): Promise<{ data: Array<{ subdomain: string; created_at: string; seo_title: string }> | null; error: any | null }> => {
  const { data, error } = await supabase
    .from("sites")
    .select("subdomain, created_at, seo_title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }); // Order by creation date, newest first

  if (error) {
    console.error("Error fetching user deployed sites:", error);
    return { data: null, error };
  }

  return { data: data as Array<{ subdomain: string; created_at: string; seo_title: string }>, error: null };
};
// End: Get User Deployed Sites Controller

// Start: Subdomain Availability Checker
/**
 * Queries the public.sites table to verify if the requested subdomain already exists.
 * Returns true if the subdomain is taken, false otherwise.
 */
export const checkSubdomainAvailability = async (
  subdomain: string
): Promise<boolean> => {
  const { count, error } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("subdomain", subdomain);

  if (error) {
    console.error("Error checking subdomain availability:", error);
    // In case of an error, assume it's taken or unavailable to prevent conflicts.
    return true;
  }

  return (count || 0) > 0; // If count > 0, it means the subdomain is taken.
};
// End: Subdomain Availability Checker
