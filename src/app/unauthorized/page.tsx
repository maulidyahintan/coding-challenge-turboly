import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-[#f4f5f7] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dfe1e6] bg-white p-8 text-center shadow-[0_12px_40px_rgba(9,30,66,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#de350b] text-white">
          <ShieldAlert size={22} />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#6b778c]">
          Unauthorized
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172b4d]">Access denied</h1>
        <p className="mt-2 text-sm text-[#44546f]">
          You need to login first to access this page.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0747a6]"
        >
          Go to Login Page
        </Link>
      </section>
    </main>
  );
}
