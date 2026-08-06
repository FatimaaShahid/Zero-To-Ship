"use client";

import { useEffect, useState } from "react";

export function TopBar({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between border-b border-line px-8 py-5">
      <div>
        {eyebrow && (
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-3 font-mono text-sm text-ink-muted">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-good rounded-full bg-signal-good" />
        </span>
        live
        <span className="text-ink">{time}</span>
      </div>
    </div>
  );
}
