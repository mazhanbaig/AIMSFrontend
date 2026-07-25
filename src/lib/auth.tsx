import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { UserRole } from '@/types';

/**
 * Higher-order component for role-based route protection
 * @param Component - The component to wrap
 * @param requiredRoles - Optional array of allowed roles
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      if (requiredRoles && session?.user) {
        const userRole = session.user.role as UserRole;
        if (!requiredRoles.includes(userRole)) {
          router.push('/dashboard');
        }
      }
    }, [status, session, router]);

    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}

/**
 * Check if user has required role
 */
export function hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user role is a staff role (non-farmer)
 */
export function isStaffRole(role: string): boolean {
  return ['CLAIMS_OFFICER', 'UNDERWRITER', 'TENANT_ADMIN', 'PLATFORM_ADMIN'].includes(role);
}

/**
 * Check if user role is admin
 */
export function isAdminRole(role: string): boolean {
  return ['TENANT_ADMIN', 'PLATFORM_ADMIN'].includes(role);
}

/**
 * Get dashboard home route based on role
 */
export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'FARMER':
      return '/dashboard';
    case 'PLATFORM_ADMIN':
      return '/platform/tenants';
    case 'TENANT_ADMIN':
      return '/admin/dashboard';
    default:
      return '/admin/dashboard';
  }
}
