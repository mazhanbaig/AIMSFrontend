'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CheckCircle, Circle, Lock, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation states
  const [password, setPassword] = useState('');
  const hasMinChars = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await apiClient.post('/api/v1/auth/forgot-password', {
        token,
        password: newPassword,
      });
      setSuccess(true);
      toast.success('Password reset successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#006B54]/5 to-transparent" />
        <CardHeader className="text-center relative">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-[#006B54]" />
          </div>
          <CardTitle className="text-2xl">Password Reset Successfully</CardTitle>
          <CardDescription>
            Your security credentials have been updated. You can now log in to your AIMS account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center relative">
          <Button asChild className="px-10">
            <Link href="/login">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <ShieldCheck className="h-8 w-8 text-[#006B54]" />
        </div>
        <CardTitle className="text-2xl">Create New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#006B54]" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#006B54]" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="pl-12"
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Security Requirements
            </p>
            <div className="flex items-center gap-3">
              {hasMinChars ? (
                <CheckCircle className="h-4 w-4 text-[#006B54]" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span className="text-sm text-gray-700">At least 8 characters</span>
            </div>
            <div className="flex items-center gap-3">
              {hasNumber ? (
                <CheckCircle className="h-4 w-4 text-[#006B54]" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span className="text-sm text-gray-700">Include at least one number</span>
            </div>
            <div className="flex items-center gap-3">
              {hasSpecial ? (
                <CheckCircle className="h-4 w-4 text-[#006B54]" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span className="text-sm text-gray-700">Include a special character (!@#)</span>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !hasMinChars || !hasNumber}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-[#006B54] hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#006B54]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
