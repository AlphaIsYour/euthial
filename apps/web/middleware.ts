import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/admin": ["ADMIN"],
  "/tenant": ["TENANT", "ADMIN"],
  "/investor": ["INVESTOR", "ADMIN"],
  "/landlord": ["LANDLORD", "ADMIN"],
  "/inspector": ["INSPECTOR", "ADMIN"],
  "/contractor": ["CONTRACTOR", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes, static assets, and APIs
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check if path requires role protection
  const matchedRoute = Object.keys(ROLE_PERMISSIONS).find(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  // 3. Get JWT token
  const secret = process.env.AUTH_SECRET || "euthial-protocol-secret-key-development-mode-2026";
  const token = await getToken({ req: request, secret });

  // 4. Check for Demo Simulation bypass (cookie or query param for Hackathon Jury)
  const juryPreviewRole = request.cookies.get("euthial_preview_role")?.value;
  const isJuryBypass = request.nextUrl.searchParams.get("jury") === "preview" || !!juryPreviewRole;

  if (isJuryBypass) {
    const response = NextResponse.next();
    response.headers.set("x-euthial-role-verified", "jury-preview");
    return response;
  }

  // 5. Unauthenticated redirect to /login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Role-Based Access Control check
  const allowedRoles = ROLE_PERMISSIONS[matchedRoute];
  const userRole = ((token.role as string) || "VIEWER").toUpperCase();

  if (!allowedRoles.includes(userRole)) {
    // Redirect to their default dashboard or /demo with warning
    const defaultRedirect =
      userRole === "TENANT"
        ? "/tenant"
        : userRole === "LANDLORD"
        ? "/landlord"
        : userRole === "INVESTOR"
        ? "/investor"
        : userRole === "INSPECTOR"
        ? "/inspector"
        : userRole === "CONTRACTOR"
        ? "/contractor"
        : "/demo";

    const deniedUrl = new URL(defaultRedirect, request.url);
    deniedUrl.searchParams.set("access_denied", "true");
    deniedUrl.searchParams.set("required_role", allowedRoles.join("/"));
    return NextResponse.redirect(deniedUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-user-role", userRole);
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tenant/:path*",
    "/investor/:path*",
    "/landlord/:path*",
    "/inspector/:path*",
    "/contractor/:path*",
    "/profile/:path*",
  ],
};
