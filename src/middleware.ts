import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Skip internal + auth API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  // ❌ IMPORTANT: prevent RSC redirect loop
  if (request.headers.get("sec-fetch-dest") === "empty") {
    return NextResponse.next();
  }

  // ✅ READ USER FROM COOKIE (NOT API CALL)
  const sessionToken = request.cookies.get("session_token")?.value;

  const isAuthenticated = !!sessionToken;

  // ⚠️ middleware should NOT fetch DB/session
  // role detection should be backend-side OR frontend-side

  // 🚫 NOT LOGGED IN → protect routes only
  const protectedPaths = [
    "/dashboard",
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/provider",
    "/admin",
  ];

  const isProtected = protectedPaths.some((p) =>
    pathname.startsWith(p)
  );

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 👤 If not authenticated, allow public routes
  if (!isAuthenticated) {
    return NextResponse.next();
  }

  // 👮 ADMIN ONLY ROUTE BLOCK (optional safe check via path)
  if (pathname.startsWith("/admin")) {
    // role validation should happen in backend/API
    return NextResponse.next();
  }

  // 🧑 PROVIDER ONLY ROUTE BLOCK
  if (pathname.startsWith("/provider")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ✅ IMPORTANT matcher (NO api, NO _next)
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/profile",
    "/provider/:path*",
    "/admin/:path*",
  ],
};