export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  role: 'admin' | 'user';
}