import clsx from "clsx";
import type { Equipment } from "@/lib/types";

const STATUS_STYLES: Record<
  Equipment["status"],
  { bar: string; dot: string; text: string; pulse: string }
> = {
  Available: {
    bar: "bg-signal-good",
    dot: "bg-signal-good",
    text: "text-signal-good",
    pulse: "animate-pulse-good",
  },
  "Low Stock": {
    bar: "bg-signal-warn",
    dot: "bg-signal-warn",
    text: "text-signal-warn",
    pulse: "animate-pulse-warn",
  },
  Maintenance: {
    bar: "bg-signal-alert",
    dot: "bg-signal-alert",
    text: "text-signal-alert",
    pulse: "animate-pulse-alert",
  },
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

export function StatusCard({ item }: { item: Equipment }) {
  const styles = STATUS_STYLES[item.status];

  return (
    <div className="group relative overflow-hidden rounded-lg border border-line bg-panel">
      {/* Signature element: animated pulse bar, speed + color tied to live status */}
      <div className={clsx("h-[3px] w-full", styles.bar, styles.pulse)} />

      <div className="p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted">
          {item.category}
        </div>
        <div className="mt-1.5 font-display text-base font-semibold text-ink">
          {item.service_name}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className={clsx("flex items-center gap-1.5 text-sm font-medium", styles.text)}>
            <span className={clsx("h-1.5 w-1.5 rounded-full", styles.dot)} />
            {item.status}
          </div>
          <div className="font-mono text-xs text-ink-muted">{relativeTime(item.updated_at)}</div>
        </div>
      </div>
    </div>
  );
}
