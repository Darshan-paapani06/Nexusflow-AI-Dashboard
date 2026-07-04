import type { AppRole } from "@/types/database";

/**
 * Role hierarchy — higher index = more privilege.
 * Admins can do everything Managers and Members can; Managers inherit Member.
 */
export const ROLE_HIERARCHY: AppRole[] = ["member", "manager", "admin"];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Admin",
  manager: "Manager",
  member: "Member",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  admin: "Full control over workspace, billing, roles, and destructive actions.",
  manager: "Create and manage projects, tasks, and alerts; cannot change billing or roles.",
  member: "Contribute to tasks, view analytics, and receive AI insights.",
};

export function roleRank(role: AppRole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/** True when `have` satisfies the minimum `required` role. */
export function hasAtLeastRole(have: AppRole | null | undefined, required: AppRole): boolean {
  if (!have) return false;
  return roleRank(have) >= roleRank(required);
}

/**
 * Capability map — the single source of truth for what each role can do.
 * Bind UI actions to a capability, NEVER a raw role check, so future role
 * tweaks stay in one place.
 */
export type Capability =
  | "workspace:update"
  | "roles:manage"
  | "project:create"
  | "project:delete"
  | "task:create"
  | "task:delete"
  | "alert:resolve"
  | "insight:generate"
  | "analytics:view";

const CAPABILITY_MIN_ROLE: Record<Capability, AppRole> = {
  "workspace:update": "admin",
  "roles:manage": "admin",
  "project:create": "manager",
  "project:delete": "admin",
  "task:create": "member",
  "task:delete": "manager",
  "alert:resolve": "manager",
  "insight:generate": "member",
  "analytics:view": "member",
};

export function can(role: AppRole | null | undefined, capability: Capability): boolean {
  return hasAtLeastRole(role, CAPABILITY_MIN_ROLE[capability]);
}
