'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sprout, Mail, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4 bg-[#fbf9f8]/80 backdrop-blur-md border-b border-[#E8ECEF]">
        <div className="text-2xl font-bold text-[#00513f] flex items-center gap-2">
          <Sprout className="h-7 w-7 text-[#006B54]" />
          <span>AIMS</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-[480px]">
          {/* Forgot Password Card */}
          <div className="bg-white rounded-[16px] border-t-4 border-t-[#006B54] shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8 md:p-10 transition-all duration-300 relative overflow-hidden min-h-[380px]">
            {/* Form State */}
            <div
              className={`transition-all duration-500 ${
                sent
                  ? 'opacity-0 scale-95 -translate-y-4 absolute inset-0 p-8 md:p-10 pointer-events-none'
                  : 'opacity-100 scale-100 translate-y-0'
              }`}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Reset Password</h1>
                <p className="text-base text-[#666666]">Enter your email and we&apos;ll send you a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#666666] ml-4 uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative flex items-center group">
                    <Mail className="absolute left-4 h-5 w-5 text-[#6f7a74] group-focus-within:text-[#006B54] transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 rounded-full border border-[#E8ECEF] bg-white focus:outline-none focus:border-[#00876A] focus:ring-4 focus:ring-[#00876A]/10 transition-all text-base text-[#1A1A1A] placeholder:text-[#bec9c3]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#006B54] text-white py-3.5 px-8 rounded-full font-semibold text-base hover:bg-[#00876A] transition-all transform active:scale-95 shadow-lg hover:shadow-[#006B54]/20 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#006B54] hover:text-[#00876A] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to login
                </Link>
              </div>
            </div>

            {/* Success State */}
            <div
              className={`transition-all duration-500 ${
                sent
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
              }`}
            >
              {sent && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#8bf3d0] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-[#006B54]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Check your email</h2>
                  <p className="text-base text-[#666666] mb-8 max-w-sm mx-auto">
                    We&apos;ve sent a password reset link to your inbox. Please follow the instructions to secure your account.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block w-full bg-[#006B54] text-white py-3.5 px-8 rounded-full font-semibold text-base hover:bg-[#00876A] transition-all shadow-lg hover:shadow-[#006B54]/20 text-center"
                  >
                    Return to Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Icons */}
          <div className="mt-10 opacity-20 pointer-events-none select-none flex justify-center gap-8">
            <Sprout className="h-10 w-10 text-[#006B54]" />
            <ShieldCheck className="h-10 w-10 text-[#006B54]" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#E8ECEF] bg-white mt-auto">
        <div className="text-lg font-bold text-[#006B54]">AIMS</div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] hover:underline transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] hover:underline transition-colors">Terms of Service</Link>
          <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] hover:underline transition-colors">Security</Link>
          <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] hover:underline transition-colors">Help Center</Link>
        </div>
        <p className="text-sm text-[#666666]">
          © 2024 AIMS Agricultural Insurance Management System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
