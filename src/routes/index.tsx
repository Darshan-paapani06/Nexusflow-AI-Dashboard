import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Hero } from "@/components/nexus/Hero";
import { Overview } from "@/components/nexus/Overview";
import { AIInsights } from "@/components/nexus/AIInsights";
import { Analytics } from "@/components/nexus/Analytics";
import { ProjectBoard } from "@/components/nexus/ProjectBoard";
import { AlertsCenter } from "@/components/nexus/AlertsCenter";
import { TeamPerformance } from "@/components/nexus/TeamPerformance";
import { Settings } from "@/components/nexus/Settings";
import { TopBar, SideNav } from "@/components/nexus/Navigation";
import { AuthModal } from "@/components/nexus/AuthModal";
import { AuthProvider } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  const openDashboard = () => {
    document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AuthProvider>
      <div id="top" className="relative min-h-screen overflow-x-clip">
        <Toaster theme="dark" position="top-right" />
        <TopBar onLogin={() => setAuthOpen(true)} />
        <SideNav />

        <main>
          <Hero onOpenDashboard={openDashboard} />
          <Overview />
          <AIInsights />
          <Analytics />
          <ProjectBoard />
          <AlertsCenter />
          <TeamPerformance />
          <Settings />

          <footer className="border-t border-white/5 px-6 py-10 text-center text-xs text-muted-foreground">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <div>© {new Date().getFullYear()} NexusFlow AI · Enterprise Command Center</div>
              <div className="font-mono">v4.2.0 · nexus-r2 · region us-east</div>
            </div>
          </footer>
        </main>

        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </AuthProvider>
  );
}
