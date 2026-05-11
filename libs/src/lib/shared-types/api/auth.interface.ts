import { User } from '../models/user.model';
import { TrustLevel } from '../enums';

export const TOKEN_KEYS = {
  USER_TOKEN: 'dcms_user_token',
  ADMIN_TOKEN: 'dcms_admin_token',
  REFRESH_TOKEN: 'dcms_refresh_token',
} as const;

export type AuthRole = 'user' | 'admin' | 'leader';

export interface AuthTokenPayload {
  sub: string;
  role: AuthRole;
  email: string;
  trustLevel?: TrustLevel;
  iat: number;
  exp: number;
  impersonatedBy?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export type AdminRole = 'super_admin' | 'operations' | 'support' | 'finance';

export interface AdminPermissions {
  canApprovePayments: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canEditSettings: boolean;
  canManageAdmins: boolean;
}

export interface AdminLoginResponse {
  admin: User;
  token: string;
  refreshToken: string;
  permissions: AdminPermissions;
}
