import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Debug logging
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Token exists:', !!token);

    if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname.startsWith('/Images')) {
        return NextResponse.next(); // Allow Next.js static files
    }

    if (!token) {
        // No token, allow requests to these paths
        if (pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
            return NextResponse.next();
        }
        // Redirect if trying to access protected pages without a token
        url.pathname = '/hop-in';
        return NextResponse.redirect(url);
    }

    try {
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);

        // Debug logging
        console.log('Middleware - Token verified successfully');
        console.log('Middleware - User payload:', payload);

        // Token is valid, redirect away from public pages to home page
        if (pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware - JWT Verification Error:', error);

        // Clear invalid token
        const response = NextResponse.redirect(new URL('/hop-in', req.url));
        response.cookies.delete('token');

        // Redirect to login if trying to access protected pages
        if (!(pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password'))) {
            url.pathname = '/hop-in';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/:path*']
};
