import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        try {
            // Get the JWT token using next-auth's getToken helper
            const token = await getToken({
                req: request,
                secret: process.env.NEXTAUTH_SECRET,
            });

            // If no token exists, redirect to login
            if (!token) {
                const loginUrl = new URL("/auth/signin", request.url);
                loginUrl.searchParams.set(
                    "callbackUrl",
                    request.nextUrl.pathname
                );
                return NextResponse.redirect(loginUrl);
            }

            // Check if the token has the admin role
            if (!token.role || token.role !== "admin") {
                return NextResponse.redirect(new URL("/", request.url));
            }

            // If everything is fine, continue
            return NextResponse.next();
        } catch (error) {
            console.error("Middleware error:", error);
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths starting with /admin
        "/admin/:path*",
        // Exclude /admin/login from middleware
        "/((?!admin/login).*)",
    ],
};
