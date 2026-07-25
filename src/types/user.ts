export type UserRole = 'FARMER' | 'CLAIMS_OFFICER' | 'UNDERWRITER' | 'TENANT_ADMIN' | 'PLATFORM_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  farmerId?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  farmerId?: string;
  avatar?: string;
  /** Indicates the user needs to complete OAuth setup (choose role/tenant) */
  needsSetup?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  tenantSlug?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
