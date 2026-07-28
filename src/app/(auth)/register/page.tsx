'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
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
import { Loader2, Sprout, Building2, Leaf, ShieldCheck } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('FARMER');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password,
      phone: formData.get('phone') as string,
      role: userType,
    };

    try {
      await authApi.register(data);

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success('Account created. Please sign in.');
        router.push('/login');
        return;
      }

      toast.success('Account created successfully');
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[600px] w-full">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-[#006B54] rounded-l-2xl">
        <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tighter">AIMS</h1>
          </div>
          <p className="text-lg text-[#94e8cb]">Agricultural Insurance Management System</p>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6">
            Securing the future of global agriculture through precision insurance.
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <Leaf className="h-6 w-6 text-[#94e8cb] mb-2" />
              <p className="text-2xl font-bold text-white">1.2M+</p>
              <p className="text-sm text-[#94e8cb]">Farmers Protected</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <ShieldCheck className="h-6 w-6 text-[#94e8cb] mb-2" />
              <p className="text-2xl font-bold text-white">99.8%</p>
              <p className="text-sm text-[#94e8cb]">Claims Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-[520px] space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-8 w-8 text-[#006B54]" />
            <span className="text-2xl font-bold text-[#00513f]">AIMS</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Create Account</h1>
            <p className="text-[#666666] mt-1">Join AIMS as a Farmer or Insurance Provider</p>
          </div>

          {/* Role Selection Cards - matching stitch design */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setUserType('FARMER')}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                userType === 'FARMER'
                  ? 'border-[#006B54] bg-[#006B54]/5 shadow-[0_0_0_4px_rgba(0,107,84,0.1)] scale-[1.02]'
                  : 'border-[#E8ECEF] bg-white hover:border-[#006B54] hover:bg-gray-50'
              }`}
            >
              <Leaf className={`h-8 w-8 mb-3 transition-colors ${
                userType === 'FARMER' ? 'text-[#006B54]' : 'text-[#666666]'
              }`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${
                userType === 'FARMER' ? 'text-[#006B54]' : 'text-[#666666]'
              }`}>
                Farmer
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('CLAIMS_OFFICER')}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                userType !== 'FARMER'
                  ? 'border-[#006B54] bg-[#006B54]/5 shadow-[0_0_0_4px_rgba(0,107,84,0.1)] scale-[1.02]'
                  : 'border-[#E8ECEF] bg-white hover:border-[#006B54] hover:bg-gray-50'
              }`}
            >
              <Building2 className={`h-8 w-8 mb-3 transition-colors ${
                userType !== 'FARMER' ? 'text-[#006B54]' : 'text-[#666666]'
              }`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${
                userType !== 'FARMER' ? 'text-[#006B54]' : 'text-[#666666]'
              }`}>
                Insurance Staff
              </span>
            </button>
          </div>

          <Card className="border-t-4 border-t-[#006B54] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Details</CardTitle>
              <CardDescription>Fill in your information to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#666666] text-xs font-semibold ml-4">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="h-12 rounded-full border-[#E8ECEF] focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#666666] text-xs font-semibold ml-4">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-12 rounded-full border-[#E8ECEF] focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#666666] text-xs font-semibold ml-4">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-12 rounded-full border-[#E8ECEF] focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#666666] text-xs font-semibold ml-4">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-12 rounded-full border-[#E8ECEF] focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#666666] text-xs font-semibold ml-4">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-12 rounded-full border-[#E8ECEF] focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-center gap-3 px-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 rounded border-[#E8ECEF] text-[#006B54] focus:ring-[#006B54] cursor-pointer"
                  />
                  <Label htmlFor="terms" className="text-sm text-[#666666] cursor-pointer">
                    I agree to the{' '}
                    <Link href="#" className="text-[#006B54] font-semibold hover:underline">
                      Terms & Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#006B54] hover:bg-[#00876A] text-white font-semibold shadow-lg hover:shadow-[#006B54]/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-[#666666]">Already have an account? </span>
                <Link href="/login" className="text-[#006B54] hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
