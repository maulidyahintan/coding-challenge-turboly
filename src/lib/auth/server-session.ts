import { cookies } from "next/headers";
import type { SessionPayload } from "@/types/auth";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function readServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return token ? await verifySessionToken(token) : null;
}
