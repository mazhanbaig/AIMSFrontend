'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { getNavigationForRole } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';import {
  HelpCircle,
  LogOut,
  Plus,
  Sprout,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { getInitials } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const userRole = session?.user?.role || '';
  const navItems = getNavigationForRole(userRole);
  const user = session?.user;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#E8ECEF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#E8ECEF]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#006B54] flex items-center justify-center shrink-0">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold text-[#00513f]">AIMS</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1A1A1A] rounded-full shrink-0"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Profile Section */}
      {sidebarOpen && user && (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8ECEF]">
          <Avatar className="h-10 w-10 shrink-0 border border-[#E8ECEF]">
            <AvatarImage src={user.avatar || ''} alt={user.name || ''} />
            <AvatarFallback className="bg-[#006B54] text-white text-sm">
              {user.name ? getInitials(user.name) : '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user.name || 'User'}</p>
            <p className="text-xs text-[#666666] truncate">
              {userRole?.replace(/_/g, ' ') || 'User'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#006B54] text-white shadow-sm'
                  : 'text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-[#666666]')} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-2 border-t border-[#E8ECEF] space-y-2">
        {/* Register New Land Button - only show for farmers */}
        {(userRole === 'FARMER' || !userRole) && sidebarOpen && (
          <Button
            className="w-full bg-[#006B54]/10 text-[#006B54] font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#006B54]/20 transition-all shadow-sm text-sm"
            onClick={() => router.push('/farmers/parcels')}
          >
            <Plus className="h-4 w-4" />
            Register New Land
          </Button>
        )}

        {/* Help Center */}
        <Link
          href="#"
          className={cn(
            'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1A1A1A] transition-all duration-200',
            !sidebarOpen && 'justify-center px-0'
          )}
        >
          <HelpCircle className="h-5 w-5 shrink-0 text-[#666666]" />
          {sidebarOpen && <span>Help Center</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
          className={cn(
            'flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full',
            !sidebarOpen && 'justify-center px-0'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-red-600" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
