import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, runVanessa } from "@/lib/vanessa";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Vanessa" },
      {
        name: "description",
        content:
          "Draft considered, professional emails: set the context, purpose, tone and key points, then generate, preview and copy.",
      },
      { property: "og:title", content: "Email Generator — Vanessa" },
      {
        property: "og:description",
        content: "Draft professional emails with context, purpose, tone and key points.",
      },
    ],
  }),
  component: EmailGenerator,
});

const TONES = ["Professional", "Warm", "Direct", "Diplomatic", "Formal"];

const field =
  "w-full rounded-xl bg-input/40 border border-border px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50";

function EmailGenerator() {
  const [context, setContext] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [points, setPoints] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);

  const generate = async () => {
    if (!purpose.trim()) {
      toast("A purpose would help, Sir.");
      return;
    }
    const result = await runVanessa(() => compose(), setStatus);
    setStatus(null);
    setDraft(result);
  };

  const compose = () => {
    const bullets = points
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    return [
      `Subject: ${purpose.trim().replace(/\.$/, "")}`,
      "",
      "Dear colleague,",
      "",
      context.trim()
        ? `Following ${context.trim().replace(/\.$/, "")}, I wanted to set out where matters stand and what I propose next.`
        : "I hope this finds you well. I wanted to set out where matters stand and what I propose next.",
      "",
      bullets.length
        ? bullets.map((b) => `• ${b.replace(/^[-•]\s*/, "")}`).join("\n")
        : "• A short summary of the position\n• The decision required\n• The proposed timeline",
      "",
      tone === "Direct"
        ? "Could you confirm your position by close of play tomorrow?"
        : "I would be grateful for your thoughts, and happy to talk it through at your convenience.",
      "",
      "Kind regards,",
      "Tiisetso",
    ].join("\n");
  };

  return (
    <>
      <PageHeader title="Email Generator" description="Considered correspondence, quickly" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="glass space-y-4 p-5">
          <div>
            <label htmlFor="ctx" className="mb-1.5 block text-xs text-muted-foreground">
              Context
            </label>
            <textarea
              id="ctx"
              rows={3}
              className={field}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Yesterday's supplier call regarding the delayed shipment"
            />
          </div>
          <div>
            <label htmlFor="purpose" className="mb-1.5 block text-xs text-muted-foreground">
              Purpose
            </label>
            <input
              id="purpose"
              className={field}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request revised delivery dates"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs text-muted-foreground">Tone</span>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  aria-pressed={tone === t}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    tone === t
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="points" className="mb-1.5 block text-xs text-muted-foreground">
              Key points (one per line)
            </label>
            <textarea
              id="points"
              rows={4}
              className={field}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder={"Confirm revised dates\nClarify penalty terms"}
            />
          </div>
          <button
            onClick={generate}
            disabled={!!status}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {status ?? "Generate"}
          </button>
        </section>

        <section className="glass flex min-h-[320px] flex-col p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Preview</h2>
            {draft && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(draft);
                    toast("Copied, Sir.");
                  }}
                  className="glass-soft inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
                <button
                  onClick={generate}
                  className="glass-soft inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                </button>
              </div>
            )}
          </div>
          {draft ? (
            <pre className="flex-1 overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
              {draft}
            </pre>
          ) : (
            <p className="m-auto max-w-xs text-center text-sm text-muted-foreground">
              {status ?? "Your draft will appear here once I have the details, Sir."}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
        </section>
      </div>
    </>
  );
}
