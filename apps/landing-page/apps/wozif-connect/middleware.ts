import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        // Use the same cookie name as defined in your auth options (check lib/auth.ts)
        cookieName: 'wozif.session-token'
    });

    const { pathname } = req.nextUrl;

    // Public files and API routes that shouldn't be protected by middleware
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.includes('.') // favicon, etc.
    ) {
        return NextResponse.next();
    }

    if (!token) {
        const callbackUrl = req.nextUrl.href;
        const signInUrl = new URL(`${process.env.NEXT_PUBLIC_ACCOUNT_PORTAL_URL || 'http://localhost:3012'}/auth/login`, req.url);
        signInUrl.searchParams.set('callbackUrl', callbackUrl);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
