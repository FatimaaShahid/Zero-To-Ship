"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Megaphone, MessageSquareText, LogIn, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../lib/auth-context";

const NAV_ITEMS = [
  { href: "/", label: "Status", icon: LayoutGrid },
  { href: "/notices", label: "Notices", icon: Megaphone },
  { href: "/assistant", label: "Ask", icon: MessageSquareText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { session, logout } = useAuth();

  return (
    <aside className="flex h-screen w-55 shrink-0 flex-col border-r border-line bg-panel">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-signal-good/15 font-display text-sm font-bold text-signal-good">
          SS
        </div>
        <div className="font-display text-sm font-semibold tracking-wide text-ink">
          SENTINEL<span className="text-ink-muted">-SYNC</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-panel-raised text-ink"
                  : "text-ink-muted hover:bg-panel-raised/60 hover:text-ink"
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-3 py-4">
        {session ? (
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-panel-raised/60 hover:text-signal-alert"
          >
            <LogOut size={16} strokeWidth={2} />
            Sign out · #{session.userId}
          </button>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-panel-raised/60 hover:text-ink"
          >
            <LogIn size={16} strokeWidth={2} />
            Sign in
          </Link>
        )}
      </div>
    </aside>
  );
}
