import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname.toLowerCase();

    const publicPaths = [
        "/auth/login",
        "/auth/checkemail",
        "/auth/verifyemail",
    ];

    const isPublicPath = publicPaths.includes(path);
    const token = request.cookies.get("Accesstoken")?.value || "";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        '/',
        '/auth/login',
        '/auth/checkemail',
        '/auth/verifyemail',
    ]
}

