import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome page for Turboly Adaptive Task Manager.",
};

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Turboly Coding Challenge
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Adaptive Task Manager
        </h1>
        <p className="mt-3 max-w-xl text-slate-600">
          Adaptive Task Manager with secure auth, built for mobile, tablet, and desktop workflows.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-700"
          >
            Go to Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
