// src/types/auth.types.ts
export interface User {
  id: number;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: 'admin' | 'provider' | 'customer';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: 'admin' | 'provider' | 'customer';
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}
