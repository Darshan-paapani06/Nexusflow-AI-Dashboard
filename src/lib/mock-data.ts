export type KPI = { id: string; label: string; value: number; prefix?: string; suffix?: string; delta: number; spark: number[]; accent: string };

export const kpis: KPI[] = [
  { id: "rev", label: "Monthly Revenue", value: 1284500, prefix: "$", delta: 18.4, spark: [40,42,48,45,52,60,58,68,72,78,82,90], accent: "cyan" },
  { id: "users", label: "Active Users", value: 48210, delta: 12.1, spark: [30,32,35,38,40,42,44,48,52,54,58,62], accent: "violet" },
  { id: "proj", label: "Project Completion", value: 87, suffix: "%", delta: 4.2, spark: [60,64,68,70,72,74,78,80,82,84,86,87], accent: "emerald" },
  { id: "prod", label: "Team Productivity", value: 92, suffix: "%", delta: 6.7, spark: [70,72,75,78,80,82,84,86,88,90,91,92], accent: "amber" },
  { id: "risk", label: "Risk Score", value: 23, suffix: "/100", delta: -8.3, spark: [45,42,40,38,36,34,32,30,28,26,25,23], accent: "rose" },
  { id: "ai", label: "AI Confidence", value: 96, suffix: "%", delta: 2.1, spark: [88,89,90,91,92,93,94,94,95,95,96,96], accent: "primary" },
];

export const revenueData = [
  { month: "Jan", revenue: 640, forecast: 680 },
  { month: "Feb", revenue: 720, forecast: 750 },
  { month: "Mar", revenue: 810, forecast: 830 },
  { month: "Apr", revenue: 780, forecast: 810 },
  { month: "May", revenue: 920, forecast: 940 },
  { month: "Jun", revenue: 1010, forecast: 1030 },
  { month: "Jul", revenue: 1120, forecast: 1150 },
  { month: "Aug", revenue: 1180, forecast: 1200 },
  { month: "Sep", revenue: 1284, forecast: 1310 },
];

export const teamPerf = [
  { name: "Engineering", value: 92 },
  { name: "Product", value: 88 },
  { name: "Design", value: 85 },
  { name: "Data", value: 90 },
  { name: "Growth", value: 78 },
  { name: "Ops", value: 82 },
];

export const taskDonut = [
  { name: "Completed", value: 342, color: "var(--emerald)" },
  { name: "In Progress", value: 128, color: "var(--cyan)" },
  { name: "Review", value: 64, color: "var(--amber)" },
  { name: "Backlog", value: 96, color: "var(--violet)" },
];

export const deptCompare = [
  { dept: "Eng", q1: 78, q2: 85, q3: 92 },
  { dept: "Prod", q1: 72, q2: 80, q3: 88 },
  { dept: "Design", q1: 70, q2: 78, q3: 85 },
  { dept: "Data", q1: 82, q2: 87, q3: 90 },
  { dept: "Growth", q1: 60, q2: 68, q3: 78 },
];

export type Task = {
  id: string;
  title: string;
  status: "backlog" | "progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  owner: string;
  due: string;
  progress: number;
};

export const initialTasks: Task[] = [
  { id: "t1", title: "Q4 Revenue forecast model", status: "progress", priority: "high", owner: "Amara Okafor", due: "Nov 22", progress: 68 },
  { id: "t2", title: "Enterprise onboarding v2", status: "progress", priority: "critical", owner: "Liu Wei", due: "Nov 18", progress: 42 },
  { id: "t3", title: "AI insight ranking algorithm", status: "review", priority: "high", owner: "Priya Shah", due: "Nov 15", progress: 90 },
  { id: "t4", title: "Churn cohort dashboard", status: "backlog", priority: "medium", owner: "Diego Alvarez", due: "Dec 02", progress: 0 },
  { id: "t5", title: "SOC2 evidence collection", status: "completed", priority: "high", owner: "Naomi Chen", due: "Nov 08", progress: 100 },
  { id: "t6", title: "Pricing page redesign", status: "review", priority: "medium", owner: "Sofia Rossi", due: "Nov 20", progress: 82 },
  { id: "t7", title: "Realtime alerts pipeline", status: "progress", priority: "high", owner: "Kenji Sato", due: "Nov 25", progress: 55 },
  { id: "t8", title: "Data warehouse migration", status: "backlog", priority: "critical", owner: "Ravi Kumar", due: "Dec 10", progress: 0 },
  { id: "t9", title: "Customer NPS Q3 report", status: "completed", priority: "low", owner: "Elena Vasquez", due: "Nov 05", progress: 100 },
];

export const alerts = [
  { id: "a1", title: "Revenue anomaly detected", desc: "EU region revenue dropped 12% in the last 6 hours vs. 30-day baseline.", severity: "critical", time: "8m ago" },
  { id: "a2", title: "Project Atlas at risk", desc: "3 high-priority tasks delayed beyond SLA. Predicted slip: 9 days.", severity: "high", time: "42m ago" },
  { id: "a3", title: "Elevated churn risk", desc: "17 enterprise accounts show engagement drop >30% this week.", severity: "high", time: "1h ago" },
  { id: "a4", title: "API latency spike", desc: "p95 latency on /insights climbed to 820ms (baseline 210ms).", severity: "medium", time: "2h ago" },
  { id: "a5", title: "Underutilized ad spend", desc: "Google campaign 'Q4-BR' running 38% under target CPA.", severity: "low", time: "4h ago" },
] as const;

export const team = [
  { name: "Amara Okafor", role: "Product Manager", score: 94, tasks: 42, project: "Atlas", status: "online" },
  { name: "Liu Wei", role: "Frontend Engineer", score: 88, tasks: 61, project: "Nexus Core", status: "online" },
  { name: "Priya Shah", role: "AI Engineer", score: 96, tasks: 38, project: "Insight Engine", status: "focus" },
  { name: "Diego Alvarez", role: "Data Analyst", score: 82, tasks: 55, project: "Cohorts", status: "online" },
  { name: "Naomi Chen", role: "Backend Developer", score: 90, tasks: 47, project: "Pipelines", status: "away" },
  { name: "Kenji Sato", role: "Platform Engineer", score: 91, tasks: 33, project: "Realtime", status: "online" },
];

export const insightSamples = {
  generate: [
    "Revenue is up 18.4% MoM, driven by a 27% lift in enterprise conversions and improved SDR-to-AE handoff velocity.",
    "Product usage in the APAC region is compounding at 6% weekly. Consider accelerating localized onboarding for the JP and SG segments.",
    "Marketing ROI improved 22% after reallocating budget from paid social to intent-based SEM in the last 30 days.",
  ],
  risk: [
    "Project Atlas is trending 9 days behind plan. Root cause: 3 blocked tasks awaiting API contract sign-off from platform team.",
    "Churn risk elevated for 17 enterprise accounts. Common signal: >30% drop in weekly insight views over 14 days.",
    "Data warehouse migration blocks the Q1 analytics roadmap. Recommend pre-allocating 2 senior data engineers.",
  ],
  next: [
    "Schedule a 30-minute unblock with the platform team today. Reassign task T-238 to Liu Wei to keep Atlas on track.",
    "Trigger the enterprise re-engagement playbook for the 17 flagged accounts and route to CSM tier-1 queue.",
    "Approve the SEM budget expansion (+$42k) — projected 3.4x ROAS based on last 30-day performance.",
  ],
};
