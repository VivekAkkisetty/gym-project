import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * SECURITY GUARD:
 * This client is exclusively for trusted server-side execution (e.g. administrative tasks, webhooks, cron jobs).
 * NEVER import this file into a client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (typeof window !== "undefined") {
    throw new Error("CRITICAL SECURITY ERROR: Attempted to instantiate Supabase Admin Client in a browser context!");
  }

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server environment.");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
