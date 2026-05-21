"use client";

import { useLoginMutation } from "@/hooks/useAuthMutation";
import { loginSchema } from "@/lib/validations/auth";
import { Building2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const authErrorMessage = useMemo(() => {
    const error = searchParams.get("error");

    switch (error) {
      case "google_auth_unavailable":
        return "Google login is not configured yet.";
      case "google_login_failed":
        return "Google login failed. Please try again.";
      case "google_email_unavailable":
        return "Your Google account did not return a verified email address.";
      default:
        return null;
    }
  }, [searchParams]);

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: EventTarget & HTMLFormElement;
  }) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email");
    const passwordValue = formData.get("password");

    if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
      setErrorMessage("Invalid form submission.");
      return;
    }

    const parsedInput = loginSchema.safeParse({
      email: emailValue,
      password: passwordValue,
    });

    if (!parsedInput.success) {
      setErrorMessage(parsedInput.error.issues[0]?.message ?? "Invalid login request.");
      return;
    }

    try {
      await loginMutation.mutateAsync(parsedInput.data);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-[0_12px_40px_rgba(9,30,66,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-surface">
          <Building2 size={22} />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-text-primary">
          Log in to Turboly
        </h1>

        <p className="mt-2 text-center text-sm text-text-secondary">
          Use your work account to continue.
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={() => router.push("/api/auth/google")}
            className="group relative flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.8 14.7 2 12 2 6.9 2 2.8 6.3 2.8 11.8S6.9 21.6 12 21.6c6.9 0 9.1-4.9 9.1-7.4 0-.5 0-.9-.1-1.3H12z"
                />
                <path
                  fill="#FBBC05"
                  d="M2.8 7.1l3.2 2.4c.9-1.9 2.8-3.2 5-3.2 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 2.8 14.7 2 12 2 8.2 2 4.9 4.2 3.3 7.5z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.6c2.6 0 4.8-.9 6.4-2.6l-3-2.5c-.8.6-1.8 1-3.4 1-2.9 0-5.3-2-6.1-4.6L2.6 15.4C4.2 18.9 7.8 21.6 12 21.6z"
                />
                <path
                  fill="#4285F4"
                  d="M21.1 14.2c0-.5 0-.9-.1-1.3H12v3.9h5.5c-.3 1.1-.9 2.1-2 2.8l3 2.5c1.7-1.6 2.6-4 2.6-6.9z"
                />
              </svg>
            </span>
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
            Or
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loginMutation.isPending}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Email</span>
            <span className="relative block">
              <Mail
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-mint"
              />
            </span>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Password</span>
            <span className="relative block">
              <KeyRound
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary"
              />
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-border bg-surface py-2 pr-10 pl-9 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-mint"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary transition hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {errorMessage || authErrorMessage ? (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {errorMessage ?? authErrorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-secondary disabled:cursor-not-allowed disabled:bg-mint"
          >
            {loginMutation.isPending ? "Signing in..." : "Log in"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-text-secondary">
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </button>
        </div>
      </section>
    </main>
  );
}
