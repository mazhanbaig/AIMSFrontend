'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { policyApi, claimApi, notificationApi } from '@/lib/api-client';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import {
  Sprout,
  FileText,
  ClipboardCheck,
  Receipt,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sun,
  MapPin,
  Plus,
  Activity,
  Loader2,
} from 'lucide-react';
import { getDashboardRoute } from '@/lib/auth';

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;
  const [currentDate, setCurrentDate] = useState('');

  const { data: policiesData, isLoading: policiesLoading } = useQuery({
    queryKey: ['my-policies'],
    queryFn: () => policyApi.list({ limit: 100 }),
    enabled: role === 'FARMER',
  });

  const { data: claimsData, isLoading: claimsLoading } = useQuery({
    queryKey: ['my-claims'],
    queryFn: () => claimApi.list({ limit: 100 }),
    enabled: role === 'FARMER',
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ limit: 5 }),
    enabled: role === 'FARMER',
  });

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    if (role && role !== 'FARMER') {
      const dashboard = getDashboardRoute(role);
      if (dashboard !== '/dashboard') {
        router.replace(dashboard);
      }
    }
  }, [role, router]);

  if (role && role !== 'FARMER') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Redirecting to your dashboard..." />
      </div>
    );
  }

  const policiesRes = policiesData as any;
  const claimsRes = claimsData as any;
  const notificationsRes = notificationsData as any;
  const policies = Array.isArray(policiesRes?.data) ? policiesRes.data : policiesRes?.data?.policies || [];
  const claims = Array.isArray(claimsRes?.data) ? claimsRes.data : claimsRes?.data?.claims || [];
  const notifications = Array.isArray(notificationsRes?.data) ? notificationsRes.data : notificationsRes?.data?.notifications || [];

  const activePolicies = policies.filter((p: any) => p.status === 'ACTIVE');
  const pendingClaims = claims.filter((c: any) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW');
  const approvedClaims = claims.filter((c: any) => c.status === 'APPROVED' || c.status === 'PAID');
  const rejectedClaims = claims.filter((c: any) => c.status === 'REJECTED');

  const stats = {
    totalPolicies: policies.length,
    activePolicies: activePolicies.length,
    totalClaims: claims.length,
    pendingClaims: pendingClaims.length,
  };

  const claimsStatus = {
    approved: approvedClaims.length,
    rejected: rejectedClaims.length,
    inReview: pendingClaims.length,
    total: claims.length,
  };

  const activities = notifications.slice(0, 4).map((n: any) => ({
    icon: 'policy',
    title: n.title || 'Notification',
    description: n.message || '',
    time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '',
    color: 'bg-emerald-100 text-emerald-700',
  }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const policyMonthlyData = monthNames.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((name) => ({
    month: name,
    value: Math.floor(30 + Math.random() * 70),
  }));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'policy': return FileText;
      case 'payment': return CheckCircle;
      case 'claim': return ClipboardCheck;
      case 'parcel': return MapPin;
      default: return Activity;
    }
  };

  if (policiesLoading || claimsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto w-full min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00513f]">
            Welcome back, {session?.user?.name || 'Farmer'}
          </h1>
          <p className="text-base text-[#666666]" id="current-date">{currentDate}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/policies/purchase"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#006B54] text-white rounded-full text-sm font-semibold shadow-md hover:bg-[#00876A] transition-all hover:shadow-[#006B54]/20"
          >
            <Plus className="h-4 w-4" />
            Buy New Policy
          </Link>
          <Link
            href="/claims/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#006B54] text-[#006B54] rounded-full text-sm font-semibold hover:bg-[#006B54]/5 transition-all"
          >
            <ClipboardCheck className="h-4 w-4" />
            File a Claim
          </Link>
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[#666666] rounded-full text-sm font-medium hover:bg-[#f3f4f5] transition-all"
          >
            View All Policies
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#9ef3d6] flex items-center justify-center shrink-0">
            <Receipt className="h-6 w-6 text-[#006B54]" />
          </div>
          <div>
            <p className="text-sm text-[#666666] font-medium">Total Policies</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalPolicies}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#ffddb8] flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6 text-[#855300]" />
          </div>
          <div>
            <p className="text-sm text-[#666666] font-medium">Active Policies</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.activePolicies}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#e7e8e9] flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-[#666666]" />
          </div>
          <div>
            <p className="text-sm text-[#666666] font-medium">Total Claims</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">{stats.totalClaims}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-[#ba1a1a]" />
          </div>
          <div>
            <p className="text-sm text-[#666666] font-medium">Pending Claims</p>
            <p className="text-2xl font-bold text-[#ba1a1a]">{stats.pendingClaims}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Policy Overview</h3>
            <select className="bg-[#f3f4f5] border-none rounded-full text-sm px-4 py-1.5 focus:ring-[#006B54] cursor-pointer text-[#666666]">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between px-2">
            {policyMonthlyData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center gap-2 group flex-1">
                <div
                  className="w-10 sm:w-12 rounded-t-lg transition-all duration-500 hover:opacity-80 group-hover:scale-105"
                  style={{
                    height: `${item.value}%`,
                    backgroundColor: index % 3 === 1 ? '#fea619' : '#006B54',
                    opacity: index % 3 === 1 ? 1 : 0.8,
                  }}
                />
                <span className="text-xs font-medium text-[#666666]">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#006B54] text-white p-6 rounded-[16px] shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold">24°C</h3>
                <p className="text-sm opacity-90">Springfield Farm</p>
              </div>
              <Sun className="h-12 w-12 text-[#94e8cb]" />
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-4 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <Sprout className="h-4 w-4 text-[#fea619]" />
                <p className="text-xs font-bold uppercase tracking-wider">Crop Advisory</p>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Moderate humidity detected. Ideal conditions for wheat sowing in North sector. Monitor for early blight due to morning dew forecast.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-70">Wind</p>
                <p className="text-xs font-semibold">12km/h</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-70">Humidity</p>
                <p className="text-xs font-semibold">64%</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-70">Rain</p>
                <p className="text-xs font-semibold">5%</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-6">Claim Status</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#e1e3e4" strokeWidth="3" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#006B54" strokeDasharray="60 40" strokeDashoffset="0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" strokeDasharray="20 80" strokeDashoffset="-60" strokeWidth="3" strokeLinecap="round" />
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#fea619" strokeDasharray="20 80" strokeDashoffset="-80" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#1A1A1A]">{claimsStatus.total}</span>
                <span className="text-[10px] text-[#666666] uppercase font-bold">Total</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#006B54]" />
                <span className="text-sm text-[#666666]">Approved ({claimsStatus.approved})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ba1a1a]" />
                <span className="text-sm text-[#666666]">Rejected ({claimsStatus.rejected})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#fea619]" />
                <span className="text-sm text-[#666666]">In Review ({claimsStatus.inReview})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] border border-[#E8ECEF] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Activity</h3>
            <Link href="/notifications" className="text-sm text-[#006B54] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {activities.length > 0 ? activities.map((activity: any, index: number) => {
              const Icon = getActivityIcon(activity.icon);
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 hover:bg-[#f8f9fa] rounded-xl transition-colors cursor-pointer group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{activity.title}</p>
                    <p className="text-xs text-[#666666] truncate">{activity.description}</p>
                  </div>
                  <p className="text-[11px] text-[#6f7a74] font-medium shrink-0">{activity.time}</p>
                </div>
              );
            }) : (
              <p className="text-sm text-[#666666] text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
