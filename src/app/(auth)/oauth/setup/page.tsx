'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { authApi } from '@/lib/api-client';
import { ROLES } from '@/lib/constants';
import { UserRole } from '@/types';
import {
  Sprout,
  Users,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ElementType;
}

const roleOptions: RoleOption[] = [
  {
    value: ROLES.FARMER,
    label: 'Farmer',
    description: 'Purchase crop/livestock insurance, submit claims, and manage your farm profile',
    icon: Sprout,
  },
  {
    value: ROLES.CLAIMS_OFFICER,
    label: 'Claims Officer',
    description: 'Review and process insurance claims submitted by farmers',
    icon: ShieldCheck,
  },
  {
    value: ROLES.UNDERWRITER,
    label: 'Underwriter',
    description: 'Assess risk and manage insurance policy plans',
    icon: ShieldCheck,
  },
  {
    value: ROLES.TENANT_ADMIN,
    label: 'Admin / Staff',
    description: 'Full tenant-level access: manage staff, settings, analytics, and claims',
    icon: Users,
  },
];

export default function OAuthSetupPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [tenantSlug, setTenantSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // If the user is already set up (no needsSetup flag), redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (!(session.user as any).needsSetup) {
        router.push('/dashboard');
      }
    }
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session, router]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue');
      return;
    }

    // Staff/Admin roles require a tenant slug
    if (selectedRole !== ROLES.FARMER && !tenantSlug.trim()) {
      toast.error('Please enter your tenant code to continue');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.completeOAuthSetup({
        role: selectedRole,
        tenantSlug: selectedRole !== ROLES.FARMER ? tenantSlug.trim() : undefined,
        phone: phone.trim() || undefined,
      });

      setIsComplete(true);
      toast.success('Account setup complete!');

      // Update the session to reflect the new role/tenant
      await update();

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1500);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Setup failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006B54]" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Already set up - will redirect via useEffect
  if (status === 'authenticated' && !(session.user as any).needsSetup) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  // Completed state
  if (isComplete) {
    return (
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">You're all set!</CardTitle>
          <CardDescription className="text-base">
            Your account has been configured. Redirecting to dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="link" className="text-[#006B54]">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-[#006B54]/10 flex items-center justify-center">
          <Sprout className="h-7 w-7 text-[#006B54]" />
        </div>
        <CardTitle className="text-2xl">Complete your setup</CardTitle>
        <CardDescription className="text-base">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ''}! Choose how you'll use AIMS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Select Role */}
        <div>
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">
            Step 1: Select your role
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedRole === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(option.value);
                    // Clear tenant slug if switching to Farmer
                    if (option.value === ROLES.FARMER) {
                      setTenantSlug('');
                    }
                  }}
                  className={`
                    relative flex flex-col items-start gap-3 rounded-[16px] border-2 p-4 text-left
                    transition-all duration-200 hover:shadow-md
                    ${
                      isSelected
                        ? 'border-[#006B54] bg-[#006B54]/5 shadow-sm'
                        : 'border-[#E8ECEF] bg-white hover:border-[#006B54]/40'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#006B54] flex items-center justify-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`
                      rounded-full p-2.5
                      ${isSelected ? 'bg-[#006B54] text-white' : 'bg-gray-100 text-gray-600'}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{option.label}</p>
                    <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Tenant Code (for non-Farmer roles) */}
        {selectedRole && selectedRole !== ROLES.FARMER && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="border-t border-[#E8ECEF]" />
            <h3 className="text-sm font-semibold text-[#1A1A1A]">
              Step 2: Enter your tenant code
            </h3>
            <p className="text-xs text-[#666666]">
              Ask your administrator for your tenant code. This links you to your
              organization's AIMS instance.
            </p>
            <div className="space-y-2">
              <Label htmlFor="tenantSlug">Tenant Code</Label>
              <Input
                id="tenantSlug"
                placeholder="e.g. acme-farms"
                value={tenantSlug}
                onChange={(e) => setTenantSlug(e.target.value)}
                className="input-pill"
              />
            </div>
          </div>
        )}

        {/* Optional: Phone number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="phone">Phone Number</Label>
            <span className="text-xs text-[#999999]">Optional</span>
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-pill"
          />
        </div>

        {/* Submit */}
        <Button
          className="w-full btn-pill"
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up your account...
            </>
          ) : (
            <>
              Complete Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
