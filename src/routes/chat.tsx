import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, STATUS_MESSAGES } from "@/lib/vanessa";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Vanessa" },
      {
        name: "description",
        content:
          "Think out loud with Vanessa: a calm, professional copilot for planning, wording, prioritising and deciding.",
      },
      { property: "og:title", content: "AI Chat — Vanessa" },
      {
        property: "og:description",
        content: "A calm, professional copilot for everyday workplace decisions.",
      },
    ],
  }),
  component: Chat,
});

type Msg = { role: "you" | "vanessa"; text: string };

const SUGGESTIONS = [
  "Help me prioritise today",
  "Reword this more diplomatically",
  "What should I raise in the leadership meeting?",
  "Summarise where the supplier issue stands",
];

const OPENING: Msg = {
  role: "vanessa",
  text: "Good day, Sir. Tell me what's on your desk and I'll help you make sense of it — priorities, wording, or a decision you'd rather not take alone.",
};

function reply(input: string): string {
  const q = input.trim().replace(/\?$/, "");
  if (/priorit/i.test(q)) {
    return "Of the work in front of you, three items carry real consequence today: the operating budget approval, the partnership terms for legal, and Thursday's briefing. I would take them in that order and protect the first hour for the budget — it's the one that unblocks the others.";
  }
  if (/reword|diplomat|tone/i.test(q)) {
    return "I'd soften the opening and move the ask to the end. Something like: \"Thank you for the update — it's helpful to see where things stand. Given the timeline, could we confirm the revised dates by Thursday?\" Firm, but leaves the door open.";
  }
  return `Understood, Sir. On "${q}", my reading is that the useful move is to narrow it before you widen it: agree the outcome you want, name who has to say yes, and set a date. If it's helpful, I can draft the note or break it into a plan — whichever saves you the most time.`;
}

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([OPENING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    setMessages((m) => [...m, { role: "you", text: value }]);
    setInput("");
    setThinking("Vanessa is thinking…");
    setTimeout(() => {
      setThinking(null);
      setMessages((m) => [...m, { role: "vanessa", text: reply(value) }]);
    }, 1400);
  };

  return (
    <>
      <PageHeader title="AI Chat" description="Vanessa, at your side" />

      <div className="glass flex h-[calc(100vh-190px)] min-h-[440px] flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-primary" /> Vanessa online
          </span>
          <button
            onClick={() => setMessages([OPENING])}
            className="glass-soft inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear conversation
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "you" ? "flex justify-end" : "flex"}>
              <div
                className={`max-w-[min(560px,88%)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "you"
                    ? "bg-accent text-foreground"
                    : "glass-soft text-muted-foreground"
                }`}
              >
                {m.role === "vanessa" && (
                  <span className="mb-1 block text-[11px] tracking-wide text-primary">Vanessa</span>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {thinking && <p className="text-sm text-muted-foreground italic">{thinking}</p>}
          <div ref={endRef} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="msg" className="sr-only">
            Message Vanessa
          </label>
          <input
            id="msg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Vanessa…"
            className="flex-1 rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="grid h-[42px] w-[42px] place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-60"
            disabled={!!thinking}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
      </div>
    </>
  );
}
