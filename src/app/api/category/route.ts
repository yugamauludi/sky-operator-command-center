import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORY.GET_ALL}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

