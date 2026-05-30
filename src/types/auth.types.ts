import { Role } from "@/features/auth/constants/roles";

export { Role };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string | null;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  username?: string;
  name: string;
  password: string;
  role: Role;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  role?: Role;
  isActive?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}
