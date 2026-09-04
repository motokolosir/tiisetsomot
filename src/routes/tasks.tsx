import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, runVanessa } from "@/lib/vanessa";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Vanessa" },
      {
        name: "description",
        content:
          "Give Vanessa an objective, deadline and priority, and receive a clear task breakdown with completion tracking.",
      },
      { property: "og:title", content: "Task Planner — Vanessa" },
      {
        property: "og:description",
        content: "Objectives broken into a clear, trackable plan.",
      },
    ],
  }),
  component: TaskPlanner,
});

type Task = { id: number; text: string; done: boolean };

const PRIORITIES = ["Low", "Medium", "High"] as const;
const field =
  "w-full rounded-xl bg-input/40 border border-border px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50";

function TaskPlanner() {
  const [objective, setObjective] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("High");
  const [status, setStatus] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const plan = async () => {
    if (!objective.trim()) {
      toast("What are we working towards, Sir?");
      return;
    }
    const o = objective.trim().replace(/\.$/, "");
    const built = await runVanessa<Task[]>(
      () =>
        [
          `Clarify the intended outcome for "${o}"`,
          "Confirm the stakeholders and who signs off",
          "Gather the information and inputs required",
          "Draft the first version of the deliverable",
          "Review internally and incorporate feedback",
          deadline ? `Finalise and deliver by ${deadline}` : "Finalise and deliver",
        ].map((text, id) => ({ id, text, done: false })),
      setStatus,
    );
    setStatus(null);
    setTasks(built);
  };

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <>
      <PageHeader title="Task Planner" description="From objective to plan" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="glass space-y-4 p-5">
          <div>
            <label htmlFor="obj" className="mb-1.5 block text-xs text-muted-foreground">
              Objective
            </label>
            <textarea
              id="obj"
              rows={3}
              className={field}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Prepare the Q4 leadership briefing pack"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="due" className="mb-1.5 block text-xs text-muted-foreground">
                Deadline
              </label>
              <input
                id="due"
                type="date"
                className={field}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <span className="mb-1.5 block text-xs text-muted-foreground">Priority</span>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    aria-pressed={priority === p}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                      priority === p
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={plan}
            disabled={!!status}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {status ?? "Build the plan"}
          </button>
        </section>

        <section className="glass min-h-[320px] p-5">
          {tasks.length ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Task breakdown</h2>
                <span className="text-xs text-muted-foreground">
                  {done} of {tasks.length} complete · {pct}%
                </span>
              </div>
              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() =>
                        setTasks((prev) =>
                          prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                        )
                      }
                      className="glass-soft flex w-full items-center gap-3 px-3.5 py-3 text-left text-sm transition-colors hover:bg-secondary"
                    >
                      <span
                        className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-md border ${
                          t.done ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {t.done && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                      <span className={t.done ? "text-muted-foreground line-through" : ""}>
                        {t.text}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
            </>
          ) : (
            <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              {status ?? "Tell me the objective and I'll set out the steps, Sir."}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
