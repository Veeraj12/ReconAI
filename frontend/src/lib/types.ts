export type UserRole = "viewer" | "accountant" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: true;
  user: AuthUser;
}

export interface MeResponse {
  success: true;
  user: AuthUser;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: true;
  user: AuthUser;
}
