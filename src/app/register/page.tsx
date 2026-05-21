"use client";

import { useRegisterMutation } from "@/hooks/useAuthMutation";
import { registerSchema } from "@/lib/validations/auth";
import { Building2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: EventTarget & HTMLFormElement;
  }) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email");
    const passwordValue = formData.get("password");
    const confirmPasswordValue = formData.get("confirmPassword");

    if (
      typeof emailValue !== "string" ||
      typeof passwordValue !== "string" ||
      typeof confirmPasswordValue !== "string"
    ) {
      setErrorMessage("Invalid form submission.");
      return;
    }

    const parsedInput = registerSchema.safeParse({
      email: emailValue,
      password: passwordValue,
    });

    if (!parsedInput.success) {
      setErrorMessage(parsedInput.error.issues[0]?.message ?? "Invalid registration request.");
      return;
    }

    const confirmPassword = confirmPasswordValue;

    if (parsedInput.data.password !== confirmPassword) {
      setErrorMessage("Password and confirmation password do not match.");
      return;
    }

    try {
      await registerMutation.mutateAsync(parsedInput.data);
      router.push("/login");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create account.");
    }
  };

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-[0_12px_40px_rgba(9,30,66,0.14)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-surface">
          <Building2 size={22} />
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight text-text-primary">
          Create your Turboly account
        </h1>

        <p className="mt-2 text-center text-sm text-text-secondary">
          Register your work account to start managing tasks.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
          aria-busy={registerMutation.isPending}
        >
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
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

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-primary">Confirm Password</span>
            <span className="relative block">
              <KeyRound
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary"
              />
              <input
                required
                minLength={8}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-border bg-surface py-2 pr-10 pl-9 text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-mint"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-text-secondary transition hover:text-text-primary"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {errorMessage ? (
            <p
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-red-200 bg-rose-50 px-3 py-2 text-sm text-red-700"
            >
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-surface transition hover:bg-secondary disabled:cursor-not-allowed disabled:bg-mint"
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-text-secondary">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-primary hover:underline"
          >
            Already have an account? Log in
          </button>
        </div>
      </section>
    </main>
  );
}
