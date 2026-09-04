import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, runVanessa } from "@/lib/vanessa";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Vanessa" },
      {
        name: "description",
        content:
          "Pose a research question, choose the scope and mode, and receive structured findings, insights and recommended actions.",
      },
      { property: "og:title", content: "Research Assistant — Vanessa" },
      {
        property: "og:description",
        content: "Structured findings, insights and recommended actions.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const SCOPES = ["Quick view", "Standard", "Thorough"] as const;
const MODES = ["Market", "Competitive", "Technical", "Regulatory"] as const;
const field =
  "w-full rounded-xl bg-input/40 border border-border px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50";

type Result = { findings: string[]; summary: string; insights: string[]; actions: string[] };

function ResearchAssistant() {
  const [question, setQuestion] = useState("");
  const [scope, setScope] = useState<(typeof SCOPES)[number]>("Standard");
  const [mode, setMode] = useState<(typeof MODES)[number]>("Market");
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const research = async () => {
    if (!question.trim()) {
      toast("What would you like me to look into, Sir?");
      return;
    }
    const q = question.trim().replace(/\?$/, "");
    const out = await runVanessa<Result>(
      () => ({
        findings: [
          `${mode} conditions around "${q}" are moving steadily rather than sharply.`,
          "Three established players hold the majority of attention, with room at the specialist end.",
          "Cost pressure is the most frequently cited constraint among decision makers.",
          "Adoption is strongest where onboarding effort is lowest.",
        ].slice(0, scope === "Quick view" ? 2 : scope === "Standard" ? 3 : 4),
        summary: `On balance, "${q}" looks viable with a measured approach. The opportunity is real but rewards focus over breadth, and the first decision to make is where you are willing not to compete.`,
        insights: [
          "Differentiation is more defensible than price positioning here.",
          "The narrower the initial audience, the faster the evidence arrives.",
          "Timing matters less than consistency of execution.",
        ],
        actions: [
          "Define a single beachhead segment and success measure",
          "Commission a short validation exercise before committing budget",
          "Revisit this question in six weeks with fresh figures",
        ],
      }),
      setStatus,
    );
    setStatus(null);
    setResult(out);
  };

  return (
    <>
      <PageHeader title="Research Assistant" description="Considered answers, structured clearly" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="glass space-y-4 p-5">
          <div>
            <label htmlFor="q" className="mb-1.5 block text-xs text-muted-foreground">
              Research question
            </label>
            <textarea
              id="q"
              rows={3}
              className={field}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Should we expand our services offering into East Africa?"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs text-muted-foreground">Scope</span>
            <div className="flex gap-2">
              {SCOPES.map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  aria-pressed={scope === s}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                    scope === s
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-xs text-muted-foreground">Research mode</span>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    mode === m
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={research}
            disabled={!!status}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {status ?? "Begin research"}
          </button>
        </section>

        <section className="glass min-h-[320px] p-5">
          {result ? (
            <div className="space-y-5">
              <Section title="Findings" items={result.findings} />
              <div>
                <h2 className="mb-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Summary
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              </div>
              <Section title="Key insights" items={result.insights} />
              <Section title="Recommended actions" items={result.actions} />
              <p className="text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
            </div>
          ) : (
            <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              {status ?? "Pose the question and I'll do the reading, Sir."}
            </p>
          )}
        </section>
      </div>
    </>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">{title}</h2>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
