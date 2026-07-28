'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Sprout, ShieldCheck, Leaf, Users, Shield, Building2, Bug } from 'lucide-react';
import toast from 'react-hot-toast';

interface DevUser {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantName: string;
  authSource: string;
  isActive: boolean;
}

const ROLE_BADGES: Record<string, { label: string; color: string }> = {
  PLATFORM_ADMIN: { label: 'Platform Admin', color: 'bg-purple-100 text-purple-700' },
  TENANT_ADMIN: { label: 'Tenant Admin', color: 'bg-blue-100 text-blue-700' },
  CLAIMS_OFFICER: { label: 'Claims Officer', color: 'bg-amber-100 text-amber-700' },
  UNDERWRITER: { label: 'Underwriter', color: 'bg-teal-100 text-teal-700' },
  FARMER: { label: 'Farmer', color: 'bg-green-100 text-green-700' },
};

const ROLE_ICONS: Record<string, any> = {
  PLATFORM_ADMIN: Shield,
  TENANT_ADMIN: Building2,
  CLAIMS_OFFICER: ShieldCheck,
  UNDERWRITER: Shield,
  FARMER: Leaf,
};

export default function DevLoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<DevUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${API_URL}/api/v1/dev/auth/users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setUsers(data.data || []);
        } else {
          toast.error('Failed to load users');
        }
      })
      .catch(() => toast.error('Dev backend not available'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (user: DevUser) => {
    setLoggingIn(user.id);
    try {
      const result = await signIn('dev-credentials', {
        email: user.email,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error || 'Login failed');
        return;
      }

      toast.success(`Logged in as ${user.name}`);
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('Login error');
    } finally {
      setLoggingIn(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dev Banner */}
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2">
        <Bug className="h-4 w-4" />
        DEV MODE — This page bypasses Supabase authentication. DO NOT use in production.
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Bug className="h-5 w-5 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Dev Login</h1>
        </div>
        <p className="text-[#666666] mb-8">
          Click on any user to instantly login (no password required). User accounts created via Supabase will still work through the normal login page.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-t-4 border-t-amber-500">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-1 text-amber-500" />
              <p className="text-2xl font-bold text-[#1A1A1A]">{users.length}</p>
              <p className="text-xs text-[#666666]">Total Users</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-t-4 border-t-green-500">
            <CardContent className="p-4 text-center">
              <Leaf className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {users.filter((u) => u.role === 'FARMER').length}
              </p>
              <p className="text-xs text-[#666666]">Farmers</p>
            </CardContent>
          </Card>
          <Card className="bg-white border-t-4 border-t-blue-500">
            <CardContent className="p-4 text-center">
              <Building2 className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <p className="text-2xl font-bold text-[#1A1A1A]">
                {users.filter((u) => u.role !== 'FARMER').length}
              </p>
              <p className="text-xs text-[#666666]">Staff</p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading users..." />
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-[#666666]">No users found</p>
              <p className="text-sm text-gray-400 mt-1">
                Make sure the backend is running and has users in the database
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((user) => {
              const badge = ROLE_BADGES[user.role] || {
                label: user.role,
                color: 'bg-gray-100 text-gray-700',
              };
              const Icon = ROLE_ICONS[user.role] || Users;

              return (
                <Card
                  key={user.id}
                  className={`bg-white border hover:shadow-md transition-all cursor-pointer ${
                    user.authSource === 'dev-bypass'
                      ? 'border-l-4 border-l-amber-400'
                      : 'border-l-4 border-l-[#006B54]'
                  }`}
                  onClick={() => handleLogin(user)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full p-3 bg-gray-100">
                        <Icon className="h-5 w-5 text-[#006B54]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">{user.name}</p>
                        <p className="text-sm text-[#666666]">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                          {user.authSource === 'dev-bypass' && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Dev bypass
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{user.tenantName}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-full shrink-0"
                      disabled={loggingIn === user.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogin(user);
                      }}
                    >
                      {loggingIn === user.id ? 'Logging in...' : 'Login'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
