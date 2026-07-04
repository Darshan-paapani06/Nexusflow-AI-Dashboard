/**
 * Auth context — Supabase-ready, currently backed by local state.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  When Lovable Cloud is enabled, swap the MOCK block for the SUPABASE    │
 * │  block below. Every consumer (top bar, auth modal, capability gates)    │
 * │  keeps working — the public shape of `useAuth()` does not change.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppRole, AuthUser, Profile, Workspace } from "@/types/database";
import { can, type Capability } from "@/lib/auth/roles";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────
export interface Session {
  user: AuthUser;
  profile: Profile;
  workspace: Workspace;
  role: AppRole;
}

export interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: AppRole | null;
  can: (cap: Capability) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, workspaceName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────
// LocalStorage session persistence (mock backing store)
// ─────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "nexusflow.mock.session";

function readMockSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeMockSession(session: Session | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
}

function makeMockSession(email: string, workspaceName = "NexusFlow HQ", role: AppRole = "admin"): Session {
  const now = new Date().toISOString();
  const uid = crypto.randomUUID();
  const wid = crypto.randomUUID();
  return {
    user: { id: uid, email, created_at: now },
    profile: {
      id: uid,
      display_name: email.split("@")[0],
      avatar_url: null,
      workspace_id: wid,
      created_at: now,
    },
    workspace: {
      id: wid,
      name: workspaceName,
      slug: workspaceName.toLowerCase().replace(/\s+/g, "-"),
      owner_id: uid,
      ai_frequency: "hourly",
      created_at: now,
    },
    role,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // ── MOCK: hydrate from localStorage ────────────────────────────────────
  // ── SUPABASE (swap-in):
  //   useEffect(() => {
  //     const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
  //       if (!sess) { setSession(null); setLoading(false); return; }
  //       // defer profile+role fetch to avoid deadlocking the auth callback
  //       setTimeout(async () => {
  //         const [{ data: profile }, { data: roles }, { data: workspace }] = await Promise.all([
  //           supabase.from("profiles").select("*").eq("id", sess.user.id).maybeSingle(),
  //           supabase.from("user_roles").select("role, workspace_id").eq("user_id", sess.user.id),
  //           supabase.from("workspaces").select("*").eq("owner_id", sess.user.id).maybeSingle(),
  //         ]);
  //         setSession(profile && workspace ? { user: sess.user, profile, workspace, role: roles?.[0]?.role ?? "member" } : null);
  //         setLoading(false);
  //       }, 0);
  //     });
  //     supabase.auth.getSession(); // trigger initial callback
  //     return () => sub.subscription.unsubscribe();
  //   }, []);
  useEffect(() => {
    setSession(readMockSession());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // ── SUPABASE: await supabase.auth.signInWithPassword({ email, password });
    const s = makeMockSession(email);
    writeMockSession(s);
    setSession(s);
  }, []);

  const signUp = useCallback(async (email: string, _password: string, workspaceName: string) => {
    // ── SUPABASE:
    //   const { data, error } = await supabase.auth.signUp({
    //     email, password,
    //     options: {
    //       emailRedirectTo: `${window.location.origin}/`,
    //       data: { display_name: email.split("@")[0], workspace_name: workspaceName },
    //     },
    //   });
    //   // Workspace + admin role are typically created via a DB trigger or
    //   // an edge function after signup — see schema.sql.
    const s = makeMockSession(email, workspaceName, "admin");
    writeMockSession(s);
    setSession(s);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // ── SUPABASE (Lovable-brokered — see tanstack-supabase-integration):
    //   await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    const s = makeMockSession("founder@nexusflow.ai");
    writeMockSession(s);
    setSession(s);
  }, []);

  const signOut = useCallback(async () => {
    // ── SUPABASE:
    //   await queryClient.cancelQueries();
    //   queryClient.clear();
    //   await supabase.auth.signOut();
    writeMockSession(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    loading,
    isAuthenticated: !!session,
    role: session?.role ?? null,
    can: (cap) => can(session?.role, cap),
    signIn, signUp, signInWithGoogle, signOut,
  }), [session, loading, signIn, signUp, signInWithGoogle, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
