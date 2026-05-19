"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: EventTarget & HTMLFormElement;
  }) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email");
    const passwordValue = formData.get("password");

    if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
      setErrorMessage("Invalid form submission.");
      setIsSubmitting(false);
      return;
    }

    const email = emailValue.trim();
    const password = passwordValue;

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      setErrorMessage(result?.message ?? "Login failed.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-[#f4f5f7] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dfe1e6] bg-white p-8 shadow-[0_12px_40px_rgba(9,30,66,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#0052cc] text-white">
          <Building2 size={22} />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-[#172b4d]">
          Log in to Turboly
        </h1>

        <p className="mt-2 text-center text-sm text-[#44546f]">
          Use your work account to continue.
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            className="w-full rounded-lg border border-[#dfe1e6] bg-white px-4 py-2 text-sm font-semibold text-[#172b4d] transition hover:bg-[#f7f8f9]"
          >
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#dfe1e6]" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b778c]">
            Or
          </span>
          <div className="h-px flex-1 bg-[#dfe1e6]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#172b4d]">Email</span>
            <span className="relative block">
              <Mail
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6b778c]"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full rounded-lg border border-[#c1c7d0] bg-white py-2 pr-3 pl-9 text-[#172b4d] outline-none transition focus:border-[#2684ff] focus:ring-2 focus:ring-[#b3d4ff]"
              />
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[#172b4d]">Password</span>
            <span className="relative block">
              <KeyRound
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#6b778c]"
              />
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#c1c7d0] bg-white py-2 pr-10 pl-9 text-[#172b4d] outline-none transition focus:border-[#2684ff] focus:ring-2 focus:ring-[#b3d4ff]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6b778c] transition hover:text-[#172b4d]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-[#ffd5d2] bg-[#ffebe6] px-3 py-2 text-sm text-[#ae2a19]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg bg-[#0052cc] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0747a6] disabled:cursor-not-allowed disabled:bg-[#7fa6e6]"
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#6b778c]">
          <button
            type="button"
            className="font-semibold text-[#0052cc] hover:underline"
          >
            Can&apos;t log in?
          </button>
          <span className="mx-2">•</span>
          <button
            type="button"
            className="font-semibold text-[#0052cc] hover:underline"
          >
            Create an account
          </button>
        </div>
      </section>
    </main>
  );
}
