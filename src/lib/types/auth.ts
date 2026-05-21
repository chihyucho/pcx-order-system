export interface AppUser {
  id: string;
  email: string;
  role: "admin" | "user";
  companyName: string;
}

export function getRedirectPathForRole(role: AppUser["role"]): string {
  return role === "admin" ? "/admin" : "/dashboard";
}
