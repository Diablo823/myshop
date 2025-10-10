// import { createClient, OAuthStrategy } from "@wix/sdk";
// import { NextRequest, NextResponse } from "next/server";


// export const middleware = async (request: NextRequest) => {
//     const cookies = request.cookies;
//     const response = NextResponse.next();

//     if (cookies.get("refreshToken")) {
//         return response;
//     }

//     const wixClient = createClient({
//         auth: OAuthStrategy({
//             clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,           
//         })
//     })

//     const tokens = await wixClient.auth.generateVisitorTokens();
//     response.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken),{
//         maxAge: 60 * 60 * 24 * 30,
//     });

//     return response;
// };


// new middleware

import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    
    // Skip middleware for static assets and Next.js internals
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/_vercel/') ||
        pathname.includes('.') || // Any file with extension (images, fonts, etc.)
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    const cookies = request.cookies;
    const response = NextResponse.next();

    // If refresh token already exists, skip token generation
    if (cookies.get("refreshToken")) {
        return response;
    }

    // Generate visitor tokens for page requests
    try {
        const wixClient = createClient({
            auth: OAuthStrategy({
                clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,           
            })
        });

        const tokens = await wixClient.auth.generateVisitorTokens();
        
        response.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: false, // Must be false so js-cookie can read it in WixContext
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
            path: '/',
        });
        
        return response;
    } catch (error) {
        console.error('Middleware token generation error:', error);
        // Don't block the request if token generation fails
        return response;
    }
};

// Configure which routes middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - Files with extensions (images, fonts, css, js, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf|eot)$).*)',
    ],
};