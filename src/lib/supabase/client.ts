// Start: Supabase Official SDK Imports
import { createClient } from "@supabase/supabase-js";
// End: Supabase Official SDK Imports

// Start: Environment Variable Structural Extraction
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// End: Environment Variable Structural Extraction

// Start: Strict Global Configuration Verification
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Critical Error: Missing Supabase environment configuration. Verify your local .env.local file initialization status."
  );
}
// End: Strict Global Configuration Verification

// Start: Initialize Global Supabase Client Instance
/**
 * Core singleton client instance handling application-wide authentication pipelines
 * and basic non-privileged database operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Auto-saves user login sessions into the browser cookies/localStorage
    autoRefreshToken: true, // Prevents sudden logouts by handling token renewal dynamically
    detectSessionInUrl: true, // Essential requirement for standard Google/Facebook OAuth callback loops
  },
});
// End: Initialize Global Supabase Client Instance