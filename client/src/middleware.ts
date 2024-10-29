import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  
  const adminToken = request.cookies.get("adminToken");
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/admin-login") {
    return NextResponse.next();
  }
  // If the request is for an admin route and no token is found, redirect to login
  if (pathname.startsWith("/admin") && !adminToken) {
    const loginUrl = new URL("/admin/admin-login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
// Configure the matcher to apply this middleware to all `/admin` routes except the login page
export const config = {
  matcher: ["/admin/:path*"],
};
