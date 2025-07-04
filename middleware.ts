import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname.startsWith('/Images')) {
        return NextResponse.next()
    }

    return NextResponse.next();

    // if (!token) {
    //     // No token, allow requests to these paths
    //     if (pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
    //         return NextResponse.next();
    //     }
    //     // Redirect if trying to access protected pages without a token
    //     url.pathname = '/hop-in';
    //     return NextResponse.redirect(url);
    // }

    // try {
    //     const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    //     await jwtVerify(token, secret);

    //     if (pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
    //         url.pathname = '/';
    //         return NextResponse.redirect(url);
    //     }

    //     return NextResponse.next();
    // } catch (error) {
    //     console.error('JWT Verification Error:', error);

    //     // Invalid token, redirect to /hop-in
    //     if (!(pathname.startsWith('/hop-in') || pathname.startsWith('/auth') || pathname.startsWith('/reset-password'))) {
    //         url.pathname = '/hop-in';
    //         return NextResponse.redirect(url);
    //     }
    //     return NextResponse.next();
    // }
}

export const config = {
    matcher: ['/:path*']
};
