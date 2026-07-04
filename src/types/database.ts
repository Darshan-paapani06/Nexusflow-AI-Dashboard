/**
 * NexusFlow database models.
 *
 * These types mirror the tables defined in `src/lib/supabase/schema.sql`.
 * Once Lovable Cloud is enabled, regenerate `src/integrations/supabase/types.ts`
 * and re-export the row types from there — the app code stays the same.
 *
 *   import type { Database } from "@/integrations/supabase/types";
 *   export type Task = Database["public"]["Tables"]["tasks"]["Row"];
 */

export type UUID = string;
export type ISODateString = string;

// ─── Roles ────────────────────────────────────────────────────────────────
export type AppRole = "admin" | "manager" | "member";

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: UUID;
  email: string;
  created_at: ISODateString;
}

export interface Profile {
  id: UUID;                 // FK → auth.users.id
  display_name: string;
  avatar_url: string | null;
  workspace_id: UUID;
  created_at: ISODateString;
}

export interface UserRole {
  id: UUID;
  user_id: UUID;            // FK → auth.users.id
  role: AppRole;
  workspace_id: UUID;
}

// ─── Workspace ────────────────────────────────────────────────────────────
export interface Workspace {
  id: UUID;
  name: string;
  slug: string;
  owner_id: UUID;
  ai_frequency: "realtime" | "hourly" | "daily";
  created_at: ISODateString;
}

// ─── Projects & Tasks ─────────────────────────────────────────────────────
export type ProjectStatus = "active" | "at_risk" | "on_hold" | "completed";

export interface Project {
  id: UUID;
  workspace_id: UUID;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;                 // 0–100
  owner_id: UUID;
  due_date: ISODateString | null;
  created_at: ISODateString;
}

export type TaskStatus = "backlog" | "progress" | "review" | "completed";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: UUID;
  workspace_id: UUID;
  project_id: UUID | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  owner_id: UUID | null;
  progress: number;                 // 0–100
  due_date: ISODateString | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

// ─── Team ─────────────────────────────────────────────────────────────────
export type MemberStatus = "online" | "focus" | "away" | "offline";

export interface TeamMember {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  role_title: string;               // "Product Manager", "AI Engineer", ...
  productivity_score: number;       // 0–100
  completed_tasks: number;
  current_project_id: UUID | null;
  status: MemberStatus;
}

// ─── Analytics ────────────────────────────────────────────────────────────
export type MetricKey =
  | "monthly_revenue"
  | "active_users"
  | "project_completion"
  | "team_productivity"
  | "risk_score"
  | "ai_confidence";

export interface AnalyticsMetric {
  id: UUID;
  workspace_id: UUID;
  key: MetricKey;
  value: number;
  delta_pct: number;                // vs. prior period
  recorded_at: ISODateString;
}

// ─── AI Insights ──────────────────────────────────────────────────────────
export type InsightKind = "generate" | "risk" | "next";

export interface AIInsight {
  id: UUID;
  workspace_id: UUID;
  kind: InsightKind;
  title: string;
  body: string;
  confidence: number;               // 0–100
  sources: string[];
  created_at: ISODateString;
}

// ─── Alerts ───────────────────────────────────────────────────────────────
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface Alert {
  id: UUID;
  workspace_id: UUID;
  title: string;
  description: string;
  severity: AlertSeverity;
  resolved: boolean;
  resolved_by: UUID | null;
  resolved_at: ISODateString | null;
  created_at: ISODateString;
}
