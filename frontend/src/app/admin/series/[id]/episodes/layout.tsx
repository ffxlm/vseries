import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'จัดการตอน',
  description: 'จัดการตอนของซีรีส์ รวมถึงเลขตอน ชื่อตอน และลิงก์วิดีโอบน SeriesApp',
  noIndex: true,
});

export default function AdminEpisodesLayout({ children }: { children: ReactNode }) {
  return children;
}
