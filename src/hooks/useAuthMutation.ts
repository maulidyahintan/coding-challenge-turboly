import { useMutation } from "@tanstack/react-query";

type RegisterPayload = {
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterResponse = {
  user?: {
    id: string;
    email: string;
  };
  message?: string;
};

type LoginResponse = {
  user?: {
    id: string;
    email: string;
  };
  message?: string;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Login failed.");
      }

      if (!result?.user) {
        throw new Error("Login failed.");
      }

      return result.user;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as RegisterResponse | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Failed to create account.");
      }

      if (!result?.user) {
        throw new Error("Failed to create account.");
      }

      return result.user;
    },
  });
};
