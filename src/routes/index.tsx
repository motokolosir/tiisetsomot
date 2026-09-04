import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  MessagesSquare,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, greeting } from "@/lib/vanessa";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Vanessa AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Your calm daily overview: priorities, recent activity and one-tap access to Vanessa's writing, planning and research tools.",
      },
      { property: "og:title", content: "Dashboard — Vanessa AI Workplace Assistant" },
      {
        property: "og:description",
        content: "A calm daily overview of priorities, activity and assistant tools.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/email", icon: Mail, title: "Draft Email", desc: "Compose a considered message." },
  { to: "/meetings", icon: NotebookPen, title: "Summarise Meeting", desc: "Notes into decisions." },
  { to: "/tasks", icon: ListChecks, title: "Plan Tasks", desc: "Break an objective down." },
  { to: "/research", icon: Search, title: "Research Topic", desc: "Findings and insights." },
  { to: "/chat", icon: MessagesSquare, title: "Ask Vanessa", desc: "Think something through." },
] as const;

const ACTIVITY = [
  { text: "Email drafted — Q3 supplier renegotiation", time: "12 minutes ago" },
  { text: "Meeting summarised — Product steering", time: "1 hour ago" },
  { text: "Task completed — Board pack review", time: "3 hours ago" },
  { text: "Research completed — Market entry, Kenya", time: "Yesterday" },
];

const PRIORITIES = [
  { text: "Approve the revised operating budget", due: "Due today", high: true },
  { text: "Send the partnership terms to legal", due: "Due tomorrow", high: true },
  { text: "Prepare Thursday's leadership briefing", due: "In 2 days", high: true },
  { text: "Review hiring plan for engineering", due: "This week", high: false },
];

function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your overview for today" />

      <section className="glass mb-6 px-6 py-9 sm:px-10 sm:py-12">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] tracking-wide text-accent-foreground uppercase">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-primary" />
          Vanessa is ready
        </span>
        <h2 className="text-gradient-pink max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          {greeting()}, Sir.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          I'm ready to help you organise today's priorities, communications and decisions.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start with Vanessa <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/tasks"
            className="glass-soft inline-flex items-center px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Review today's plan
          </Link>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="mb-3 px-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          Quick actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {QUICK.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="glass group p-4 transition-colors hover:border-primary/30"
            >
              <span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-accent">
                <Icon className="h-4 w-4 text-primary" />
              </span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="glass p-5">
          <h3 className="mb-4 text-sm font-medium">Recent activity</h3>
          <ul className="space-y-3.5">
            {ACTIVITY.map((a) => (
              <li key={a.text} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
                <span>
                  <span className="block text-sm">{a.text}</span>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-5">
          <h3 className="mb-4 text-sm font-medium">Priority tasks</h3>
          <ul className="space-y-3.5">
            {PRIORITIES.map((t) => (
              <li key={t.text} className="flex items-start gap-3">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.high ? "bg-primary" : "bg-muted-foreground/50"}`}
                />
                <span>
                  <span className="block text-sm">{t.text}</span>
                  <span className="text-xs text-muted-foreground">{t.due}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="glass p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-primary" /> Vanessa insight
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You have three high-priority tasks approaching their deadlines. I can help you
              reorganise today's schedule.
            </p>
          </div>
          <div className="glass p-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-semibold">88%</p>
                <p className="text-[11px] text-muted-foreground">Tasks completed</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary">↑ Improving</p>
                <p className="text-[11px] text-muted-foreground">Productivity</p>
              </div>
              <div>
                <p className="text-lg font-semibold">This month</p>
                <p className="text-[11px] text-muted-foreground">AI-assisted work</p>
              </div>
            </div>
            <Link
              to="/analytics"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <p className="mt-6 px-1 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
    </>
  );
}
