import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Menggunakan path relatif
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
});

// Interceptor untuk menambahkan token dan header keamanan tambahan
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Menambahkan timestamp untuk mencegah caching
  config.headers['X-Timestamp'] = Date.now().toString();
  
  // Menambahkan custom header untuk identifikasi client
  config.headers['X-Client-ID'] = 'sky-command-center';
  
  return config;
});

// Interceptor untuk handling response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;