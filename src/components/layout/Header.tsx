'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, Settings, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/stores/uiStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { getInitials } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { unreadCount } = useNotificationStore();

  // Fetch notifications (will update the store)
  useNotifications({ limit: 5 });

  const user = session?.user;
  const initials = user?.name ? getInitials(user.name) : '??';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E8ECEF] bg-white px-4 sm:px-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden rounded-full"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        {/* Search Bar - matching Stitch design */}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6f7a74]" />
          <input
            type="text"
            placeholder="Search parcels, policies..."
            className="w-full pl-11 pr-4 py-2 bg-[#f3f4f5] border-none rounded-full text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#006B54] focus:bg-white transition-all placeholder:text-[#6f7a74]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-[#F8F9FA]">
            <Bell className="h-5 w-5 text-[#666666]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#006B54] text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* Separator */}
        <div className="h-6 w-px bg-[#E8ECEF] mx-1 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 rounded-full hover:bg-[#F8F9FA]">
              <Avatar className="h-8 w-8 border border-[#E8ECEF]">
                <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                <AvatarFallback className="bg-[#006B54] text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-[#1A1A1A]">{user?.name || 'User'}</p>
                <p className="text-xs text-[#666666]">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-[16px] border-[#E8ECEF] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-[#1A1A1A]">{user?.name}</span>
                <span className="text-xs text-[#666666] font-normal">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E8ECEF]" />
            <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-full text-[#1A1A1A]">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="rounded-full text-[#1A1A1A]">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#E8ECEF]" />
            <DropdownMenuItem
              onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
              className="rounded-full text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
