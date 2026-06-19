import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'แก้ไขซีรีส์',
  description: 'แก้ไขข้อมูลซีรีส์ โปสเตอร์ ภาษา และสถานะการแสดงผลบน SeriesApp',
  noIndex: true,
});

export default function EditSeriesLayout({ children }: { children: ReactNode }) {
  return children;
}
