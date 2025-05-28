// Konfigurasi API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  ENDPOINTS: {
    CATEGORY: {
      GET_ALL: '/api/category/get-all',
      CREATE: '/api/category/create',
      UPDATE: (id: number) => `/api/category/update/${id}`,
      DELETE: (id: number) => `/api/category/delete/${id}`,
      DETAIL: (id: number) => `/api/category/get-byid/${id}`,
    },
    DESCRIPTION: {
      GET_ALL: '/api/description/get-all',
      CREATE: '/api/description/create',
      UPDATE: (id: number) => `/api/description/update/${id}`,
      DELETE: (id: number) => `/api/description/delete/${id}`,
    },
    // Tambahkan endpoint lain di sini
  }
};
