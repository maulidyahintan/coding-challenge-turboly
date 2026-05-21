import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type RouteIntent = "protected" | "auth" | "public";

const AUTH_PAGES = new Set(["/login", "/register"]);
const PROTECTED_PREFIXES = ["/dashboard"];
const SESSION_COOKIE_NAME = "turboly_session";

function getRouteIntent(pathname: string): RouteIntent {
  if (AUTH_PAGES.has(pathname)) {
    return "auth";
  }

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return "protected";
  }

  return "public";
}

export async function middleware(request: NextRequest) {
  try {
    const routeIntent = getRouteIntent(request.nextUrl.pathname);

    if (routeIntent === "public") {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isLoggedIn = Boolean(token);

    if (routeIntent === "protected" && !isLoggedIn) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      unauthorizedUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }

    if (routeIntent === "auth" && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    // Never let middleware runtime issues take down the whole app on Edge.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
