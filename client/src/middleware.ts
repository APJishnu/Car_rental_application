import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(request: NextRequest) {
  // Retrieve the adminToken cookie from the request
  const adminToken = request.cookies.get('adminToken');
  console.log(adminToken)

  const { pathname } = request.nextUrl;

  // Exclude the /admin/admin-login route from the redirect loop
  if (pathname === '/admin/admin-login') {
    return NextResponse.next(); // Allow access to the login page
  }

  // If the request is for an admin route and no token is found, redirect to login
  if (pathname.startsWith('/admin') && !adminToken) {
    const loginUrl = new URL('/admin/admin-login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the token exists or the route is not protected, proceed with the request
  return NextResponse.next();
}

// Configure the matcher to apply this middleware to all `/admin` routes except the login page
export const config = {
  matcher: ['/admin/:path*'], // Apply the middleware to all admin routes
};
