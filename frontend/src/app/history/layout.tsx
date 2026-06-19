import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'ประวัติการเข้าชม',
  description: 'กลับไปดูซีรีส์และตอนล่าสุดที่เคยรับชมบน VSeries ได้จากหน้าประวัติการเข้าชม',
  canonical: '/history',
  noIndex: true,
});

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
