import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (token) {
    if (pathname === '/') {
      const needsSetup = (token as any).needsSetup === true;
      return NextResponse.redirect(
        new URL(needsSetup ? '/oauth/setup' : '/dashboard', req.url)
      );
    }
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    if (pathname.startsWith('/oauth/setup')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/oauth/setup'],
};
