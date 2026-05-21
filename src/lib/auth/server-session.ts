import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import type { SessionPayload } from "@/types/auth";
import { cookies } from "next/headers";

export async function readServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return token ? await verifySessionToken(token) : null;
}
