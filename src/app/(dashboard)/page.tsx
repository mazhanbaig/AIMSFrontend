'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, FileText, ClipboardCheck, Shield, ArrowRight } from 'lucide-react';
import { getDashboardRoute } from '@/lib/auth';

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  // Redirect non-farmer roles to their respective dashboards
  useEffect(() => {
    if (role && role !== 'FARMER') {
      const dashboard = getDashboardRoute(role);
      if (dashboard !== '/dashboard') {
        router.push(dashboard);
      }
    }
  }, [role, router]);

  const quickActions = [
    {
      title: 'My Policies',
      description: 'View and manage your insurance policies',
      icon: FileText,
      href: '/policies',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Submit Claim',
      description: 'File a new insurance claim',
      icon: ClipboardCheck,
      href: '/claims/create',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'My Claims',
      description: 'Track your claim status',
      icon: Shield,
      href: '/claims',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Purchase Policy',
      description: 'Browse and buy insurance plans',
      icon: Sprout,
      href: '/policies/purchase',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {session?.user?.name || 'Farmer'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your agricultural insurance policies and claims
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              onClick={() => router.push(action.href)}
            >
              <CardHeader className="pb-2">
                <div className="rounded-full w-10 h-10 flex items-center justify-center" style={{ backgroundColor: action.color.replace('text-', 'bg-').replace('600', '100') }}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">{action.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">Complete your profile</h3>
              <p className="text-sm text-blue-700 mt-1">
                Add your farmer profile details to get started
              </p>
            </div>
            <Button size="sm" onClick={() => router.push('/farmers/profile')}>
              Go to Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-start gap-4 p-3 bg-green-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-green-900">Purchase your first policy</h3>
              <p className="text-sm text-green-700 mt-1">
                Browse available plans and protect your farm
              </p>
            </div>
            <Button size="sm" onClick={() => router.push('/policies/purchase')}>
              Browse Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
