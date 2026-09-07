import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const hasAuthCookie = request.cookies.has("access_token");

  if (!isPublicPath && !hasAuthCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicPath && hasAuthCookie) {
    // Already logged in — no reason to show the login page again.
    return NextResponse.redirect(new URL("/reconcile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except static assets and Next.js internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
