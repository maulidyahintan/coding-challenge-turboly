import type { ZodError } from "zod";

export function getFirstZodErrorMessage(error: ZodError, fallbackMessage: string): string {
  const firstIssue = error.issues[0];
  return firstIssue?.message ?? fallbackMessage;
}
