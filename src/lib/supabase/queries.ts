/**
 * Data access layer — Supabase-ready query placeholders.
 *
 * Each function represents one call site in the UI. Every body currently
 * returns local mock data so the frontend keeps working without a backend.
 *
 * When Lovable Cloud is enabled, replace the `// MOCK` body with the
 * corresponding `// SUPABASE` snippet. Return types and function signatures
 * are the contract — do not change them, so components stay untouched.
 *
 *   import { supabase } from "@/integrations/supabase/client";
 */

import type {
  AIInsight, Alert, AnalyticsMetric, Project, Task, TeamMember, UUID, Workspace,
} from "@/types/database";
import { kpis, alerts as mockAlerts, insightSamples, initialTasks, team } from "@/lib/mock-data";

// ─── Analytics ────────────────────────────────────────────────────────────
export async function fetchMetrics(_workspaceId: UUID): Promise<AnalyticsMetric[]> {
  // SUPABASE:
  //   const { data, error } = await supabase
  //     .from("analytics_metrics")
  //     .select("*")
  //     .eq("workspace_id", _workspaceId)
  //     .order("recorded_at", { ascending: false });
  //   if (error) throw error;
  //   return data;
  return kpis.map((k) => ({
    id: crypto.randomUUID(),
    workspace_id: _workspaceId,
    key: (k.id === "rev" ? "monthly_revenue"
      : k.id === "users" ? "active_users"
      : k.id === "proj" ? "project_completion"
      : k.id === "prod" ? "team_productivity"
      : k.id === "risk" ? "risk_score" : "ai_confidence"),
    value: k.value,
    delta_pct: k.delta,
    recorded_at: new Date().toISOString(),
  }));
}

// ─── Tasks ────────────────────────────────────────────────────────────────
export async function fetchTasks(_workspaceId: UUID): Promise<Task[]> {
  // SUPABASE:
  //   const { data, error } = await supabase
  //     .from("tasks").select("*")
  //     .eq("workspace_id", _workspaceId)
  //     .order("created_at", { ascending: false });
  //   if (error) throw error;
  //   return data;
  const now = new Date().toISOString();
  return initialTasks.map((t) => ({
    id: t.id, workspace_id: _workspaceId, project_id: null, title: t.title,
    description: null, status: t.status, priority: t.priority,
    owner_id: null, progress: t.progress, due_date: null,
    created_at: now, updated_at: now,
  }));
}

export async function createTask(_workspaceId: UUID, input: Partial<Task>): Promise<Task> {
  // SUPABASE:
  //   const { data, error } = await supabase.from("tasks")
  //     .insert({ ...input, workspace_id: _workspaceId })
  //     .select().single();
  //   if (error) throw error;
  //   return data;
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    workspace_id: _workspaceId,
    project_id: input.project_id ?? null,
    title: input.title ?? "Untitled",
    description: input.description ?? null,
    status: input.status ?? "backlog",
    priority: input.priority ?? "medium",
    owner_id: input.owner_id ?? null,
    progress: input.progress ?? 0,
    due_date: input.due_date ?? null,
    created_at: now, updated_at: now,
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────
export async function fetchProjects(_workspaceId: UUID): Promise<Project[]> {
  // SUPABASE: from("projects").select("*").eq("workspace_id", _workspaceId)
  return [];
}

// ─── Alerts ───────────────────────────────────────────────────────────────
export async function fetchAlerts(_workspaceId: UUID): Promise<Alert[]> {
  // SUPABASE: from("alerts").select("*").eq("workspace_id", _workspaceId).eq("resolved", false)
  return mockAlerts.map((a) => ({
    id: a.id, workspace_id: _workspaceId, title: a.title, description: a.desc,
    severity: a.severity, resolved: false, resolved_by: null, resolved_at: null,
    created_at: new Date().toISOString(),
  }));
}

export async function resolveAlert(_id: UUID, _userId: UUID): Promise<void> {
  // SUPABASE:
  //   const { error } = await supabase.from("alerts")
  //     .update({ resolved: true, resolved_by: _userId, resolved_at: new Date().toISOString() })
  //     .eq("id", _id);
  //   if (error) throw error;
}

// ─── Team ─────────────────────────────────────────────────────────────────
export async function fetchTeamMembers(_workspaceId: UUID): Promise<TeamMember[]> {
  // SUPABASE:
  //   from("team_members").select("*, profile:profiles(display_name, avatar_url)")
  //     .eq("workspace_id", _workspaceId)
  return team.map((m) => ({
    id: crypto.randomUUID(),
    workspace_id: _workspaceId,
    user_id: crypto.randomUUID(),
    role_title: m.role,
    productivity_score: m.score,
    completed_tasks: m.tasks,
    current_project_id: null,
    status: m.status as TeamMember["status"],
  }));
}

// ─── AI Insights ──────────────────────────────────────────────────────────
export async function fetchInsights(_workspaceId: UUID): Promise<AIInsight[]> {
  // SUPABASE: from("ai_insights").select("*").eq("workspace_id", _workspaceId)
  //   .order("created_at", { ascending: false }).limit(20)
  return [];
}

export async function generateInsight(
  _workspaceId: UUID,
  kind: "generate" | "risk" | "next",
): Promise<AIInsight> {
  // SUPABASE:
  //   1) call an edge function that runs the AI model + writes to `ai_insights`
  //   2) return the new row
  //   OR: use Lovable AI Gateway directly from a server function and insert.
  const body = insightSamples[kind][Math.floor(Math.random() * insightSamples[kind].length)];
  return {
    id: crypto.randomUUID(),
    workspace_id: _workspaceId,
    kind,
    title: kind === "generate" ? "New insight" : kind === "risk" ? "Risk analysis" : "Recommended action",
    body,
    confidence: 90 + Math.floor(Math.random() * 10),
    sources: ["fct_revenue", "product_events", "atlas_project"],
    created_at: new Date().toISOString(),
  };
}

// ─── Workspace ────────────────────────────────────────────────────────────
export async function updateWorkspace(_id: UUID, _patch: Partial<Workspace>): Promise<void> {
  // SUPABASE:
  //   const { error } = await supabase.from("workspaces").update(_patch).eq("id", _id);
  //   if (error) throw error;
}
