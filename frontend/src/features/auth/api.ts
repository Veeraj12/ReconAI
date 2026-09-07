import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from "./types";

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>("/api/v1/auth/register/", data),

  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>("/api/v1/auth/login/", credentials),

  logout: () => apiClient.post<{ success: true }>("/api/v1/auth/logout/"),

  me: () => apiClient.get<MeResponse>("/api/v1/auth/me/"),
};
