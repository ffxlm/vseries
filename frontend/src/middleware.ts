import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const jwtSecret = process.env.JWT_SECRET;

async function verifyAdminToken(token: string | undefined) {
  if (!token || !jwtSecret) return false;

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('admin_token');
  response.cookies.delete('admin_csrf');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;
  const hasValidAdminToken = await verifyAdminToken(token);

  // Protect /admin routes (excluding /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!hasValidAdminToken) {
      return redirectToLogin(request);
    }
  }

  // Redirect authenticated admins away from login page to dashboard
  if (pathname === '/admin/login') {
    if (hasValidAdminToken) {
      const dashboardUrl = new URL('/admin', request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    if (token) {
      const response = NextResponse.next();
      response.cookies.delete('admin_token');
      response.cookies.delete('admin_csrf');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
