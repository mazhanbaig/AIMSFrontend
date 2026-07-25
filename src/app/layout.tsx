import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AIMS - Agricultural Insurance Management System',
    template: '%s | AIMS',
  },
  description:
    'A comprehensive platform for managing agricultural insurance policies, claims, and fraud detection.',
  keywords: ['agriculture', 'insurance', 'claims', 'fraud detection', 'farmers'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
