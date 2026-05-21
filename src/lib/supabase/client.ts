import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

const { url, anonKey } = getSupabaseEnv();

export const supabase = createBrowserClient(url, anonKey);
