export const STATUS_MESSAGES = [
  "Preparing your workspace…",
  "Analysing the information…",
  "Structuring your response…",
  "Reviewing the details…",
  "Vanessa is thinking…",
  "Almost ready…",
];

export const AI_DISCLAIMER = "AI-generated content may require human review.";

export function useAddress(): "Sir" | "Ma'am" {
  return "Sir";
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/** Simulated assistant work with polished status messaging. */
export function runVanessa<T>(produce: () => T, onStatus: (s: string) => void): Promise<T> {
  return new Promise((resolve) => {
    const picks: string[] = STATUS_MESSAGES.slice(0, 3);
    let i = 0;
    onStatus("Preparing your workspace…");
    const timer = setInterval(() => {
      i += 1;
      const next = picks[i];
      if (next) onStatus(next);
    }, 550);
    setTimeout(
      () => {
        clearInterval(timer);
        resolve(produce());
      },
      1500 + Math.random() * 400,
    );
  });
}

export const MONTHS = [
  { month: "January", created: 86, completed: 71, completion: 83, meetings: 18, emails: 42, research: 12 },
  { month: "February", created: 94, completed: 79, completion: 84, meetings: 21, emails: 48, research: 15 },
  { month: "March", created: 108, completed: 91, completion: 84, meetings: 23, emails: 55, research: 17 },
  { month: "April", created: 117, completed: 103, completion: 88, meetings: 25, emails: 61, research: 19 },
  { month: "May", created: 126, completed: 115, completion: 91, meetings: 27, emails: 68, research: 22 },
  { month: "June", created: 138, completed: 129, completion: 93, meetings: 29, emails: 74, research: 24 },
];

export const TOTALS = {
  created: 669,
  completed: 588,
  completion: 88,
  meetings: 143,
  emails: 348,
  research: 109,
};
