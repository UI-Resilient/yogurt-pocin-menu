"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-lilac-200 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
        <p className="font-display italic text-lilac-500 text-sm">
          Admin
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Masuk ke Dashboard
        </h1>
        <div className="swirl-divider mt-3 mb-6 w-24 rounded-full" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-lilac-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-lilac-200 bg-white px-4 py-2.5 text-ink outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
              placeholder="admin@yogurtpocin.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-lilac-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-lilac-200 bg-white px-4 py-2.5 text-ink outline-none focus:border-lilac-500 focus:ring-2 focus:ring-lilac-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-lilac-600 px-4 py-2.5 font-semibold text-white shadow-soft transition-colors hover:bg-lilac-700 disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
}
