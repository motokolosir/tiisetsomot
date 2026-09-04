import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { AI_DISCLAIMER } from "@/lib/vanessa";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vanessa" },
      {
        name: "description",
        content:
          "Adjust how Vanessa addresses you, her default tone, background motion and workspace preferences.",
      },
      { property: "og:title", content: "Settings — Vanessa" },
      {
        property: "og:description",
        content: "Preferences for address, tone, motion and workspace behaviour.",
      },
    ],
  }),
  component: SettingsPage,
});

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-border/60 py-4 last:border-0">
      <div>
        <p className="text-sm">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors ${
          value ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-foreground transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [address, setAddress] = useState<"Sir" | "Ma'am">("Sir");
  const [tone, setTone] = useState("Professional");
  const [galaxy, setGalaxy] = useState(true);
  const [proactive, setProactive] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <PageHeader title="Settings" description="How Vanessa works with you" />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass p-5">
          <h2 className="mb-4 text-sm font-medium">Address & voice</h2>
          <div className="mb-5">
            <span className="mb-2 block text-xs text-muted-foreground">Address me as</span>
            <div className="flex gap-2">
              {(["Sir", "Ma'am"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAddress(a)}
                  aria-pressed={address === a}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                    address === a
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-xs text-muted-foreground">Default tone</span>
            <div className="flex flex-wrap gap-2">
              {["Professional", "Warm", "Direct", "Diplomatic"].map((t) => (
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
        </section>

        <section className="glass p-5">
          <h2 className="mb-1 text-sm font-medium">Workspace</h2>
          <Toggle
            label="Animated background"
            description="The cosmic backdrop behind the workspace."
            value={galaxy}
            onChange={setGalaxy}
          />
          <Toggle
            label="Proactive insights"
            description="Let me flag deadlines and suggestions unprompted."
            value={proactive}
            onChange={setProactive}
          />
          <Toggle
            label="Notifications"
            description="Quiet alerts for priorities and completions."
            value={notifications}
            onChange={setNotifications}
          />
        </section>
      </div>

      <p className="mt-6 px-1 text-xs text-muted-foreground">{AI_DISCLAIMER}</p>
    </>
  );
}
