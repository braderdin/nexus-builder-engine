"use server";

import { supabase } from "@/lib/supabase/client";
import { siteConfigSchema } from "@/lib/validations/site";
import { sanitizeUserTextInput } from "@/lib/validations/fileUpload";
import { PostgrestError } from "@supabase/supabase-js";

interface UpdateSiteConfigParams {
  userId: string;
  subdomain: string;
  seoTitle: string;
  seoDescription: string;
  whatsappNumber: string;
  layoutData: Record<string, any>;
}

export async function updateMerchantSiteConfiguration({
  userId,
  subdomain,
  seoTitle,
  seoDescription,
  whatsappNumber,
  layoutData,
}: UpdateSiteConfigParams): Promise<{ data: any | null; error: { message: string } | null }> {
  // Sanitize all string inputs
  const sanitizedSubdomain = sanitizeUserTextInput(subdomain);
  const sanitizedSeoTitle = sanitizeUserTextInput(seoTitle);
  const sanitizedSeoDescription = sanitizeUserTextInput(seoDescription);
  const sanitizedWhatsappNumber = sanitizeUserTextInput(whatsappNumber);
  const sanitizedLayoutDataString = sanitizeUserTextInput(JSON.stringify(layoutData));

  // Validate inputs using Zod schema
  try {
    siteConfigSchema.parse({
      subdomain: sanitizedSubdomain,
      seoTitle: sanitizedSeoTitle,
      seoDescription: sanitizedSeoDescription,
      whatsappNumber: sanitizedWhatsappNumber,
      themeLayoutJson: sanitizedLayoutDataString,
    });
  } catch (validationError: any) {
    console.error("Validation Error:", validationError.errors);
    return { data: null, error: { message: validationError.errors[0].message || "Validation failed." } };
  }

  // Perform upsert operation
  const { data, error } = await supabase
    .from("sites")
    .upsert(
      {
        user_id: userId,
        subdomain: sanitizedSubdomain,
        seo_title: sanitizedSeoTitle,
        seo_description: sanitizedSeoDescription,
        whatsapp_number: sanitizedWhatsappNumber,
        layout_data: sanitizedLayoutDataString, // Supabase will store this as JSONB
      },
      { onConflict: "user_id,subdomain" } // Upsert based on user_id and subdomain
    )
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert error:", error);
    return { data: null, error: { message: error.message } };
  }

  return { data, error: null };
}
