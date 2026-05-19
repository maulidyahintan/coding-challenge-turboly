import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

type RouteIntent = "protected" | "auth" | "public";

const AUTH_PAGES = new Set(["/login"]);
const PUBLIC_PREFIXES = ["/_next", "/api/auth", "/favicon.ico", "/unauthorized"];

function getRouteIntent(pathname: string): RouteIntent {
  if (AUTH_PAGES.has(pathname)) {
    return "auth";
  }

  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return "public";
  }

  return "protected";
}

function getSessionSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET ?? "dev-auth-secret-change-me";
  return new TextEncoder().encode(secret);
}

async function hasValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, getSessionSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const routeIntent = getRouteIntent(request.nextUrl.pathname);

  if (routeIntent === "public") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isLoggedIn = await hasValidSessionToken(token);

  if (routeIntent === "protected" && !isLoggedIn) {
    const unauthorizedUrl = new URL("/unauthorized", request.url);
    unauthorizedUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  if (routeIntent === "auth" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
