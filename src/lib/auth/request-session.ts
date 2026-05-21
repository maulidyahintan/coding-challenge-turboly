import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import type { SessionPayload } from "@/types/auth";
import type { NextRequest } from "next/server";

export async function readRequestSession(
  request: NextRequest
): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  return token ? await verifySessionToken(token) : null;
}
