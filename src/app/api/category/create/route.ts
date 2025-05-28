import { API_CONFIG } from "@/config/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const timestamp = request.headers.get('x-timestamp');
    // const signature = request.headers.get('x-signature');
    const body = await request.json();
    
    // Ambil token dari cookies
    // const token = request.cookies.get('token')?.value;

    // if (!timestamp || !signature) {
    //   return NextResponse.json(
    //     { message: "Header signature tidak lengkap" },
    //     { status: 400 }
    //   );
    // }

    const headers: HeadersInit = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    //   "x-timestamp": timestamp,
    //   "x-signature": signature
    };

    // Tambahkan token ke header Cookie jika tersedia
    // if (token) {
    //   headers["Cookie"] = `token=${token}`;
    // }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORY.CREATE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // if (!response.ok) {
    //   return NextResponse.json(
    //     { message: data.message || "Gagal menambahkan lokasi" },
    //     { status: response.status }
    //   );
    // }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error detail:', error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
