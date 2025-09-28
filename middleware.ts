import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// Role-specific paths based on your API response
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
  receptionist: "/dashboard/receptionist", 
  Admin: "/dashboard/admin",
};

const DEFAULT_AUTHENTICATED_PATH = "/signin";
const AUTH_PAGES = ["/", "/api/auth/signin"];

export async function middleware(req: NextRequest) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  // 1. Handle auth pages - redirect logged-in users to their appropriate dashboard
  if (session && AUTH_PAGES.includes(pathname)) {
    const role = session?.user?.role as string;
    const redirectPath = rolePaths[role] || DEFAULT_AUTHENTICATED_PATH;
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // 2. Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // 2.1 Block unauthenticated access
    if (!session) {
      const signInUrl = new URL("/", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // 2.2 Handle role-based routing within dashboard
    const role = session?.user?.role as string;
    const expectedPath = role ? rolePaths[role] : DEFAULT_AUTHENTICATED_PATH;

    // Only redirect if user isn't already on their correct path
    if (expectedPath && !pathname.startsWith(expectedPath)) {
      return NextResponse.redirect(new URL(expectedPath, req.url));
    }

    // 2.3 Additional role-based access control for specific routes
    
    // Personnel routes (all roles except Receptionist and Admin)
    const personnelRoles = ["PCO", "Wellness", "IOCR", "Settlement", "Psychosocial", "Youth", "SALP", "GBV", "Training", "Policy"];
    
    if (pathname.startsWith("/dashboard/personnel") && !personnelRoles.includes(role) && role !== "Admin") {
      return NextResponse.redirect(new URL(rolePaths[role] || DEFAULT_AUTHENTICATED_PATH, req.url));
    }

    // Receptionist route
    if (pathname.startsWith("/dashboard/receptionist") && role !== "receptionist" && role !== "Admin") {
      return NextResponse.redirect(new URL(rolePaths[role] || DEFAULT_AUTHENTICATED_PATH, req.url));
    }

    // Admin route
    if (pathname.startsWith("/dashboard/admin") && role !== "Admin") {
      return NextResponse.redirect(new URL(rolePaths[role] || DEFAULT_AUTHENTICATED_PATH, req.url));
    }

    // Specific personnel role access control
    if (pathname.startsWith("/dashboard/personnel")) {
      const pathSegments = pathname.split('/');
      const personnelType = pathSegments[3]; // Get the personnel type from /dashboard/personnel/{type}
      
      if (personnelType && personnelType !== role && role !== "Admin") {
        return NextResponse.redirect(new URL(rolePaths[role] || DEFAULT_AUTHENTICATED_PATH, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/otp-verify"],
};