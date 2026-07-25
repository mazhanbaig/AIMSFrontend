import { APP_NAME, APP_FULL_NAME, APP_DESCRIPTION } from '@/lib/constants';

export const siteConfig = {
  name: APP_NAME,
  fullName: APP_FULL_NAME,
  description: APP_DESCRIPTION,
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/your-org/aims',
    docs: 'https://docs.aimsplatform.com',
  },
  supportEmail: 'support@aimsplatform.com',
  defaultPageSize: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/*', 'video/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
} as const;
