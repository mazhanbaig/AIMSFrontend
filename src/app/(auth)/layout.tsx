import { Metadata } from 'next';
import { Sprout } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-full bg-[#006B54] flex items-center justify-center">
          <Sprout className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-[#1A1A1A]">AIMS</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
      <p className="mt-8 text-sm text-[#999999]">
        Agricultural Insurance Management System
      </p>
    </div>
  );
}
