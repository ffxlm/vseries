import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Admin Login',
  description: 'เข้าสู่ระบบหลังบ้านของ SeriesApp',
  noIndex: true,
});

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return children;
}
