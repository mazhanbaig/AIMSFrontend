import { UserRole } from '@/types';
import { ROLES } from '@/lib/constants';

export interface RoleConfig {
  label: string;
  description: string;
  permissions: string[];
}

export const roleConfig: Record<UserRole, RoleConfig> = {
  [ROLES.FARMER]: {
    label: 'Farmer',
    description: 'Can purchase policies, submit claims, and manage their profile',
    permissions: [
      'dashboard:view',
      'policies:view',
      'policies:purchase',
      'claims:view',
      'claims:create',
      'farmers:profile:view',
      'farmers:profile:edit',
      'parcels:manage',
      'notifications:view',
    ],
  },
  [ROLES.CLAIMS_OFFICER]: {
    label: 'Claims Officer',
    description: 'Can review and process claims',
    permissions: [
      'dashboard:view',
      'claims:view',
      'claims:review',
      'claims:assign',
      'claims:updateStatus',
      'farmers:view',
      'policies:view',
      'documents:view',
      'notifications:view',
    ],
  },
  [ROLES.UNDERWRITER]: {
    label: 'Underwriter',
    description: 'Can manage policies and assess risk',
    permissions: [
      'dashboard:view',
      'policies:view',
      'policies:manage',
      'policyPlans:view',
      'policyPlans:manage',
      'farmers:view',
      'claims:view',
      'notifications:view',
    ],
  },
  [ROLES.TENANT_ADMIN]: {
    label: 'Tenant Admin',
    description: 'Full access to tenant features including staff management and settings',
    permissions: [
      'dashboard:view',
      'admin:full',
      'staff:manage',
      'settings:manage',
      'fields:manage',
      'fraud:manage',
      'iam:manage',
      'billing:view',
      'billing:manage',
      'claims:view',
      'claims:review',
      'policies:view',
      'policies:manage',
      'farmers:view',
      'farmers:manage',
      'import:manage',
      'notifications:view',
    ],
  },
  [ROLES.PLATFORM_ADMIN]: {
    label: 'Platform Admin',
    description: 'Full platform-wide access including tenant management',
    permissions: [
      'admin:full',
      'platform:full',
      'tenants:manage',
      'tenants:seed',
      'platform:analytics',
      'users:manage',
    ],
  },
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const config = roleConfig[role];
  if (!config) return false;
  // Full access roles have all permissions
  if (config.permissions.includes('admin:full') || config.permissions.includes('platform:full')) {
    return true;
  }
  return config.permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): string[] {
  return roleConfig[role]?.permissions || [];
}
