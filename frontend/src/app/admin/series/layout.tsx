import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'จัดการซีรีส์',
  description: 'จัดการรายการซีรีส์ โปสเตอร์ ภาษา และสถานะการแสดงผลบน SeriesApp',
  noIndex: true,
});

export default function AdminSeriesLayout({ children }: { children: ReactNode }) {
  return children;
}
