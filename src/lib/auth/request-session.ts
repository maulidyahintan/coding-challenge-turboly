import type { NextRequest } from "next/server";
import type { SessionPayload } from "@/types/auth";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function readRequestSession(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? await verifySessionToken(token) : null;
}
