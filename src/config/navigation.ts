import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  ClipboardCheck,
  Settings,
  UserCog,
  Building2,
  Bell,
  User,
  CreditCard,
  MapPin,
  Upload,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  children?: NavItem[];
}

/**
 * Navigation items grouped by role
 */
export const navigation: NavItem[] = [
  // Farmer navigation
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['FARMER', 'CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN', 'PLATFORM_ADMIN'],
  },
  {
    label: 'My Profile',
    href: '/farmers/profile',
    icon: User,
    roles: ['FARMER'],
  },
  {
    label: 'Land Parcels',
    href: '/farmers/parcels',
    icon: MapPin,
    roles: ['FARMER'],
  },
  {
    label: 'My Policies',
    href: '/policies',
    icon: FileText,
    roles: ['FARMER'],
  },
  {
    label: 'Purchase Policy',
    href: '/policies/purchase',
    icon: ShieldAlert,
    roles: ['FARMER'],
  },
  {
    label: 'My Claims',
    href: '/claims',
    icon: ClipboardCheck,
    roles: ['FARMER'],
  },
  {
    label: 'Submit Claim',
    href: '/claims/create',
    icon: Upload,
    roles: ['FARMER'],
  },

  // Staff & Admin navigation
  {
    label: 'Admin Dashboard',
    href: '/admin/dashboard',
    icon: BarChart3,
    roles: ['CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN'],
  },
  {
    label: 'Manage Farmers',
    href: '/admin/farmers',
    icon: Users,
    roles: ['CLAIMS_OFFICER', 'TENANT_ADMIN'],
  },
  {
    label: 'Manage Policies',
    href: '/admin/policies',
    icon: FileText,
    roles: ['CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN'],
  },
  {
    label: 'Manage Claims',
    href: '/admin/claims',
    icon: ClipboardCheck,
    roles: ['CLAIMS_OFFICER', 'TENANT_ADMIN'],
  },
  {
    label: 'Manage Staff',
    href: '/admin/staff',
    icon: UserCog,
    roles: ['TENANT_ADMIN'],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['TENANT_ADMIN'],
  },
  {
    label: 'Billing',
    href: '/admin/billing',
    icon: CreditCard,
    roles: ['TENANT_ADMIN'],
  },

  // Platform Admin navigation
  {
    label: 'Tenants',
    href: '/platform/tenants',
    icon: Building2,
    roles: ['PLATFORM_ADMIN'],
  },
  {
    label: 'Platform Analytics',
    href: '/platform/analytics',
    icon: BarChart3,
    roles: ['PLATFORM_ADMIN'],
  },

  // Common navigation
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    roles: ['FARMER', 'CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN', 'PLATFORM_ADMIN'],
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['FARMER', 'CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN', 'PLATFORM_ADMIN'],
  },
];

/**
 * Get navigation items for a specific role
 */
export function getNavigationForRole(role: string): NavItem[] {
  return navigation.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });
}
