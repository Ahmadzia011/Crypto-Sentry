"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { registerUser } from "../actions/register";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("error");
    if (!authError) return;

    const messages: Record<string, string> = {
      DatabaseUnavailable: "Login reached the app, but the database is unavailable. Please start the database and try again.",
      Configuration: "Authentication is not configured correctly. Please check the app environment settings.",
      OAuthCallback: "Google sign-in returned to the app, but the callback failed. Please check the OAuth callback URL.",
      OAuthSignin: "Google sign-in could not start. Please check the Google OAuth settings.",
      AccessDenied: "Access was denied for this sign-in attempt.",
    };

    setError(messages[authError] ?? "Login failed. Please try again.");
  }, []);

  const handleSignup = async () => {
    setError("");
    setStatusMessage("");

    const result = await registerUser(name, email);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setStatusMessage(result.message);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-slate-300">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] selection:bg-blue-500/30">
      {/* These soft glow layers make the screen feel more polished and less like a plain form. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-[#1e293b]/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Crypto <span className="text-blue-500">Sentry</span>
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-widest text-slate-400">
            Login or signup to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-500">
            <span>⚠️</span> {error}
          </div>
        )}

        {statusMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-sm font-medium text-blue-600">
            <span>✉️</span> {statusMessage}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 font-semibold text-slate-100 transition-all hover:border-blue-500 hover:bg-slate-800"
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            <div className="h-px flex-1 bg-slate-800" />
            signup
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-5">
            <label className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Prepare Account
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-700 bg-[#0f172a] p-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full rounded-xl border border-slate-700 bg-[#0f172a] p-3 text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button
              type="button"
              onClick={handleSignup}
              className="w-full rounded-xl bg-blue-600 px-3 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-[0.98]"
            >
              Save signup details
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Signup saves your account details. Google completes secure authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
