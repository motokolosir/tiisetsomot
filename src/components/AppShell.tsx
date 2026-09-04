import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  MessagesSquare,
  BarChart3,
  Settings,
  Bell,
  Sparkles,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-accent text-foreground pink-glow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-5 w-[2px] rounded-full transition-colors",
                active ? "bg-primary" : "bg-transparent",
              )}
            />
            <Icon className={cn("h-4 w-4", active && "text-primary")} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2 pb-4">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
        <Sparkles className="h-4 w-4 text-primary" />
      </span>
      <span>
        <span className="block text-sm font-semibold tracking-wide">Vanessa</span>
        <span className="block text-[11px] text-muted-foreground">Workplace assistant</span>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell relative z-[2] min-h-screen">
      <aside className="glass fixed top-5 bottom-5 left-5 z-30 hidden w-[228px] flex-col p-3 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto glass-soft p-3 text-[11px] leading-relaxed text-muted-foreground">
          <span className="mb-1 flex items-center gap-2 text-foreground">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-primary" />
            Vanessa online
          </span>
          Composed, proactive, and ready when you are.
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-background/70"
            onClick={() => setOpen(false)}
          />
          <div className="glass absolute top-4 left-4 bottom-4 w-[240px] p-3">
            <Brand />
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="relative z-[3] min-h-screen px-4 pt-5 pb-10 sm:px-6 lg:pl-[276px]">
        <button
          className="glass-soft mb-4 inline-flex items-center gap-2 px-3 py-2 text-sm lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" /> Menu
        </button>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="glass mb-6 flex flex-wrap items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
      <div className="flex items-center gap-2">
        <button
          className="glass-soft grid h-9 w-9 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Link
          to="/settings"
          className="glass-soft grid h-9 w-9 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <span
          className="grid h-9 w-9 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground"
          aria-label="Profile"
        >
          TS
        </span>
      </div>
    </header>
  );
}
