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