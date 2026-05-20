import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const GOOGLE_AUTH_STATE_COOKIE = "turboly_google_auth_state";

function getBaseUrl(request: Request): string {
  return process.env.APP_URL?.trim() || new URL(request.url).origin;
}

function getGoogleRedirectUrl(request: Request): string {
  return new URL("/api/auth/google/callback", getBaseUrl(request)).toString();
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();

  if (!clientId) {
    return NextResponse.redirect(new URL("/login?error=google_auth_unavailable", request.url));
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(GOOGLE_AUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUrl(request),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "offline",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
