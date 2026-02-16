import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("__session");

  // /analysis → / (backward compat)
  if (pathname.startsWith("/analysis")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected routes: redirect to / if not authenticated
  if (pathname.startsWith("/settings") || pathname.startsWith("/profile")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // /login: redirect to / if already authenticated
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/settings/:path*", "/profile/:path*", "/login", "/analysis/:path*", "/analysis"],
};
