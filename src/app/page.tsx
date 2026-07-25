import Link from 'next/link';
import {
  Sprout,
  Shield,
  FileText,
  ClipboardCheck,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Zap,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ───── Navigation ───── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8ECEF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[#006B54] flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A1A1A]">AIMS</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-[#666666] hover:text-[#006B54] transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-[#666666] hover:text-[#006B54] transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-[#666666] hover:text-[#006B54] transition-colors"
              >
                About
              </Link>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-[#006B54] hover:text-[#004D3C] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#006B54] text-white text-sm font-semibold hover:bg-[#00876A] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ───── Hero Section ───── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F0FDF8] via-white to-[#E8F5F0]">
          {/* Background decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#006B54]/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#00A889]/5 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#006B54]/10 text-[#006B54] text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Agricultural Insurance Platform
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
                  Protect Your Farm.{' '}
                  <span className="text-[#006B54]">Secure Your Future.</span>
                </h1>

                <p className="text-lg text-[#666666] max-w-lg leading-relaxed">
                  A comprehensive platform for managing agricultural insurance policies,
                  submitting claims, and detecting fraud — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#006B54] text-white font-semibold text-base hover:bg-[#00876A] transition-all duration-200 shadow-lg shadow-[#006B54]/25 hover:shadow-xl hover:shadow-[#006B54]/30 hover:-translate-y-0.5"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#E8ECEF] bg-white text-[#1A1A1A] font-semibold text-base hover:border-[#006B54]/30 hover:bg-[#F8F9FA] transition-all duration-200"
                  >
                    Sign In
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                    <span className="text-sm text-[#666666]">Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                    <span className="text-sm text-[#666666]">No hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                    <span className="text-sm text-[#666666]">Secure platform</span>
                  </div>
                </div>
              </div>

              {/* Right: Illustration / Cards */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, label: 'Insurance Policies', count: '50+', color: 'bg-blue-50 text-blue-600' },
                  { icon: ClipboardCheck, label: 'Claims Processed', count: '10K+', color: 'bg-green-50 text-green-600' },
                  { icon: Users, label: 'Farmers Protected', count: '5K+', color: 'bg-purple-50 text-purple-600' },
                  { icon: BarChart3, label: 'Fraud Detected', count: '99.5%', color: 'bg-orange-50 text-orange-600' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-[16px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E8ECEF] hover:shadow-lg transition-shadow"
                    >
                      <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-3 ${stat.color.split(' ')[0]}`}>
                        <Icon className={`h-5 w-5 ${stat.color.split(' ')[1]}`} />
                      </div>
                      <p className="text-2xl font-bold text-[#1A1A1A]">{stat.count}</p>
                      <p className="text-sm text-[#666666] mt-0.5">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ───── Features Section ───── */}
        <section id="features" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Everything you need to manage your agricultural insurance
              </h2>
              <p className="text-lg text-[#666666]">
                From purchasing policies to submitting claims and detecting fraud,
                AIMS provides a complete toolkit for farmers, insurers, and administrators.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  title: 'Policy Management',
                  description: 'Browse, compare, and purchase insurance plans tailored to your crops, livestock, and farm assets.',
                  color: 'bg-blue-50 text-blue-600',
                },
                {
                  icon: ClipboardCheck,
                  title: 'Claim Submission',
                  description: 'Submit claims with supporting documents and track their status in real-time from submission to payout.',
                  color: 'bg-green-50 text-green-600',
                },
                {
                  icon: Shield,
                  title: 'Fraud Detection',
                  description: 'AI-powered fraud analysis scores each claim, helping officers identify suspicious activity instantly.',
                  color: 'bg-purple-50 text-purple-600',
                },
                {
                  icon: BarChart3,
                  title: 'Analytics & Reports',
                  description: 'Comprehensive dashboards with real-time metrics, charts, and exportable reports for informed decisions.',
                  color: 'bg-orange-50 text-orange-600',
                },
                {
                  icon: MapPin,
                  title: 'Land Parcel Mapping',
                  description: 'Register and manage your land parcels with location data, crop information, and field measurements.',
                  color: 'bg-red-50 text-red-600',
                },
                {
                  icon: Users,
                  title: 'Multi-Tenant Support',
                  description: 'Enterprise-grade multi-tenant architecture with role-based access for farmers, staff, and admins.',
                  color: 'bg-teal-50 text-teal-600',
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-[16px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E8ECEF] hover:shadow-lg hover:border-[#006B54]/20 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.color.split(' ')[0]} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${feature.color.split(' ')[1]}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── How It Works Section ───── */}
        <section id="how-it-works" className="py-20 md:py-28 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                How It Works
              </h2>
              <p className="text-lg text-[#666666]">
                Getting started with AIMS is simple. Follow these steps to protect your farm.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-[#006B54]/30 via-[#006B54] to-[#006B54]/30" />

              {[
                {
                  step: '01',
                  title: 'Create Your Account',
                  description: 'Sign up as a farmer or staff member. Complete your profile with your farm details and land information.',
                  icon: Users,
                },
                {
                  step: '02',
                  title: 'Choose a Policy',
                  description: 'Browse available insurance plans, get instant quotes, and purchase the coverage that fits your needs.',
                  icon: FileText,
                },
                {
                  step: '03',
                  title: 'Submit & Track Claims',
                  description: 'File claims with document uploads, track progress in real-time, and get paid faster with automated processing.',
                  icon: ClipboardCheck,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative text-center">
                    <div className="relative z-10 mx-auto mb-6 w-16 h-16 rounded-full bg-[#006B54] flex items-center justify-center shadow-lg shadow-[#006B54]/25">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#006B54]/10 text-[#006B54] text-sm font-bold mb-3">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed max-w-xs mx-auto">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───── Stats Bar ───── */}
        <section className="bg-[#006B54] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10,000+', label: 'Farmers Protected' },
                { value: '50,000+', label: 'Policies Issued' },
                { value: '98.5%', label: 'Claim Satisfaction' },
                { value: '24/7', label: 'Support Available' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-[#A8E6D8] font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── About Section ───── */}
        <section id="about" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
                  Built for the modern agricultural industry
                </h2>
                <p className="text-lg text-[#666666] leading-relaxed">
                  AIMS leverages cutting-edge technology to streamline the entire
                  agricultural insurance lifecycle. From policy purchase to claim
                  resolution, every step is designed with farmers and insurers in mind.
                </p>
                <ul className="space-y-3">
                  {[
                    'AI-powered fraud detection for claim verification',
                    'Real-time claim tracking with status updates',
                    'Secure document management with cloud storage',
                    'Role-based access control for multi-tenant environments',
                    'Comprehensive analytics and reporting dashboards',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#006B54] mt-0.5 shrink-0" />
                      <span className="text-[#666666]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-[16px] bg-gradient-to-br from-[#F0FDF8] to-[#E8F5F0] p-8 border border-[#E8ECEF]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#006B54] flex items-center justify-center">
                        <Sprout className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Platform Highlights</p>
                        <p className="text-xs text-[#999999]">Q2 2026</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { metric: 'Avg. Claim Payout Time', value: '3.2 days', trend: '-40%' },
                        { metric: 'Fraud Detection Rate', value: '99.5%', trend: '+5%' },
                        { metric: 'Farmer Satisfaction', value: '4.8/5.0', trend: '+0.3' },
                      ].map((item) => (
                        <div key={item.metric} className="flex items-center justify-between p-3 bg-white rounded-[12px] shadow-sm">
                          <span className="text-sm text-[#666666]">{item.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#1A1A1A]">{item.value}</span>
                            <span className="text-xs text-[#22C55E] font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                              {item.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───── Final CTA Section ───── */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-[#004D3C] to-[#006B54]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to protect your farm?
            </h2>
            <p className="text-lg text-[#A8E6D8] mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and insurers already using AIMS to manage
              their agricultural insurance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#006B54] font-semibold text-base hover:bg-[#F0FDF8] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ───── Footer ───── */}
      <footer className="bg-white border-t border-[#E8ECEF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-[#006B54] flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-[#1A1A1A]">AIMS</span>
              </Link>
              <p className="text-sm text-[#666666] max-w-sm">
                Agricultural Insurance Management System — protecting farmers and
                agricultural assets through innovative insurance technology.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-3">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1A1A1A] mb-3">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Contact', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[#666666] hover:text-[#006B54] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#E8ECEF] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#999999]">
              &copy; {new Date().getFullYear()} AIMS. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs text-[#999999] hover:text-[#006B54] transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-xs text-[#999999] hover:text-[#006B54] transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
