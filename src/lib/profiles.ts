import { supabase } from "@/lib/supabase/client";

export interface CompanyOption {
  userId: string;
  label: string;
}

export function getProfileLabel(profile: {
  company_name: string | null;
  email: string | null;
  id: string;
}): string {
  if (profile.company_name?.trim()) return profile.company_name.trim();
  if (profile.email?.trim()) return profile.email.trim();
  return profile.id;
}

export async function fetchCompanyOptions(): Promise<CompanyOption[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, company_name, email")
    .order("company_name", { ascending: true });

  if (error || !data) return [];

  return data.map((p) => ({
    userId: p.id,
    label: getProfileLabel(p),
  }));
}
