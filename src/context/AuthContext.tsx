"use client";

import { supabase } from "@/lib/supabase/client";
import { getRedirectPathForRole, type AppUser } from "@/lib/types/auth";
import { getProfileLabel } from "@/lib/profiles";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: AppUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

type ResolveResult =
  | { ok: true; user: AppUser }
  | { ok: false; reason: "missing" | "forbidden" | "invalid_role" };

async function resolveAppUser(authUser: User): Promise<ResolveResult> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, company_name, email")
    .eq("id", authUser.id)
    .single();

  if (error) {
    const code = (error as { code?: string }).code;
    if (code === "PGRST116") {
      return { ok: false, reason: "missing" };
    }
    if (code === "42501" || /permission|policy/i.test(error.message)) {
      return { ok: false, reason: "forbidden" };
    }
    return { ok: false, reason: "missing" };
  }

  if (!profile) {
    return { ok: false, reason: "missing" };
  }

  const role = profile.role as AppUser["role"];
  if (role !== "user" && role !== "admin") {
    return { ok: false, reason: "invalid_role" };
  }

  return {
    ok: true,
    user: {
      id: authUser.id,
      email: authUser.email ?? "",
      role,
      companyName: getProfileLabel({
        id: authUser.id,
        company_name: profile.company_name,
        email: profile.email ?? authUser.email,
      }),
    },
  };
}

function profileErrorMessage(
  reason: "missing" | "forbidden" | "invalid_role",
): string {
  switch (reason) {
    case "forbidden":
      return (
        "Signed in, but your profile could not be read (RLS policy). In Supabase SQL Editor, " +
        "run supabase/migrations/20260515190000_admin_read_profiles.sql so users can read their own profile."
      );
    case "invalid_role":
      return 'Profile role must be exactly "user" or "admin".';
    default:
      return (
        "Signed in, but no profile row was found. In Supabase → Authentication → Users, copy the user UUID, " +
        'then insert into public.profiles with the same id and role "user" or "admin". You do not need to recreate the auth user.'
      );
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (authUser: User | null) => {
      if (!mounted) return;

      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const resolved = await resolveAppUser(authUser);
      if (!mounted) return;

      setUser(resolved.ok ? resolved.user : null);
      setIsLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const hint =
          error.message === "Invalid login credentials"
            ? "Invalid email or password. This app uses Supabase Auth — demo emails only work if you created them in the Supabase dashboard."
            : error.message;
        return { ok: false, error: hint };
      }

      if (!data.user) {
        return { ok: false, error: "Sign-in failed" };
      }

      const resolved = await resolveAppUser(data.user);
      if (!resolved.ok) {
        return { ok: false, error: profileErrorMessage(resolved.reason) };
      }

      setUser(resolved.user);
      router.replace(getRedirectPathForRole(resolved.user.role));
      return { ok: true };
    },
    [router],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  }, [router]);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
