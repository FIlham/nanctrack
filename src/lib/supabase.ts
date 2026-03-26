import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if configured (not placeholder and not empty)
const isConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("placeholder") && 
  !supabaseAnonKey.includes("placeholder") &&
  supabaseUrl.trim() !== "" &&
  supabaseAnonKey.trim() !== ""
);

// Check for server-side only variables that might have been misnamed
const isServerOnlyUrlSet = !!process.env.SUPABASE_URL;
const isServerOnlyKeySet = !!process.env.SUPABASE_ANON_KEY;
const hasPrefixIssue = (isServerOnlyUrlSet && !supabaseUrl) || (isServerOnlyKeySet && !supabaseAnonKey);

// Check for common key issues (e.g., using service_role key instead of anon)
// This is a heuristic, but often helpful.
const isServiceRoleKey = supabaseAnonKey?.includes("service_role") || (supabaseAnonKey && supabaseAnonKey.length > 200);
const hasKeyIssue = isServiceRoleKey;

if (!isConfigured) {
  console.warn("Supabase credentials not found or invalid. Please ensure you have set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Settings menu.");
}

// Ensure we always pass a valid-looking URL to createClient to avoid crashing
// If it's missing the protocol, add it.
let rawUrl = supabaseUrl?.trim() || "";
if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
  rawUrl = `https://${rawUrl}`;
}

// Strip common incorrect suffixes like /rest/v1 or /auth/v1
let finalUrl = rawUrl;
if (finalUrl) {
  finalUrl = finalUrl.replace(/\/rest\/v1\/?$/, "");
  finalUrl = finalUrl.replace(/\/auth\/v1\/?$/, "");
  finalUrl = finalUrl.replace(/\/$/, ""); // Strip trailing slash
}

if (!finalUrl || finalUrl.includes("placeholder")) {
  finalUrl = "https://placeholder-project.supabase.co";
}

export const supabase = createClient(
  finalUrl,
  supabaseAnonKey?.trim() || "placeholder-key"
);

export { isConfigured as isSupabaseConfigured, finalUrl as supabaseUrl, hasPrefixIssue, hasKeyIssue, isServiceRoleKey };
