import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

console.log("🔥 MIDDLEWARE LOADED!");

export async function middleware(request: NextRequest) {
    console.log("🚀 Path:", request.nextUrl.pathname);
    const { pathname } = request.nextUrl;
    
    // Early exit for API routes (e.g., your route.ts for products)
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Existing asset exclusions (redundant with matcher but harmless)
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/_vercel/') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const cookies = request.cookies;
    const response = NextResponse.next();

    if (cookies.get("refreshToken")) {
        return response;
    }

    try {
        const wixClient = createClient({
            auth: OAuthStrategy({
                clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,           
            })
        });

        const tokens = await wixClient.auth.generateVisitorTokens();
        
        response.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            maxAge: 60 * 60 * 24 * 30,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        
        return response;
    } catch (error) {
        console.error('Middleware token generation error:', error);
        return response;
    }
}

export const config = {
    matcher: [
        '/',                    // Home (dynamic)
        '/products/:path*',     // Slug pages (dynamic)
        '/list',                // List page (dynamic)
        '/deals',               // Deals page (dynamic)
        '/categories',          // Categories page (dynamic)
        '/cart',                // Cart page (dynamic)
        '/profile',             // Profile page (dynamic)
        '/orders/:path*',       // Order details (dynamic)
        '/authentication',      // Auth page (dynamic)
        '/success',             // Success page (dynamic, post-checkout with search params and redirect)
    ],
};