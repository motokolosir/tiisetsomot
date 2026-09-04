import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER, runVanessa } from "@/lib/vanessa";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes — Vanessa" },
      {
        name: "description",
        content:
          "Turn raw meeting notes or transcripts into a summary, key decisions, action items, participants and follow-ups.",
      },
      { property: "og:title", content: "Meeting Notes — Vanessa" },
      {
        property: "og:description",
        content: "Notes and transcripts into decisions, actions and follow-ups.",
      },
    ],
  }),
  component: MeetingNotes,
});

type Summary = {
  summary: string;
  decisions: string[];
  actions: string[];
  participants: string[];
  followUps: string[];
};

function MeetingNotes() {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<Summary | null>(null);

  const summarise = async () => {
    if (notes.trim().length < 20) {
      toast("A little more detail would help, Sir.");
      return;
    }
    const lines = notes
      .split(/\n|\.\s/)
      .map((l) => l.trim())
      .filter((l) => l.length > 3);
    const names = Array.from(
      new Set(notes.match(/\b[A-Z][a-z]{2,}\b/g)?.filter((n) => n.length < 14) ?? []),
    ).slice(0, 6);

    const out = await runVanessa<Summary>(
      () => ({
        summary: `The discussion covered ${lines.length} substantive points. The group aligned on the priorities, agreed the immediate next steps, and left two items for confirmation outside the meeting.`,
        decisions: lines
          .filter((l) => /agree|decid|approv|will|confirm/i.test(l))
          .slice(0, 4)
          .map((l) => l.replace(/^[-•]\s*/, "")) || [],
        actions: lines
          .filter((l) => /action|follow|send|prepare|review|draft|check/i.test(l))
          .slice(0, 5)
          .map((l) => l.replace(/^[-•]\s*/, "")),
        participants: names.length ? names : ["Attendees not named in the notes"],
        followUps: [
          "Circulate the summary to all attendees",
          "Confirm owners and dates for each action",
          "Schedule a short review before month end",
        ],
      }),
      setStatus,
    );
    setStatus(null);
    setResult({
      ...out,
      decisions: out.decisions.length ? out.decisions : ["No explicit decisions recorded"],
      actions: out.actions.length ? out.actions : ["No explicit actions recorded"],
    });
  };

  return (
    <>
      <PageHeader title="Meeting Notes" description="Notes in, clarity out" />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="glass p-5">
          <label htmlFor="notes" className="mb-1.5 block text-xs text-muted-foreground">
            Notes or transcript
          </label>
          <textarea
            id="notes"
            rows={14}
            className="w-full rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste the meeting notes or transcript here…"
          />
          <button
            onClick={summarise}
            disabled={!!status}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {status ?? "Summarise"}
          </button>
        </section>

        <section className="glass min-h-[320px] p-5">
          {result ? (
            <div className="space-y-5">
              <Block title="Summary">
                <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
              </Block>
              <Block title="Key decisions">
                <List items={result.decisions} />
              </Block>
              <Block title="Action items">
                <List items={result.actions} />
              </Block>
              <Block title="Participants">
                <p className="text-sm text-muted-foreground">{result.participants.join(", ")}</p>
              </Block>
              <Block title="Follow-up suggestions">
                <List items={result.followUps} />
              </Block>
              <p className="text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
            </div>
          ) : (
            <p className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              {status ?? "Share the notes and I'll structure them for you, Sir."}
            </p>
          )}
        </section>
      </div>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">{title}</h2>
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i, idx) => (
        <li key={idx} className="flex gap-2.5 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
