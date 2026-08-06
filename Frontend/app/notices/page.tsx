"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { listNotices, createNotice } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import type { Notice } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NoticesPage() {
  const { session } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [postError, setPostError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  async function refresh() {
    try {
      const data = await listNotices();
      setNotices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notices");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handlePost(e: FormEvent) {
    e.preventDefault();
    if (!session) return;
    setPostError(null);
    setIsPosting(true);
    try {
      await createNotice({ title, body, created_by: session.userId }, session.token);
      setTitle("");
      setBody("");
      await refresh();
    } catch (err) {
      setPostError(err instanceof ApiError ? err.message : "Couldn't post notice");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <>
      <TopBar eyebrow="Campus Comms" title="Notices" />

      <div className="grid grid-cols-1 gap-8 px-8 py-6 lg:grid-cols-[1fr_320px]">
        <div>
          {error && <Alert>{error}</Alert>}
          {isLoading && !error && (
            <p className="font-mono text-sm text-ink-muted">Loading notices…</p>
          )}
          {!isLoading && notices.length === 0 && !error && (
            <div className="rounded-lg border border-dashed border-line px-6 py-12 text-center">
              <p className="text-ink">No notices posted yet.</p>
            </div>
          )}

          <div className="space-y-3">
            {notices.map((notice) => (
              <article
                key={notice.notice_id}
                className="rounded-lg border border-line bg-panel p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {notice.title}
                  </h3>
                  <time className="shrink-0 font-mono text-xs text-ink-muted">
                    {formatDate(notice.created_at)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{notice.body}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-line bg-panel p-5">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            Post a Notice
          </h2>

          {!session ? (
            <p className="text-sm text-ink-muted">Sign in to post a notice.</p>
          ) : (
            <form onSubmit={handlePost}>
              <div className="mb-4">
                <Label>Title</Label>
                <Input required value={title} onChange={(e:  ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              </div>
              <div className="mb-4">
                <Label>Body</Label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-md border border-line bg-panel px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-signal-good focus:outline-none"
                />
              </div>
              {postError && <Alert>{postError}</Alert>}
              <Button type="submit" className="mt-1 w-full" disabled={isPosting}>
                {isPosting ? "Posting…" : "Post notice"}
              </Button>
            </form>
          )}
        </aside>
      </div>
    </>
  );
}
