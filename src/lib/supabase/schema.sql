-- ============================================================================
-- NexusFlow AI — reference schema for Lovable Cloud (Supabase)
-- ----------------------------------------------------------------------------
-- Apply this via the migration tool once Lovable Cloud is enabled. Every table
-- lives in the `public` schema and follows the mandatory ORDER:
--   1) CREATE TABLE
--   2) GRANT
--   3) ENABLE ROW LEVEL SECURITY
--   4) CREATE POLICY
--
-- Roles are stored in a dedicated `user_roles` table (never on profiles) and
-- gated through the SECURITY DEFINER function `public.has_role(...)` to avoid
-- recursive RLS. See `src/lib/auth/roles.ts` for the client-side helpers.
-- ============================================================================

-- ─── ENUMS ──────────────────────────────────────────────────────────────────
create type public.app_role as enum ('admin', 'manager', 'member');
create type public.project_status as enum ('active', 'at_risk', 'on_hold', 'completed');
create type public.task_status as enum ('backlog', 'progress', 'review', 'completed');
create type public.task_priority as enum ('low', 'medium', 'high', 'critical');
create type public.member_status as enum ('online', 'focus', 'away', 'offline');
create type public.metric_key as enum (
  'monthly_revenue', 'active_users', 'project_completion',
  'team_productivity', 'risk_score', 'ai_confidence'
);
create type public.insight_kind as enum ('generate', 'risk', 'next');
create type public.alert_severity as enum ('low', 'medium', 'high', 'critical');
create type public.ai_frequency as enum ('realtime', 'hourly', 'daily');


-- ─── WORKSPACES ─────────────────────────────────────────────────────────────
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  ai_frequency public.ai_frequency not null default 'hourly',
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.workspaces to authenticated;
grant all on public.workspaces to service_role;

alter table public.workspaces enable row level security;


-- ─── PROFILES ───────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  workspace_id uuid references public.workspaces(id) on delete set null,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;


-- ─── USER ROLES (scoped per workspace) ──────────────────────────────────────
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, workspace_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;


-- SECURITY DEFINER — the ONLY safe way to check a role from an RLS policy.
create or replace function public.has_role(
  _user_id uuid,
  _workspace_id uuid,
  _role public.app_role
) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and workspace_id = _workspace_id
      and role = _role
  )
$$;

-- Convenience: is caller a member of the given workspace, any role?
create or replace function public.is_workspace_member(
  _user_id uuid,
  _workspace_id uuid
) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and workspace_id = _workspace_id
  )
$$;


-- ─── PROJECTS ───────────────────────────────────────────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  status public.project_status not null default 'active',
  progress integer not null default 0 check (progress between 0 and 100),
  owner_id uuid references auth.users(id) on delete set null,
  due_date date,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;

alter table public.projects enable row level security;


-- ─── TASKS ──────────────────────────────────────────────────────────────────
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  status public.task_status not null default 'backlog',
  priority public.task_priority not null default 'medium',
  owner_id uuid references auth.users(id) on delete set null,
  progress integer not null default 0 check (progress between 0 and 100),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;

alter table public.tasks enable row level security;


-- ─── TEAM MEMBERS (denormalised view of workspace + user + role) ───────────
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_title text not null,
  productivity_score integer not null default 0 check (productivity_score between 0 and 100),
  completed_tasks integer not null default 0,
  current_project_id uuid references public.projects(id) on delete set null,
  status public.member_status not null default 'offline',
  unique (workspace_id, user_id)
);

grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;

alter table public.team_members enable row level security;


-- ─── ANALYTICS METRICS ─────────────────────────────────────────────────────
create table public.analytics_metrics (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  key public.metric_key not null,
  value numeric not null,
  delta_pct numeric not null default 0,
  recorded_at timestamptz not null default now()
);

grant select, insert on public.analytics_metrics to authenticated;
grant all on public.analytics_metrics to service_role;

alter table public.analytics_metrics enable row level security;


-- ─── AI INSIGHTS ───────────────────────────────────────────────────────────
create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  kind public.insight_kind not null,
  title text not null,
  body text not null,
  confidence integer not null default 0 check (confidence between 0 and 100),
  sources text[] not null default '{}',
  created_at timestamptz not null default now()
);

grant select, insert on public.ai_insights to authenticated;
grant all on public.ai_insights to service_role;

alter table public.ai_insights enable row level security;


-- ─── ALERTS ────────────────────────────────────────────────────────────────
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  description text not null,
  severity public.alert_severity not null default 'medium',
  resolved boolean not null default false,
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.alerts to authenticated;
grant all on public.alerts to service_role;

alter table public.alerts enable row level security;


-- ============================================================================
-- RLS POLICIES
-- ----------------------------------------------------------------------------
-- Every table is workspace-scoped. Standard shape:
--   SELECT / write for workspace members
--   Destructive ops (delete, update-any) gated behind Admin or Manager
-- ============================================================================

-- Profiles: users read + update their OWN row
create policy "profiles_self_select" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_self_update" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "profiles_self_insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());

-- Workspaces
create policy "workspaces_member_select" on public.workspaces
  for select to authenticated using (public.is_workspace_member(auth.uid(), id));
create policy "workspaces_admin_update" on public.workspaces
  for update to authenticated using (public.has_role(auth.uid(), id, 'admin'));

-- User roles: caller reads roles inside workspaces they belong to; only admins mutate.
create policy "user_roles_member_select" on public.user_roles
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "user_roles_admin_write" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), workspace_id, 'admin'))
  with check (public.has_role(auth.uid(), workspace_id, 'admin'));

-- Projects
create policy "projects_member_select" on public.projects
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "projects_manager_write" on public.projects
  for insert to authenticated
  with check (
    public.has_role(auth.uid(), workspace_id, 'manager')
    or public.has_role(auth.uid(), workspace_id, 'admin')
  );
create policy "projects_manager_update" on public.projects
  for update to authenticated
  using (
    public.has_role(auth.uid(), workspace_id, 'manager')
    or public.has_role(auth.uid(), workspace_id, 'admin')
  );
create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using (public.has_role(auth.uid(), workspace_id, 'admin'));

-- Tasks: any member reads/creates/updates; only admins/managers delete
create policy "tasks_member_select" on public.tasks
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "tasks_member_insert" on public.tasks
  for insert to authenticated with check (public.is_workspace_member(auth.uid(), workspace_id));
create policy "tasks_member_update" on public.tasks
  for update to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "tasks_manager_delete" on public.tasks
  for delete to authenticated
  using (
    public.has_role(auth.uid(), workspace_id, 'manager')
    or public.has_role(auth.uid(), workspace_id, 'admin')
  );

-- Team members
create policy "team_members_member_select" on public.team_members
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "team_members_admin_write" on public.team_members
  for all to authenticated
  using (public.has_role(auth.uid(), workspace_id, 'admin'))
  with check (public.has_role(auth.uid(), workspace_id, 'admin'));

-- Analytics metrics (read-only for members; writes typically via edge job/service_role)
create policy "analytics_member_select" on public.analytics_metrics
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));

-- AI insights
create policy "ai_insights_member_select" on public.ai_insights
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "ai_insights_member_insert" on public.ai_insights
  for insert to authenticated with check (public.is_workspace_member(auth.uid(), workspace_id));

-- Alerts
create policy "alerts_member_select" on public.alerts
  for select to authenticated using (public.is_workspace_member(auth.uid(), workspace_id));
create policy "alerts_manager_update" on public.alerts
  for update to authenticated
  using (
    public.has_role(auth.uid(), workspace_id, 'manager')
    or public.has_role(auth.uid(), workspace_id, 'admin')
  );


-- ─── PROFILE AUTO-CREATE TRIGGER ────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
