import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PageHeader } from "@/components/AppShell";
import { MONTHS, TOTALS } from "@/lib/vanessa";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Vanessa" },
      {
        name: "description",
        content:
          "A six-month view of tasks, meetings, emails and research activity, with completion-rate trends and activity breakdown.",
      },
      { property: "og:title", content: "Analytics — Vanessa" },
      {
        property: "og:description",
        content: "Six months of task, meeting, email and research performance.",
      },
    ],
  }),
  component: Analytics,
});

const PINK = "oklch(0.7 0.19 3)";
const ROSE = "oklch(0.84 0.09 350)";
const GRID = "rgba(255,255,255,0.07)";
const AXIS = "rgba(255,255,255,0.45)";

const KPIS = [
  { label: "Tasks Created", value: TOTALS.created },
  { label: "Tasks Completed", value: TOTALS.completed },
  { label: "Completion Rate", value: `${TOTALS.completion}%` },
  { label: "Meetings", value: TOTALS.meetings },
  { label: "Emails", value: TOTALS.emails },
  { label: "Research", value: TOTALS.research },
];

const BREAKDOWN = MONTHS.map((m) => ({
  month: m.month.slice(0, 3),
  Meetings: m.meetings,
  Emails: m.emails,
  Research: m.research,
}));

const tooltipStyle = {
  background: "rgba(24,20,28,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
  color: "#fff",
} as const;

function Analytics() {
  const data = MONTHS.map((m) => ({ ...m, month: m.month.slice(0, 3) }));

  return (
    <>
      <PageHeader title="Analytics" description="Six-month workplace performance" />

      <p className="glass-soft mb-6 inline-block px-3.5 py-2 text-xs text-muted-foreground">
        <strong className="font-medium text-foreground">Demo Data</strong> — replace with real
        workplace data.
      </p>

      <section className="mb-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <div key={k.label} className="glass p-4">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel title="Six-month activity">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="areaPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PINK} stopOpacity={0.5} />
                <stop offset="100%" stopColor={PINK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="created"
              name="Tasks created"
              stroke={PINK}
              fill="url(#areaPink)"
              strokeWidth={2}
            />
          </AreaChart>
        </Panel>

        <Panel title="Task creation vs completion">
          <BarChart data={data}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="created" name="Created" fill={ROSE} radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill={PINK} radius={[6, 6, 0, 0]} />
          </BarChart>
        </Panel>

        <Panel title="Completion-rate trend">
          <LineChart data={data}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              domain={[75, 100]}
              stroke={AXIS}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="completion"
              name="Completion"
              stroke={PINK}
              strokeWidth={2.5}
              dot={{ r: 3, fill: PINK }}
            />
          </LineChart>
        </Panel>

        <Panel title="Activity breakdown">
          <BarChart data={BREAKDOWN}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke={AXIS} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Emails" stackId="a" fill={PINK} />
            <Bar dataKey="Meetings" stackId="a" fill={ROSE} />
            <Bar dataKey="Research" stackId="a" fill="oklch(0.6 0.22 350)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Panel>
      </section>

      <section className="glass mt-4 overflow-x-auto p-5">
        <h2 className="mb-4 text-sm font-medium">Monthly detail</h2>
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="pb-3 font-normal">Month</th>
              <th className="pb-3 text-right font-normal">Created</th>
              <th className="pb-3 text-right font-normal">Completed</th>
              <th className="pb-3 text-right font-normal">Completion</th>
              <th className="pb-3 text-right font-normal">Meetings</th>
              <th className="pb-3 text-right font-normal">Emails</th>
              <th className="pb-3 text-right font-normal">Research</th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m) => (
              <tr key={m.month} className="border-t border-border/60">
                <td className="py-2.5">{m.month}</td>
                <td className="py-2.5 text-right">{m.created}</td>
                <td className="py-2.5 text-right">{m.completed}</td>
                <td className="py-2.5 text-right text-primary">{m.completion}%</td>
                <td className="py-2.5 text-right">{m.meetings}</td>
                <td className="py-2.5 text-right">{m.emails}</td>
                <td className="py-2.5 text-right">{m.research}</td>
              </tr>
            ))}
            <tr className="border-t border-border font-medium">
              <td className="py-2.5">Total</td>
              <td className="py-2.5 text-right">{TOTALS.created}</td>
              <td className="py-2.5 text-right">{TOTALS.completed}</td>
              <td className="py-2.5 text-right text-primary">{TOTALS.completion}%</td>
              <td className="py-2.5 text-right">{TOTALS.meetings}</td>
              <td className="py-2.5 text-right">{TOTALS.emails}</td>
              <td className="py-2.5 text-right">{TOTALS.research}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="glass p-5">
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
