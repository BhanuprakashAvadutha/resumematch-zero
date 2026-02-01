import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    // Create a response that we'll modify
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Create Supabase client with cookie handling
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    // First set cookies on the request (for downstream handlers)
                    cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => {
                        request.cookies.set(name, value);
                    });

                    // Create fresh response with updated request
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });

                    // Then set cookies on the response (for the browser)
                    cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: Record<string, unknown> }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // IMPORTANT: This refreshes the session if expired
    // and ensures cookies are properly set
    const { data: { user } } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Protected routes - redirect to login if not authenticated
    const protectedRoutes = ['/scanner', '/history', '/profile', '/resume/builder'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect logged-in users away from auth pages
    const authRoutes = ['/login', '/signup'];
    const isAuthRoute = authRoutes.includes(pathname);

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - API routes (they handle their own auth)
         * - Public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
