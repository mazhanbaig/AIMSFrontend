'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { navigation, getNavigationForRole } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/stores/uiStore';
import {
  ChevronLeft,
  ChevronRight,
  Sprout,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const userRole = session?.user?.role || '';
  const navItems = getNavigationForRole(userRole);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#E8ECEF] bg-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#E8ECEF]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#006B54] flex items-center justify-center">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold text-[#1A1A1A]">AIMS</span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-[#666666] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="bg-[#E8ECEF]" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
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

      {/* Bottom section */}
      <div className="p-2 border-t border-[#E8ECEF]">
        {sidebarOpen && (
          <p className="px-3 text-xs text-[#999999]">
            Agricultural Insurance Management System
          </p>
        )}
      </div>
    </aside>
  );
}
