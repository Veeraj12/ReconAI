"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/useAuth";

export function LoginForm() {
  const { login, error, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login(username, password);
  }

  return (
    <div className="group w-full max-w-md animate-fade-in-up rounded-2xl border border-[#d1cdc5]/50 bg-white/40 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-md">
      {/* Logo & Header */}
      <div className="mb-8 flex flex-col items-center text-center transition-transform duration-300 group-hover:-translate-y-1">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0f9d88] text-2xl font-bold text-white shadow-sm">
          R
        </div>
        <h1 className="text-2xl font-bold text-[#38332a]">ReconAI</h1>
        <p className="mt-1 text-sm text-[#7a7569]">Bank & Tally Reconciliation</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-[#4a4538]">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-[#d1cdc5] bg-[#fcfcfb] px-3.5 py-2.5 text-sm text-[#38332a] outline-none transition-all focus:border-[#0f9d88] focus:ring-1 focus:ring-[#0f9d88]"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#4a4538]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-[#d1cdc5] bg-[#fcfcfb] px-3.5 py-2.5 text-sm text-[#38332a] outline-none transition-all focus:border-[#0f9d88] focus:ring-1 focus:ring-[#0f9d88]"
          />
        </div>

        {error && (
          <p className="animate-scale-in rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f9d88] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#0c8a75] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {isLoading && (
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin-slow">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <p className="pt-2 text-center text-sm text-[#7a7569]">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#0f9d88] transition-colors hover:text-[#0c8a75]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}