import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: any) {
    const path = req.nextUrl.pathname;

    // Public paths
    if (
        path.startsWith('/api/auth') ||
        path.startsWith('/_next') ||
        path.includes('favicon.ico') ||
        path === '/auth/login' ||
        path === '/auth/register' ||
        path.startsWith('/checkout')
    ) {
        return NextResponse.next();
    }

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: "wozif.session-token"
    });

    if (!token) {
        // Redirect to local login page with callbackUrl
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
