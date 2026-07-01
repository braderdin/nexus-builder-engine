// Start: Enterprise Database Model Interfaces
export interface MerchantProfile {
  id: string;
  updated_at: string;
  display_username: string | null;
  is_premium: boolean;
}

export interface DeployedSiteConfiguration {
  id?: string;
  user_id: string;
  subdomain: string;
  seo_title: string;
  seo_description: string;
  whatsapp_number: string;
  layout_data: Record<string, any>; // Strictly maps the dynamic structural JSON
  created_at?: string;
  updated_at?: string;
}
// End: Enterprise Database Model Interfaces