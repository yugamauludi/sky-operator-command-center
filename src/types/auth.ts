export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}