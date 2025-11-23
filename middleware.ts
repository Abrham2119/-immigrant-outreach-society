import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Role-specific paths - UPDATED with Personnel Admin
const rolePaths: Record<string, string> = {
  PCO: "/dashboard/personnel/PCO",
  Wellness: "/dashboard/personnel/Wellness",
  IOCR: "/dashboard/personnel/IOCR",
  Settlement: "/dashboard/personnel/Settlement",
  Psychosocial: "/dashboard/personnel/Psychosocial",
  Youth: "/dashboard/personnel/Youth",
  SALP: "/dashboard/personnel/SALP",
  GBV: "/dashboard/personnel/GBV",
  Training: "/dashboard/personnel/Training",
  Policy: "/dashboard/personnel/Policy",
  Receptionist: "/dashboard/receptionist",
  Admin: "/dashboard/admin",
  "Personnel Admin": "/dashboard/PersonnelAdmin",
};

const DEFAULT_AUTHENTICATED_PATH = "/dashboard";
const AUTH_PAGES = ["/", "/signin"];

export async function middleware(req: NextRequest) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  console.log("Middleware - Path:", pathname, "Role:", session?.user?.role);

  // 1. Handle auth pages - redirect logged-in users to their appropriate dashboard
  if (session && AUTH_PAGES.includes(pathname)) {
    const role = session?.user?.role as string;
    const redirectPath = rolePaths[role] || DEFAULT_AUTHENTICATED_PATH;
    console.log("Redirecting from auth page to:", redirectPath);
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // 2. Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // 2.1 Block unauthenticated access
    if (!session) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      console.log("No session, redirecting to signin");
      return NextResponse.redirect(signInUrl);
    }

    const role = session?.user?.role as string;
    const expectedPath = rolePaths[role];

    // 2.2 Only redirect if user isn't already on their correct path
    if (expectedPath && !pathname.startsWith(expectedPath)) {
      console.log("Role-based redirect to:", expectedPath);
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }

    // 2.3 Additional role-based access control
    const personnelRoles = ["PCO", "Wellness", "IOCR", "Settlement", "Psychosocial", "Youth", "SALP", "GBV", "Training", "Policy"];
    const adminRoles = ["Admin", "Personnel Admin"]; // UPDATED: Both Admin and Personnel Admin have admin access

    // Personnel routes access control
    if (pathname.startsWith("/dashboard/personnel") && !personnelRoles.includes(role) && !adminRoles.includes(role)) {
      console.log("Unauthorized personnel access, redirecting to:", expectedPath);
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }

    // Receptionist route access control
    if (pathname.startsWith("/dashboard/receptionist") && role !== "Receptionist" && !adminRoles.includes(role)) {
      console.log("Unauthorized receptionist access, redirecting to:", expectedPath);
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }

    // Admin route access control - UPDATED to include Personnel Admin
    if (pathname.startsWith("/dashboard/admin") && !adminRoles.includes(role)) {
      console.log("Unauthorized admin access, redirecting to:", expectedPath);
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/dashboard/:path*"],
};