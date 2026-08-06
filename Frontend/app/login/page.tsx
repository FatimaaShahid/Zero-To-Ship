"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { loginUser } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await loginUser({ email, password });
      login({ token: res.token, userId: res.user_id, role: res.role });
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <TopBar eyebrow="Access" title="Sign In" />
      <div className="flex justify-center px-8 py-16">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-5">
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="you@neduet.edu.pk"
            />
          </div>
          <div className="mb-6">
            <Label>Password</Label>
            <Input
              type="password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <Alert>{error}</Alert>}

          <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>

          <p className="mt-5 text-center text-sm text-ink-muted">
            No account?{" "}
            <Link href="/register" className="text-signal-good hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
