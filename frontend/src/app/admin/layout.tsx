import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminShell from '@/components/AdminShell';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Admin Console',
  description: 'พื้นที่จัดการข้อมูลซีรีส์ ตอน และภาพรวมระบบของ VSeries',
  noIndex: true,
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
