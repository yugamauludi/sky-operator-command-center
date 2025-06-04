// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from './lib/auth';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('auth-token')?.value;
//   const { pathname } = request.nextUrl;

//   // Protected routes - sesuaikan dengan kebutuhan
//   const protectedPaths = ['/dashboard', '/profile', '/admin'];
//   const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

//   // Public routes yang tidak perlu auth
//   const publicPaths = ['/login', '/register', '/'];
//   const isPublicPath = publicPaths.includes(pathname);

//   if (isProtectedPath) {
//     if (!token || !verifyToken(token)) {
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('redirect', pathname);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // Redirect ke dashboard jika sudah login dan akses login page
//   if (isPublicPath && pathname === '/login' && token && verifyToken(token)) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// };