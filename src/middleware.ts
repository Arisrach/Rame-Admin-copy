import { NextRequest, NextResponse } from 'next/server';

// Protect all routes except login page, logout page, and auth API
export function middleware(request: NextRequest) {
  // Allow access to login page, logout page, and auth API endpoints
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname === '/logout' || 
      request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // For this demo implementation, we'll check for a simple token in cookies
  // In a real application, you would validate a JWT token or session
  
  // This is a simplified check - in a real app you'd validate a JWT or session properly
  const token = request.cookies.get('auth_token') || 
                request.headers.get('Authorization')?.replace('Bearer ', '');
  
  // For demonstration purposes, we'll also check if localStorage has user data (client-side)
  // But in a real app, we'd validate a proper authentication token
  if (!token) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific paths - protect dashboard and other protected routes
export const config = {
  matcher: [
    // Protect specific routes that require authentication
    '/dashboard/:path*',
    // Add more protected routes here as needed
    // '/admin/:path*',
    // '/settings/:path*',
  ],
};