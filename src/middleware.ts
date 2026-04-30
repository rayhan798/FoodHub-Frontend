import { NextRequest, NextResponse } from "next/server";
import { Roles, type Role } from "./constants/roles";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes("favicon.ico") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value;
  
  const rawRole = request.cookies.get("user_role")?.value;
  const userRole = rawRole?.toUpperCase() as Role | undefined;

  const isAuthenticated = Boolean(sessionToken);

  const isAdminPath = pathname.startsWith("/admin");
  const isProviderPath = pathname.startsWith("/provider");
  const isCustomerPrivatePath = 
    pathname.startsWith("/cart") || 
    pathname.startsWith("/checkout") || 
    pathname.startsWith("/orders") || 
    pathname.startsWith("/profile");

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!isAuthenticated) {
    if (isAdminPath || isProviderPath || isCustomerPrivatePath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthenticated) {
    
    if (userRole === Roles.ADMIN && isAdminPath) return NextResponse.next();
    if (userRole === Roles.PROVIDER && isProviderPath) return NextResponse.next();
    if (userRole === Roles.CUSTOMER && isCustomerPrivatePath) return NextResponse.next();

    if (isAuthPage) {
      if (userRole === Roles.ADMIN) return NextResponse.redirect(new URL("/admin", request.url));
      if (userRole === Roles.PROVIDER) return NextResponse.redirect(new URL("/provider/dashboard", request.url));
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (userRole === Roles.ADMIN) {
      if (isProviderPath || isCustomerPrivatePath) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    if (userRole === Roles.PROVIDER) {
      if (isAdminPath || isCustomerPrivatePath) {
        return NextResponse.redirect(new URL("/provider/dashboard", request.url));
      }
    }

    if (userRole === Roles.CUSTOMER || !userRole) {
      if (isAdminPath || isProviderPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * - api/auth (Better Auth handles this)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};