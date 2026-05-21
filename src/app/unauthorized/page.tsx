import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "Access denied. Please log in to continue.",
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_12px_40px_rgba(9,30,66,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-surface">
          <ShieldAlert size={22} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
          Unauthorized
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
          Access denied
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          You need to login first to access this page.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-secondary"
        >
          Go to Login Page
        </Link>
      </section>
    </main>
  );
}
