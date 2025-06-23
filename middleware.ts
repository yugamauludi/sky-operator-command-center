import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Daftar path yang perlu proteksi
  const protectedPaths = [
    "/dashboard",
    "/location",
    "/master",
    "/reports",
    // tambahkan path lain jika perlu
  ];

  const { pathname } = request.nextUrl;

  // Cek apakah path perlu proteksi
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) return NextResponse.next();

  // Ambil token dari cookies
  const token = request.cookies.get("token")?.value;

  // Jika tidak ada token, redirect ke login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // (Opsional) Validasi token di sini jika ingin validasi signature/expired di middleware
  // Jika ingin validasi lebih lanjut, lakukan di server component atau API route

  return NextResponse.next();
}

// Aktifkan middleware hanya untuk path tertentu
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/location/:path*",
    "/master/:path*",
    "/reports/:path*",
  ],
};