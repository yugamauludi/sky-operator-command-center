import { API_CONFIG } from "@/config/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers: HeadersInit = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    //   "x-timestamp": timestamp,
    //   "x-signature": signature
    };
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DESCRIPTION.CREATE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error detail:', error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
