"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { StatusCard } from "../components/StatusCard";
import { listEquipment } from "../lib/services";
import type { Equipment, EquipmentCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  lab: "Labs",
  cafeteria: "Cafeteria",
  library: "Library",
};

export default function DashboardPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listEquipment();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load status");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 15000); // poll every 15s for near-live feel
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const grouped = items.reduce<Record<string, Equipment[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <>
      <TopBar eyebrow="Campus Services" title="Status Board" />

      <div className="px-8 py-6">
        {error && (
          <div className="mb-6 rounded-md border border-signal-alert/30 bg-signal-alert/10 px-4 py-3 text-sm text-signal-alert">
            Couldn&apos;t reach content_service: {error}. Confirm it&apos;s running and
            NEXT_PUBLIC_CONTENT_SERVICE_URL is set correctly.
          </div>
        )}

        {isLoading && !error && (
          <p className="font-mono text-sm text-ink-muted">Loading live status…</p>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
            <p className="text-ink">No equipment records yet.</p>
            <p className="mt-1 text-sm text-ink-muted">
              Add one via <code className="font-mono text-xs">POST /api/equipment</code> on content_service.
            </p>
          </div>
        )}

        {(Object.keys(grouped) as EquipmentCategory[]).map((category) => (
          <section key={category} className="mb-8">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {grouped[category].map((item) => (
                <StatusCard key={item.item_id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
