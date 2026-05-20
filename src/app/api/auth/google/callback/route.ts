import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authenticateGoogleUser } from "@/lib/auth/service";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth/session";

const GOOGLE_AUTH_STATE_COOKIE = "turboly_google_auth_state";

type GoogleTokenResponse = {
  access_token?: string;
  token_type?: string;
  id_token?: string;
};

type GoogleUserInfoResponse = {
  email?: string;
  email_verified?: boolean;
};

function getBaseUrl(request: Request): string {
  return process.env.APP_URL?.trim() || new URL(request.url).origin;
}

function getGoogleRedirectUrl(request: Request): string {
  return new URL("/api/auth/google/callback", getBaseUrl(request)).toString();
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GOOGLE_AUTH_STATE_COOKIE)?.value;

  cookieStore.delete(GOOGLE_AUTH_STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_login_failed", request.url));
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getGoogleRedirectUrl(request),
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=google_login_failed", request.url));
  }

  const tokenPayload = (await tokenResponse.json()) as GoogleTokenResponse;

  if (!tokenPayload.access_token) {
    return NextResponse.redirect(new URL("/login?error=google_login_failed", request.url));
  }

  const userInfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
    },
  });

  if (!userInfoResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=google_login_failed", request.url));
  }

  const userInfo = (await userInfoResponse.json()) as GoogleUserInfoResponse;

  if (!userInfo.email || !userInfo.email_verified) {
    return NextResponse.redirect(new URL("/login?error=google_email_unavailable", request.url));
  }

  const sessionPayload = await authenticateGoogleUser(userInfo.email);
  const token = await createSessionToken(sessionPayload);

  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
