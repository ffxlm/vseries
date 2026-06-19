import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'เพิ่มซีรีส์ใหม่',
  description: 'เพิ่มข้อมูลซีรีส์ใหม่เข้าสู่ระบบหลังบ้านของ SeriesApp',
  noIndex: true,
});

export default function CreateSeriesLayout({ children }: { children: ReactNode }) {
  return children;
}
